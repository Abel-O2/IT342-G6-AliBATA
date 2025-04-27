package com.example.alibata

import android.os.Bundle
import android.util.Base64
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.alibata.models.Question
import com.example.alibata.models.Choice
import com.example.alibata.network.RetrofitInstance
import com.example.alibata.utils.TokenManager
import com.google.android.material.button.MaterialButton
import kotlinx.coroutines.launch
import org.json.JSONObject

class LessonView : AppCompatActivity() {

    companion object {
        const val EXTRA_LESSON_ID = "EXTRA_LESSON_ID"
        const val EXTRA_TITLE = "EXTRA_TITLE"
    }

    private lateinit var titleTextView: TextView
    private lateinit var progressTextView: TextView
    private lateinit var questionTextView: TextView
    private lateinit var choicesContainer: LinearLayout
    private lateinit var progressBar: ProgressBar

    private var lessonId: Int = -1
    private var questions: List<Question> = emptyList()
    private var currentQuestionIndex = 0
    private var score = 0

    private val api by lazy { RetrofitInstance.apiService }
    // Retrofit endpoints:
    // suspend fun getQuestionsForActivity(@Header("Authorization") token: String, @Path("activityId") lessonId: Int): List<Question>
    // suspend fun markActivityAsCompleted(@Header("Authorization") token: String, @Path("id") activityId: Int, @Path("userId") userId: Int): Response<Void>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lesson_view)
        // Find views by id
        titleTextView = findViewById(R.id.activityTitle)
        progressBar = findViewById(R.id.progressBar)
        progressTextView = findViewById(R.id.progressText)
        questionTextView = findViewById(R.id.questionText)
        choicesContainer = findViewById(R.id.choicesContainer)

        lessonId = intent.getIntExtra(EXTRA_LESSON_ID, -1)
        val title = intent.getStringExtra(EXTRA_TITLE)
        titleTextView.text = title

        fetchQuestions()
    }

    private fun fetchQuestions() {
        lifecycleScope.launch {
            val token = TokenManager.getToken(this@LessonView)
            if (token.isNullOrEmpty()) {
                //Toast.makeText(this@LessonView, "Token not found", //Toast.LENGTH_SHORT).show()
                return@launch
            }
            val bearer = "Bearer $token"
            try {
                questions = api.getQuestionsForActivity(bearer, lessonId)
                if (questions.isNotEmpty()) {
                    currentQuestionIndex = 0
                    score = 0
                    // Initialize progress bar max to number of questions
                    progressBar.max = questions.size
                    progressBar.progress = 0
                    displayQuestion(questions[currentQuestionIndex])
                } else {
                    //Toast.makeText(this@LessonView, "No questions found for this activity", //Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                e.printStackTrace()
                //Toast.makeText(this@LessonView, "Failed to load questions", //Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun displayQuestion(question: Question) {
        questionTextView.text = question.questionText
        choicesContainer.removeAllViews()
        progressTextView.text = "Question ${currentQuestionIndex + 1} of ${questions.size}"
        // Update the progress bar progress
        progressBar.progress = currentQuestionIndex

        question.choices.forEach { choice ->
            val choiceButton = MaterialButton(this).apply {
                text = choice.choiceText
                setOnClickListener { onChoiceSelected(question, choice) }
            }
            choicesContainer.addView(choiceButton)
        }
    }

    private fun onChoiceSelected(question: Question, selectedChoice: Choice) {
        if (selectedChoice.correct) {
            score++
            //Toast.makeText(this, "Correct!", //Toast.LENGTH_SHORT).show()
        } else {
            //Toast.makeText(this, "Incorrect!", //Toast.LENGTH_SHORT).show()
        }

        // Increment the question index
        currentQuestionIndex++
        // Update the progress bar immediately
        progressBar.progress = currentQuestionIndex

        // Load the next question or finish if all questions are answered
        if (currentQuestionIndex < questions.size) {
            displayQuestion(questions[currentQuestionIndex])
        } else {
            showFinalScore()
        }
    }


    private fun showFinalScore() {
        // If perfect score, mark the activity as completed on the server
        if (score == questions.size) {
            markActivityCompleted()
        }
        AlertDialog.Builder(this)
            .setTitle("Game Over")
            .setMessage("Your score is $score out of ${questions.size}")
            .setPositiveButton("OK") { dialog, _ ->
                dialog.dismiss()
                finish()
            }
            .show()
    }

    private fun markActivityCompleted() {
        lifecycleScope.launch {
            val token = TokenManager.getToken(this@LessonView)
            if (token.isNullOrEmpty()) {
                //Toast.makeText(this@LessonView, "Token not found", //Toast.LENGTH_SHORT).show()
                return@launch
            }
            val bearer = "Bearer $token"
            val payload = decodeJwt(token)
            val userId = if (payload?.userId != 0) {
                payload?.userId ?: -1
            } else {
                payload?.sub?.toIntOrNull() ?: -1
            }
            if (userId == -1) {
                //Toast.makeText(this@LessonView, "User not found", //Toast.LENGTH_SHORT).show()
                return@launch
            }
            try {
                val response = api.markActivityAsCompleted(bearer, lessonId, userId)
                if (response.isSuccessful) {
                    //Toast.makeText(this@LessonView, "Activity marked as completed", //Toast.LENGTH_SHORT).show()
                } else {
                    //Toast.makeText(this@LessonView, "Failed to mark activity complete", //Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                e.printStackTrace()
                //Toast.makeText(this@LessonView, "Error marking activity complete", //Toast.LENGTH_SHORT).show()
            }
        }
    }

    data class JwtPayload(
        val userId: Int,
        val sub: String,
        val iat: Long,
        val exp: Long
    )

    private fun decodeJwt(token: String): JwtPayload? {
        return try {
            val parts = token.split('.')
            if (parts.size != 3) null
            else {
                val payloadJson = String(
                    Base64.decode(parts[1], Base64.URL_SAFE or Base64.NO_PADDING or Base64.NO_WRAP),
                    charset("UTF-8")
                )
                val json = JSONObject(payloadJson)
                val userId = json.optInt("userId", 0)
                val sub = json.optString("sub", "")
                val iat = json.optLong("iat", 0L)
                val exp = json.optLong("exp", 0L)
                JwtPayload(userId, sub, iat, exp)
            }
        } catch (ex: Exception) {
            ex.printStackTrace()
            null
        }
    }
}
