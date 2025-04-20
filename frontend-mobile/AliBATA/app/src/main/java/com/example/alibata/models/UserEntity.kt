package com.example.alibata.models

data class UserEntity(
    val firstName: String,
    val middleName: String,
    val lastName: String,
    val email: String,
    val password: String,
    val subscriptionStatus: Boolean,
    val role: String = "USER" // default to USER
)