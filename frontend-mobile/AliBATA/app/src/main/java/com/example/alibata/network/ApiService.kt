package com.example.alibata.network

import com.example.alibata.models.AuthenticationResponse
import com.example.alibata.models.UserEntity
import retrofit2.http.*

interface ApiService {

    @GET("users")  // Adjust the path based on your API endpoint
    suspend fun getAllUsers(@Header("Authorization") token: String): List<UserEntity>  // <-- This method

    @GET("users/{id}")
    suspend fun getUser(@Header("Authorization") token: String, @Path("id") id: Int): UserEntity

    @POST("users")
    suspend fun createUser(@Header("Authorization") token: String, @Body user: UserEntity): UserEntity

    @PUT("users")
    suspend fun updateUser(@Header("Authorization") token: String, @Query("id") id: Int, @Body user: UserEntity): UserEntity

    @DELETE("users/{id}")
    suspend fun deleteUser(@Header("Authorization") token: String, @Path("id") id: Int): String

    @POST("auth/login")
    suspend fun loginUser(@Body loginRequest: LoginRequest): AuthenticationResponse

    @POST("auth/register") // Adjust the path if needed
    suspend fun registerUser(@Body registerRequest: RegisterRequest): retrofit2.Response<Unit>

    @POST("auth/logout")
    suspend fun logoutuser()


}


data class LoginRequest(val email: String, val password: String)