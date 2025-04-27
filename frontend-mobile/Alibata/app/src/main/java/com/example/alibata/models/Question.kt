package com.example.alibata.models

data class Question(
    val questionId: Int,
    val questionText: String,
    val choices: List<Choice>
)