package com.example.alibata.models

data class Activity(
    val activityId: Int,
    val activityName: String,
    val gameType: String,
    val questions: List<Question>,
    var completed: Boolean
)
