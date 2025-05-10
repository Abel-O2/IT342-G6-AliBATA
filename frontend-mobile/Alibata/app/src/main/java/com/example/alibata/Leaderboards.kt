package com.example.alibata

import android.os.Bundle
import android.util.Base64
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.alibata.databinding.ActivityLeaderboardsBinding
import com.example.alibata.models.UserScoreProjection
import com.example.alibata.network.RetrofitInstance
import com.example.alibata.utils.TokenManager
import kotlinx.coroutines.launch
import org.json.JSONObject

class Leaderboards : AppCompatActivity() {

    private lateinit var binding: ActivityLeaderboardsBinding
    private val api by lazy { RetrofitInstance.apiService }
    private val adapter = LeaderboardAdapter()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Inflate with ViewBinding
        binding = ActivityLeaderboardsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Handle window insets
        ViewCompat.setOnApplyWindowInsetsListener(binding.main) { v, insets ->
            val sys = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(sys.left, sys.top, sys.right, sys.bottom)
            insets
        }

        // RecyclerView setup
        binding.rvLeaderboard.apply {
            layoutManager = LinearLayoutManager(this@Leaderboards)
            adapter = this@Leaderboards.adapter
            addItemDecoration(
                DividerItemDecoration(context, DividerItemDecoration.VERTICAL)
            )
        }

        // Return button click
        binding.leaderboardReturn.setOnClickListener {
            finish()
        }

        fetchLeaderboard()
    }

    private fun fetchLeaderboard() = lifecycleScope.launch {
        try {
            val rawToken = TokenManager.getToken(this@Leaderboards)
            if (rawToken.isNullOrEmpty()) {
                Toast.makeText(this@Leaderboards, "Token not found", Toast.LENGTH_SHORT).show()
                return@launch
            }

            val bearer = "Bearer $rawToken"
            val list: List<UserScoreProjection> = api.getLeaderboard(bearer)
            adapter.submitList(list)
        } catch (e: Exception) {
            e.printStackTrace()
            Toast.makeText(this@Leaderboards, "Failed to load leaderboard", Toast.LENGTH_SHORT).show()
        }
    }

    // TokenManager.kt (add this function)
    fun decodeJwt(token: String): ProfileDetails.JwtPayload? {
        return try {
            val parts = token.split('.')
            if (parts.size != 3) return null
            val payloadJson = String(
                Base64.decode(parts[1], Base64.URL_SAFE or Base64.NO_PADDING or Base64.NO_WRAP),
                charset("UTF-8")
            )
            val json = JSONObject(payloadJson)
            ProfileDetails.JwtPayload(
                userId = json.optInt("userId"),
                sub = json.optString("sub"),
                iat = json.optLong("iat"),
                exp = json.optLong("exp")
            )
        } catch (e: Exception) {
            null
        }
    }

}
