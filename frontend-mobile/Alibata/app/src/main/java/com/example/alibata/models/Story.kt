package com.example.alibata.models

data class Story(
    val storyId: Int,
    val title: String,
    val storyText: String,
    val youtubeVideoId: String,
    val completed: Boolean
    // Skipping users for now unless you want them too
)