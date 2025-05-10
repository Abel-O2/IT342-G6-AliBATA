package com.example.alibata.models

data class Choice(
    val choiceId: Int,
    val choiceText: String,
    val choiceOrder: Int?,
    val correct: Boolean
)