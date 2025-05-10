package com.example.alibata.network

import com.example.alibata.models.Activity
import com.example.alibata.models.AuthenticationResponse
import com.example.alibata.models.Question
import com.example.alibata.models.UserActivity
import com.example.alibata.models.UserEntity
import com.example.alibata.models.UserScoreResponse
import com.example.alibata.models.UserStory
import com.example.alibata.models.Story
import com.example.alibata.models.UserScoreProjection
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    // PUBLIC
    @POST("auth/register")
    suspend fun registerUser(@Body registerRequest: RegisterRequest): Response<Unit>

    @POST("auth/login")
    suspend fun loginUser(@Body loginRequest: LoginRequest): Response<AuthenticationResponse>

    // PROTECTED (bearerToken = "Bearer <token>")
    @GET("users")
    suspend fun getAllUsers(@Header("Authorization") bearerToken: String): List<UserEntity>

    @GET("users/{id}")
    suspend fun getUser(
        @Header("Authorization") bearerToken: String,
        @Path("id") id: Int
    ): UserEntity

    @POST("users")
    suspend fun createUser(
        @Header("Authorization") bearerToken: String,
        @Body user: UserEntity
    ): UserEntity

    @PUT("users/{id}")
    suspend fun updateUser(
        @Header("Authorization") bearerToken: String,
        @Path("id") id: Int,
        @Body user: UserEntity
    ): UserEntity

    @DELETE("users/{id}")
    suspend fun deleteUser(
        @Header("Authorization") bearerToken: String,
        @Path("id") id: Int
    ): String

    @POST("auth/logout")
    suspend fun logout(@Header("Authorization") token: String)

    @GET("stories")
    suspend fun getAllStories(@Header("Authorization") bearerToken: String): List<Story>

    @GET("stories/users/{userId}")
    suspend fun getStoriesForUser(
        @Header("Authorization") bearerToken: String,
        @Path("userId") userId: Int
    ): List<UserStory>

    @PUT("stories/{id}/completed/{userId}")
    suspend fun markStoryAsComplete(
        @Header("Authorization") bearerToken: String,
        @Path("id") storyId: Int,
        @Path("userId") userId: Int
    ): Response<Void>

    @GET("activities/users/{userId}")
    suspend fun getActivitiesForUser(
        @Header("Authorization") bearerToken: String,
        @Path("userId") userId: Int
    ): List<UserActivity>

    @GET("activities")
    suspend fun getAllActivities(
        @Header("Authorization") bearerToken: String
    ): List<Activity>

    @GET("activities/{activityId}")
    suspend fun getActivity(
        @Header("Authorization") bearer: String,
        @Path("activityId") activityId: Int
    ): Activity

    // you can keep this around if you ever need questions by themselves:
    @GET("questions/activities/{activityId}")
    suspend fun getQuestionsForActivity(
        @Header("Authorization") bearerToken: String,
        @Path("activityId") activityId: Int
    ): List<Question>

    @PUT("activities/{id}/completed/{userId}")
    suspend fun markActivityAsCompleted(
        @Header("Authorization") bearerToken: String,
        @Path("id") activityId: Int,
        @Path("userId") userId: Int
    ): Response<Void>

    @GET("scores/users/{userId}/total")
    suspend fun getUserScore(
        @Header("Authorization") authorization: String,
        @Path("userId") userId: Int
    ): UserScoreResponse

    @PUT("scores/{id}")
    suspend fun updateUserScore(
        @Header("Authorization") bearerToken: String,
        @Path("id") userId: Int,
        @Body newScore: Int
    ): Response<Unit>

    @POST("scores/award/questions/{questionId}/users/{userId}")
    suspend fun awardScoreToUser(
        @Header("Authorization") bearer: String,
        @Path("questionId") questionId: Int,
        @Path("userId") userId: Int,
        @Query("selectedChoiceId") selectedChoiceId: Int
    ): Response<Void>

    /**
     * Award score for a phrase‐translation game (ordered choices)
     */
    @POST("scores/award/translation/questions/{questionId}/users/{userId}")
    suspend fun awardScoreForTranslationGame(
        @Header("Authorization") bearer: String,
        @Path("questionId") questionId: Int,
        @Path("userId") userId: Int,
        @Body selectedChoiceIds: List<Int>
    ): Response<Void>

    /**
     * Fetch total accumulated score for the current user
     */
    @GET("scores/users/{userId}/total")
    suspend fun getTotalScoreForUser(
        @Header("Authorization") bearer: String,
        @Path("userId") userId: Int
    ): Response<Int>

    @GET("scores/leaderboard")
    suspend fun getLeaderboard(
        @Header("Authorization") bearer: String
    ): List<UserScoreProjection>
}
