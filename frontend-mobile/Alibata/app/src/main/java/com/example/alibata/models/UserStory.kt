package com.example.alibata.models

import com.google.gson.annotations.SerializedName

data class UserStory(
    @SerializedName("story_StoryId")
    val userStoryId: Int,

    @SerializedName("story_Title")
    val userTitle: String,

    @SerializedName("completed")
    val completed: Boolean
)
