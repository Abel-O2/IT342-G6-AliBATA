package com.example.alibata

import android.content.Intent
import android.os.Bundle
import android.util.Base64
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.example.alibata.network.RetrofitInstance
import com.example.alibata.utils.TokenManager
import kotlinx.coroutines.launch
import org.json.JSONObject

class ProfileFragment : Fragment(R.layout.fragment_profile) {

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Load and display user's full name with middle initial
        loadUserFullName(view)

        // Edit Details Button: navigates to ProfileDetails
        val editDetailsButton = view.findViewById<Button>(R.id.edit_details_button)
        editDetailsButton.setOnClickListener {
            val intent = Intent(requireContext(), ProfileDetails::class.java)
            startActivity(intent)
        }

        // Logout Button
        val logoutButton = view.findViewById<Button>(R.id.btnLogout)
        logoutButton.setOnClickListener {
            lifecycleScope.launch {
                val token = TokenManager.getToken(requireContext())
                if (token.isNullOrEmpty()) {
                    Toast.makeText(requireContext(), "Token not found", Toast.LENGTH_SHORT).show()
                    return@launch
                }
                Log.d("ProfileFragment", "Attempting logout with token: $token")
                val bearer = "Bearer $token"
                try {
                    RetrofitInstance.apiService.logout(bearer)
                    Log.d("ProfileFragment", "Logout API call successful.")
                } catch (e: Exception) {
                    Log.e("ProfileFragment", "Logout failed: ${e.localizedMessage}")
                    Toast.makeText(
                        requireContext(),
                        "Logout failed on server: ${e.localizedMessage}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                TokenManager.clearToken(requireContext())
                TokenManager.clearPassword(requireContext())
                Log.d("ProfileFragment", "Local token and password cleared.")
                startActivity(Intent(requireContext(), Login::class.java))
                requireActivity().finish()
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

        val userId = decodeJwt(token)?.userId ?: run {
            profileNameTextView.text = "Unknown User"
            return
        }

        lifecycleScope.launch {
            try {
                val bearer = "Bearer $token"
                val user = RetrofitInstance.apiService.getUser(bearer, userId)
                val middleInitial = user.middleName.firstOrNull()?.uppercase() ?: ""
                val displayName = "${user.firstName} ${middleInitial}. ${user.lastName}"
                profileNameTextView.text = displayName
            } catch (e: Exception) {
                Log.e("ProfileFragment", "Failed to load user: ${e.localizedMessage}")
                profileNameTextView.text = "Failed to load name"
            }
        }
    }

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
