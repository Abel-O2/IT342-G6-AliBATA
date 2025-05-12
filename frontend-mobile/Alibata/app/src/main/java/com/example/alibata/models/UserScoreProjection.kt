package com.example.alibata.models

import com.google.gson.annotations.SerializedName

data class UserScoreProjection(
    val score: Int,
    @SerializedName("user_UserId") val userId: Int,
    @SerializedName("user_FirstName") val firstName: String,
    @SerializedName("user_LastName") val lastName: String
)
