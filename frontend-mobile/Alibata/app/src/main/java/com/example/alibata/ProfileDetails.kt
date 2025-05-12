package com.example.alibata

import android.content.Intent
import android.os.Bundle
import android.util.Base64
import android.util.Log
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.example.alibata.databinding.ActivityProfileDetailsBinding
import com.example.alibata.models.UserEntity
import com.example.alibata.network.RetrofitInstance
import com.example.alibata.utils.TokenManager
import kotlinx.coroutines.launch
import org.json.JSONObject

class ProfileDetails : AppCompatActivity() {    private lateinit var binding: ActivityProfileDetailsBinding
    private var currentUser: UserEntity? = null
    private val api by lazy { RetrofitInstance.apiService }
    private lateinit var tvYourRank: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileDetailsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Retrieve raw token and decode
        val rawToken = TokenManager.getToken(this)
        if (rawToken.isNullOrEmpty()) {
            Toast.makeText(this, "Token not found", Toast.LENGTH_SHORT).show()
            return
        }
        val payload = decodeJwt(rawToken)
        if (payload == null) {
            Toast.makeText(this, "Invalid token", Toast.LENGTH_SHORT).show()
            return
        }
        val userId = payload.userId

        // Populate email placeholder (server will overwrite)
        binding.etEmail.setText(payload.sub)

        // Button listeners
        binding.btnEdit.setOnClickListener { enterEditMode() }
        binding.btnSave.setOnClickListener {
            // Automatically include stored password
            doUpdate(userId)
        }


        // Load profile data
        fetchProfile(userId)
        binding.profileReturn.setOnClickListener {
            finish()
        }
    }


    private fun fetchProfile(userId: Int) {
        lifecycleScope.launch {
            try {
                val bearer = "Bearer ${TokenManager.getToken(this@ProfileDetails)}"
                val user = api.getUser(bearer, userId)
                Log.d("ProfileActivity", "Fetched user: $user")
                currentUser = user
                showProfile(user)
            } catch (e: Exception) {
                Toast.makeText(this@ProfileDetails, "Failed to load profile", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showProfile(user: UserEntity) {
        currentUser = user
        binding.etFirstName.setText(user.firstName)
        binding.etMiddleName.setText(user.middleName)
        binding.etLastName.setText(user.lastName)
        binding.etEmail.setText(user.email)

        val subscribed = user.subscriptionStatus
        Log.d("SubscriptionCheck", "Subscription status: $subscribed")

        val colorRes = if (subscribed) R.color.pastel_green else android.R.color.darker_gray
        val color = ContextCompat.getColor(this, colorRes)
        binding.viewSubscriptionStatus.setBackgroundColor(color)

        binding.btnSave.visibility = View.GONE
        binding.btnEdit.visibility = View.VISIBLE

        setInputsEnabled(false)
    }

    private fun enterEditMode() {
        binding.btnSave.visibility = View.VISIBLE
        binding.btnEdit.visibility = View.GONE
        setInputsEnabled(true)
    }

    private fun doUpdate(userId: Int) {
        // Retrieve password stored securely at login
        val storedPassword = TokenManager.getPassword(this)
        if (storedPassword.isNullOrEmpty()) {
            Toast.makeText(this, "Stored password not found", Toast.LENGTH_SHORT).show()
            return
        }

        val role = currentUser?.role ?: ""
        // Use Kotlin's copy() to create an updated user entity
        val updated = currentUser!!.copy(
            firstName = binding.etFirstName.text.toString(),
            middleName = binding.etMiddleName.text.toString(),
            lastName = binding.etLastName.text.toString(),
            email = binding.etEmail.text.toString(),
            password = storedPassword,
            subscriptionStatus = currentUser?.subscriptionStatus ?: false,
            role = role
        )

        lifecycleScope.launch {
            try {
                val bearer = "Bearer ${TokenManager.getToken(this@ProfileDetails)}"
                val resp = api.updateUser(bearer, userId, updated)
                showProfile(resp)
                Toast.makeText(this@ProfileDetails, "Profile updated", Toast.LENGTH_SHORT).show()
            } catch (e: Exception) {
                Toast.makeText(this@ProfileDetails, "Update failed", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private suspend fun computeAndShowUserRank(userId: Int, rawToken: String) {
        try {
            val board = api.getLeaderboard("Bearer $rawToken")
                .sortedByDescending { it.score }

            // find your 0‑based position, then +1
            val position = board.indexOfFirst { it.userId == userId } + 1

            // if not on the board, show “–”
            tvYourRank.text = if (position > 0)
                "Leaderboard Rank #$position"
            else
                "Leaderboard Rank # –"

        } catch (e: Exception) {
            Log.e("ProfileFragment", "Failed to fetch leaderboard", e)
            tvYourRank.text = "Leaderboard Rank # –"
        }
    }

    private fun setInputsEnabled(enabled: Boolean) {
        binding.tilFirstName.isEnabled = enabled
        binding.tilMiddleName.isEnabled = enabled
        binding.tilLastName.isEnabled = enabled
        binding.tilEmail.isEnabled = enabled
    }

    // JWT decoder
    private fun decodeJwt(token: String): JwtPayload? {
        val parts = token.split('.')
        if (parts.size != 3) return null
        val payloadJson = String(
            Base64.decode(parts[1], Base64.URL_SAFE or Base64.NO_PADDING or Base64.NO_WRAP),
            charset("UTF-8")
        )
        val json = JSONObject(payloadJson)
        return JwtPayload(
            userId = json.optInt("userId"),
            sub    = json.optString("sub"),
            iat    = json.optLong("iat"),
            exp    = json.optLong("exp")
        )
    }

    data class JwtPayload(
        val userId: Int,
        val sub: String,
        val iat: Long,
        val exp: Long
    )

}