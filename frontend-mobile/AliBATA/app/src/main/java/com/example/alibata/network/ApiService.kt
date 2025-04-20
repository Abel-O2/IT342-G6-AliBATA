package com.example.alibata.network

import com.example.alibata.models.AuthenticationResponse
import com.example.alibata.models.UserEntity
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    // PUBLIC
    @POST("auth/register")
    suspend fun registerUser(@Body registerRequest: RegisterRequest): Response<Unit>

    @POST("auth/login")
    suspend fun loginUser(@Body loginRequest: LoginRequest): Response<AuthenticationResponse>

    // PROTECTED
    @GET("users")
    suspend fun getAllUsers(@Header("Authorization") bearerToken: String): List<UserEntity>

    @GET("users/{id}")
    suspend fun getUser(@Header("Authorization") bearerToken: String, @Path("id") id: Int): UserEntity

    @POST("users")
    suspend fun createUser(
        @Header("Authorization") bearerToken: String,
        @Body user: UserEntity
    ): UserEntity

    @PUT("users")
    suspend fun updateUser(
        @Header("Authorization") bearerToken: String,
        @Query("id") id: Int,
        @Body user: UserEntity
    ): UserEntity

    @DELETE("users/{id}")
    suspend fun deleteUser(
        @Header("Authorization") bearerToken: String,
        @Path("id") id: Int
    ): String

    @POST("auth/logout")
    suspend fun logout(@Header("Authorization") token: String)


}
