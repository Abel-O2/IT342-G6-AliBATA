package com.example.alibata

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.alibata.network.RegisterRequest
import com.example.alibata.network.RetrofitInstance
import com.google.android.material.textfield.TextInputLayout
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import retrofit2.Response

class Register : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_register)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            insets
        }


        val btnReturn = findViewById<ImageButton>(R.id.btnRegReturn)
        btnReturn.setOnClickListener {
            finish()
        }

        val btnRegister = findViewById<Button>(R.id.btnRegister)
        val firstNameInput = findViewById<TextInputLayout>(R.id.textInputLayout).editText
        val middleNameInput = findViewById<TextInputLayout>(R.id.textMNameInputLayout).editText
        val lastNameInput = findViewById<TextInputLayout>(R.id.textLNameInputLayout).editText
        val emailInput = findViewById<TextInputLayout>(R.id.textEmailInputLayout).editText
        val passwordInput = findViewById<TextInputLayout>(R.id.textPasswordInputLayout).editText
        val confirmPasswordInput = findViewById<TextInputLayout>(R.id.textConfirmPasswordInputLayout).editText
        val agreeToTerms = findViewById<CheckBox>(R.id.regAgreeToTerms)

        btnRegister.setOnClickListener {
            val firstName   = firstNameInput?.text.toString().trim()
            val middleName  = middleNameInput?.text.toString().trim()
            val lastName    = lastNameInput?.text.toString().trim()
            val email       = emailInput?.text.toString().trim()
            val password    = passwordInput?.text.toString()
            val confirmPass = confirmPasswordInput?.text.toString()
            val agreed      = agreeToTerms.isChecked

            when {
                listOf(firstName, lastName, email, password).any { it.isEmpty() } ->
                    Toast.makeText(this, "Please fill in all required fields.", Toast.LENGTH_SHORT).show()
                password != confirmPass ->
                    Toast.makeText(this, "Passwords do not match.", Toast.LENGTH_SHORT).show()
                !agreed ->
                    Toast.makeText(this, "Please agree to the terms and conditions.", Toast.LENGTH_SHORT).show()
                else ->
                    registerUser(firstName, middleName, lastName, email, password)
            }
        }
    }

    private fun registerUser(
        firstName: String,
        middleName: String,
        lastName: String,
        email: String,
        password: String,
    ) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val request = RegisterRequest(
                    firstName, middleName, lastName,
                    email, password
                )
                val response: Response<Unit> =
                    RetrofitInstance.apiService.registerUser(request)

                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(
                            this@Register,
                            "Registration successful! Please log in.",
                            Toast.LENGTH_LONG
                        ).show()
                        startActivity(Intent(this@Register, Login::class.java))
                        finish()
                    } else {
                        // Parse API’s error message if available
                        val errBody = response.errorBody()?.string() ?: "Unknown error"
                        Toast.makeText(
                            this@Register,
                            "Failed to register: $errBody",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@Register, "Error: ${e.message}", Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}
