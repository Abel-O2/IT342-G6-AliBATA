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
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class Register : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_register)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val btnReturn = findViewById<ImageButton>(R.id.btnRegReturn)
        btnReturn.setOnClickListener {
            startActivity(Intent(this, MainActivity::class.java))
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
            val firstName = firstNameInput?.text.toString()
            val middleName = middleNameInput?.text.toString()
            val lastName = lastNameInput?.text.toString()
            val email = emailInput?.text.toString()
            val password = passwordInput?.text.toString()
            val confirmPassword = confirmPasswordInput?.text.toString()
            val agreed = agreeToTerms.isChecked

            if (firstName.isBlank() || lastName.isBlank() || email.isBlank() || password.isBlank()) {
                Toast.makeText(this, "Please fill in all required fields.", Toast.LENGTH_SHORT).show()
            } else if (password != confirmPassword) {
                Toast.makeText(this, "Passwords do not match.", Toast.LENGTH_SHORT).show()
            } else if (!agreed) {
                Toast.makeText(this, "Please agree to the terms and conditions.", Toast.LENGTH_SHORT).show()
            } else {
                registerUser(firstName, middleName, lastName, email, password)
            }
        }
    }

    private fun registerUser(
        firstName: String,
        middleName: String,
        lastName: String,
        email: String,
        password: String
    ) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val request = RegisterRequest(firstName, middleName, lastName, email, password)
                val response = RetrofitInstance.apiService.registerUser(request)

                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@Register, "Registration successful! Please log in.", Toast.LENGTH_LONG).show()
                        startActivity(Intent(this@Register, Login::class.java))
                        finish()
                    } else {
                        Toast.makeText(this@Register, "Failed to register: ${response.code()}", Toast.LENGTH_LONG).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@Register, "Error: ${e.message}", Toast.LENGTH_LONG).show()
                }
                e.printStackTrace()
            }
        }
    }
}
