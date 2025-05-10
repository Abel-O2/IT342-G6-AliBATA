package com.example.alibata.models

import com.google.gson.annotations.SerializedName

data class UserActivity(
    @SerializedName("completed")
    val completed: Boolean,
    @SerializedName("activity_ActivityId")
    val activityId: Int?,  // This is used to match with a full Activity
    @SerializedName("activity_ActivityName")
    val activityName: String?
)