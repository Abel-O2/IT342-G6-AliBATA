package com.example.alibata.network

data class RegisterRequest(
    val firstName: String,
    val middleName: String,
    val lastName: String,
    val email: String,
    val password: String
)