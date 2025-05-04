package com.example.alibata

import android.content.Intent
import android.content.Context
import android.os.Bundle
import android.widget.*
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.alibata.network.LoginRequest
import com.example.alibata.network.RetrofitInstance
import com.example.alibata.utils.TokenManager
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
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

        val btnLogin = findViewById<Button>(R.id.btnLoginEnter)
        val emailET = (findViewById<TextInputLayout>(R.id.textInputLayout)).editText as TextInputEditText
        val passET  = (findViewById<TextInputLayout>(R.id.textPasswordInputLayout)).editText as TextInputEditText

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
                val req: LoginRequest = LoginRequest(email, password)
                val response: Response<com.example.alibata.models.AuthenticationResponse> =
                    RetrofitInstance.apiService.loginUser(req)

                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        val token = response.body()!!.token
                        TokenManager.saveToken(this@Login, token)
                        TokenManager.savePassword(this@Login, password) // Save password securely

                        startActivity(Intent(this@Login, Homepage::class.java))
                        finish()
                    } else {
                        val err = response.errorBody()?.string() ?: response.message()
                        Toast.makeText(this@Login, "Login failed: $err", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@Login, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}