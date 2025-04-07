package com.example.alibata.models

data class UserEntity(
    val id: Int = 0,
    val name: String,
    val email: String,
    val password: String,
    val phone: String,
    val address: String
)