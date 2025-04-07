package com.example.alibata

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.alibata.models.UserEntity
import com.example.alibata.network.LoginRequest
import com.example.alibata.network.RetrofitInstance
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class Login : AppCompatActivity() {

    object TokenManager {
        private const val PREF_NAME = "MyPrefs"
        private const val KEY_TOKEN = "jwtToken"

        fun saveToken(context: Context, token: String) {
            val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            prefs.edit().putString(KEY_TOKEN, token).apply()
        }

        fun getToken(context: Context): String? {
            val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            return prefs.getString(KEY_TOKEN, null)
        }

        fun clearToken(context: Context) {
            val pref: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            pref.edit().remove(KEY_TOKEN).apply()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_login)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val btnLogin = findViewById<Button>(R.id.btnLoginEnter)
        val emailTextInputLayout = findViewById<TextInputLayout>(R.id.textInputLayout)
        val passwordTextInputLayout = findViewById<TextInputLayout>(R.id.textPasswordInputLayout)
        val emailEditText = emailTextInputLayout.editText as TextInputEditText
        val passwordEditText = passwordTextInputLayout.editText as TextInputEditText

        btnLogin.setOnClickListener {
            val email = emailEditText.text.toString()
            val password = passwordEditText.text.toString()

            if (email.isNotEmpty() && password.isNotEmpty()) {
                loginUser(email, password)
            } else {
                Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun loginUser(email: String, password: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val loginRequest = LoginRequest(email, password)
                val response = RetrofitInstance.apiService.loginUser(loginRequest)

                withContext(Dispatchers.Main) {
                    if (response != null) {
                        val token = response.token

                        TokenManager.saveToken(this@Login, token)

                        val intent = Intent(this@Login, Homepage::class.java)
                        startActivity(intent)
                        finish()
                    } else {
                        Toast.makeText(this@Login, "Login failed. Invalid credentials.", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@Login, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
                e.printStackTrace()
            }
        }
    }


    private fun fetchUserData() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Get the token from SharedPreferences
                val token = TokenManager.getToken(this@Login)
                if (token != null) {
                    // Now make the API call with the Bearer token
                    val response = RetrofitInstance.apiService.getAllUsers("Bearer $token")
                    withContext(Dispatchers.Main) {
                        // Handle the response
                        if (response.isNotEmpty()) {
                            // Do something with the response (e.g., show user data)
                        } else {
                            Toast.makeText(this@Login, "No users found.", Toast.LENGTH_SHORT).show()
                        }
                    }
                } else {
                    Toast.makeText(this@Login, "Token not found. Please login again.", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@Login, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
                e.printStackTrace()
            }
        }
    }
}

