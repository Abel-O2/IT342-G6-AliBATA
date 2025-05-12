package com.example.alibata

import android.content.Intent
import android.os.Bundle
import android.view.inputmethod.EditorInfo
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.alibata.network.LoginRequest
import com.example.alibata.network.RetrofitInstance
import com.example.alibata.utils.TokenManager
import com.google.android.material.textfield.TextInputEditText
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import retrofit2.Response

class Login : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_login)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            insets
        }

        // Locate views by their new IDs
        val emailET = findViewById<TextInputEditText>(R.id.etEmail)
        val passET  = findViewById<TextInputEditText>(R.id.etPassword)
        val btnLogin = findViewById<Button>(R.id.btnLoginEnter)

        // When “Next” is pressed on the email field, move focus to password
        emailET.setOnEditorActionListener(TextView.OnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_NEXT) {
                passET.requestFocus()
                true
            } else {
                false
            }
        })

        // When “Done” is pressed on the password field, trigger login
        passET.setOnEditorActionListener(TextView.OnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                btnLogin.performClick()
                true
            } else {
                false
            }
        })

        btnLogin.setOnClickListener {
            val email = emailET.text.toString().trim()
            val pass  = passET.text.toString()
            if (email.isNotEmpty() && pass.isNotEmpty()) {
                loginUser(email, pass)
            } else {
                Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun loginUser(email: String, password: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val req = LoginRequest(email, password)
                val response = RetrofitInstance.apiService.loginUser(req)

                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        val token = response.body()!!.token
                        TokenManager.saveToken(this@Login, token)
                        TokenManager.savePassword(this@Login, password)

                        startActivity(Intent(this@Login, Homepage::class.java))
                        finish()
                    } else {
                        when (response.code()) {
                            400, 401, 403 -> {
                                Toast.makeText(
                                    this@Login,
                                    "Incorrect email or password. Please try again.",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                            else -> {
                                val errBody = response.errorBody()?.string()
                                Toast.makeText(
                                    this@Login,
                                    "Login failed: ${errBody ?: "Unexpected error occurred"}",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                        }
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    val msg = when (e) {
                        is java.net.UnknownHostException -> "No internet connection."
                        else -> "An error occurred: ${e.localizedMessage}"
                    }
                    Toast.makeText(this@Login, msg, Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}
