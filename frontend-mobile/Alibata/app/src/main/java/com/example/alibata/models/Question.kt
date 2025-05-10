package com.example.alibata.models

data class Question(
    val questionId: Int,
    val questionDescription: String?,   // matches JSON key "questionDescription"
    val questionText: String?,         // matches JSON key "questionText"
    val questionImage: String?,        // Base64 JSON key "questionImage"
    val choices: List<Choice>,
    val score: Score?                  // matches JSON key "score"
)