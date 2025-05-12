package com.example.alibata

import android.content.Intent
import android.os.Bundle
import android.util.Base64
import android.util.Log
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.example.alibata.network.RetrofitInstance
import com.example.alibata.utils.TokenManager
import kotlinx.coroutines.launch
import org.json.JSONObject

class ProfileFragment : Fragment(R.layout.fragment_profile) {

    private lateinit var amountCompletedTextView: TextView
    private lateinit var profileScoreTextView: TextView
    private lateinit var rankTextView: TextView
    private lateinit var rankContainer: View
    private lateinit var leaderboardRankTextView: TextView

    private val api by lazy { RetrofitInstance.apiService }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        amountCompletedTextView   = view.findViewById(R.id.amountCompleted)
        profileScoreTextView      = view.findViewById(R.id.profile_score)
        rankTextView              = view.findViewById(R.id.rank_text)
        rankContainer             = view.findViewById(R.id.rank_container)
        leaderboardRankTextView   = view.findViewById(R.id.leaderboard_rank)

        loadUserFullName(view)

        view.findViewById<View>(R.id.edit_details_button).setOnClickListener {
            startActivity(Intent(requireContext(), ProfileDetails::class.java))
        }
        view.findViewById<View>(R.id.btnLeaderboard).setOnClickListener {
            startActivity(Intent(requireContext(), Leaderboards::class.java))
        }
        view.findViewById<View>(R.id.btnLegal).setOnClickListener {
            startActivity(Intent(requireContext(), Legal::class.java))
        }
        view.findViewById<View>(R.id.btnHelpCenter).setOnClickListener {
            startActivity(Intent(requireContext(), Help::class.java))
        }
        view.findViewById<View>(R.id.btnLogout).setOnClickListener {
            lifecycleScope.launch {
                TokenManager.getToken(requireContext())?.let { token ->
                    try {
                        api.logout("Bearer $token")
                        Log.d("ProfileFragment", "Logout successful.")
                    } catch (e: Exception) {
                        Log.e("ProfileFragment", "Logout failed: ${e.localizedMessage}")
                        Toast.makeText(
                            requireContext(),
                            "Logout failed: ${e.localizedMessage}",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                    TokenManager.clearToken(requireContext())
                    TokenManager.clearPassword(requireContext())
                    startActivity(Intent(requireContext(), Login::class.java))
                    requireActivity().finish()
                }
            }
        }

        displayUserStats()
        fetchCompletedActivities()
    }

    private fun displayUserStats() {
        val token = TokenManager.getToken(requireContext()) ?: run {
            profileScoreTextView.text = "0"
            rankTextView.text = getString(R.string.rank_novice)
            setRankContainerColor(R.color.rank_color_novice)
            leaderboardRankTextView.text = "Rank: –"
            return
        }
        val payload = decodeJwt(token) ?: return
        val userId = payload.userId.takeIf { it != 0 }
            ?: payload.sub.toIntOrNull() ?: return

        lifecycleScope.launch {
            try {
                // 1) overall score
                val totalPoints = api
                    .getTotalScoreForUser("Bearer $token", userId)
                    .takeIf { it.isSuccessful }
                    ?.body() ?: 0
                profileScoreTextView.text = totalPoints.toString()

                // 2) badge
                when {
                    totalPoints >= 20 -> {
                        rankTextView.text = getString(R.string.rank_diamond)
                        setRankContainerColor(R.color.rank_color_diamond)
                    }
                    totalPoints >= 15 -> {
                        rankTextView.text = getString(R.string.rank_gold)
                        setRankContainerColor(R.color.rank_color_gold)
                    }
                    totalPoints >= 10 -> {
                        rankTextView.text = getString(R.string.rank_silver)
                        setRankContainerColor(R.color.rank_color_silver)
                    }
                    totalPoints >= 5  -> {
                        rankTextView.text = getString(R.string.rank_bronze)
                        setRankContainerColor(R.color.rank_color_bronze)
                    }
                    else -> {
                        rankTextView.text = getString(R.string.rank_novice)
                        setRankContainerColor(R.color.rank_color_novice)
                    }
                }

                // 3) numeric leaderboard position
                computeAndShowUserRank(userId, token)

            } catch (e: Exception) {
                Log.e("ProfileFragment", "Failed to fetch overall score: ${e.localizedMessage}")
                profileScoreTextView.text = "0"
                rankTextView.text = getString(R.string.rank_novice)
                setRankContainerColor(R.color.rank_color_novice)
                leaderboardRankTextView.text = "Rank: –"
            }
        }
    }

    private suspend fun computeAndShowUserRank(userId: Int, rawToken: String) {
        try {
            val board = api.getLeaderboard("Bearer $rawToken")
                .sortedByDescending { it.score }

            val position = board.indexOfFirst { it.userId == userId } + 1
            leaderboardRankTextView.text = if (position > 0)
                "Leaderboard Rank #$position"
            else
                "Leaderboard Rank # –"

        } catch (e: Exception) {
            Log.e("ProfileFragment", "Failed to fetch leaderboard: ${e.localizedMessage}")
            leaderboardRankTextView.text = "Leaderboard Rank # –"
        }
    }

    private fun setRankContainerColor(colorRes: Int) {
        rankContainer.setBackgroundColor(
            ContextCompat.getColor(requireContext(), colorRes)
        )
    }

    private fun fetchCompletedActivities() {
        viewLifecycleOwner.lifecycleScope.launch {
            val token = TokenManager.getToken(requireContext()) ?: return@launch
            val payload = decodeJwt(token) ?: return@launch
            val userId = payload.userId.takeIf { it != 0 }
                ?: payload.sub.toIntOrNull() ?: return@launch

            try {
                val userActivities = api.getActivitiesForUser("Bearer $token", userId)
                val completedCount = userActivities.count { it.completed }
                amountCompletedTextView.text = completedCount.toString()
            } catch (e: Exception) {
                Log.e("ProfileFragment", "Failed to fetch completed activities: ${e.localizedMessage}")
                amountCompletedTextView.text = "0"
            }
        }
    }

    private fun loadUserFullName(view: View) {
        val profileNameTextView = view.findViewById<TextView>(R.id.profile_name)
        val token = TokenManager.getToken(requireContext())
        if (token.isNullOrEmpty()) {
            profileNameTextView.text = "Unknown User"
            return
        }
        val payload = decodeJwt(token) ?: return

        lifecycleScope.launch {
            try {
                val user = api.getUser("Bearer $token", payload.userId)
                val initial = user.middleName.firstOrNull()?.uppercase() ?: ""
                profileNameTextView.text = "${user.firstName} $initial. ${user.lastName}"
            } catch (e: Exception) {
                Log.e("ProfileFragment", "Load name failed: ${e.localizedMessage}")
                profileNameTextView.text = "Unknown User"
            }
        }
    }

    private fun decodeJwt(token: String): JwtPayload? {
        return try {
            val parts = token.split('.')
            if (parts.size != 3) return null
            val payloadJson = String(
                Base64.decode(parts[1], Base64.URL_SAFE or Base64.NO_PADDING or Base64.NO_WRAP)
            )
            val json = JSONObject(payloadJson)
            JwtPayload(
                userId = json.optInt("userId"),
                sub    = json.optString("sub"),
                iat    = json.optLong("iat"),
                exp    = json.optLong("exp")
            )
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    data class JwtPayload(val userId: Int, val sub: String, val iat: Long, val exp: Long)
}
