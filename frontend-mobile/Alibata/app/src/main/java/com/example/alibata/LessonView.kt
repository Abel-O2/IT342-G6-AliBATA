package com.example.alibata

import android.os.Bundle
import android.util.Base64
import android.view.View
import android.widget.GridLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
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
        const val EXTRA_GAME_TYPE = "EXTRA_GAME_TYPE"
    }

    enum class GameMode { GAME1, GAME2, GAME3 }

    private lateinit var titleTextView: TextView
    private lateinit var scoreTextView: TextView
    private lateinit var progressTextView: TextView
    private lateinit var questionTextView: TextView
    private lateinit var questionImageView: ImageView
    private lateinit var choicesContainer: GridLayout
    private lateinit var progressBar: ProgressBar
    private lateinit var submitButton: MaterialButton

    private var lessonId = -1
    private var questions: List<Question> = emptyList()
    private var currentQuestionIndex = 0
    private var score = 0
    private lateinit var gameMode: GameMode

    private val api by lazy { RetrofitInstance.apiService }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lesson_view)

        intent.getStringExtra(EXTRA_GAME_TYPE)?.let {
            gameMode = GameMode.valueOf(it)
        } ?: throw IllegalArgumentException("EXTRA_GAME_TYPE is required")

        titleTextView = findViewById(R.id.activityTitle)
        scoreTextView = findViewById(R.id.scoreTextView)
        progressBar = findViewById(R.id.progressBar)
        progressTextView = findViewById(R.id.progressText)
        questionTextView = findViewById(R.id.questionText)
        questionImageView = findViewById(R.id.questionImageView)
        choicesContainer = findViewById(R.id.choicesContainer)
        submitButton = findViewById(R.id.phraseSubmitButton)
        submitButton.visibility = View.GONE

        lessonId = intent.getIntExtra(EXTRA_LESSON_ID, -1)
        titleTextView.text = intent.getStringExtra(EXTRA_TITLE)
        scoreTextView.text = getString(R.string.score_format, 0)

        submitButton.setOnClickListener {
            (it.tag as? Pair<Question, List<Int>>)?.let { pair ->
                handlePhraseSubmit(pair.first, pair.second)
            }
        }

        fetchQuestions()
    }

    private fun dpToPx(dp: Int): Int =
        (dp * resources.displayMetrics.density).toInt()

    private fun fetchQuestions() = lifecycleScope.launch {
        TokenManager.getToken(this@LessonView)?.let { token ->
            try {
                questions = api.getQuestionsForActivity("Bearer $token", lessonId)
                if (questions.isEmpty()) return@launch
                progressBar.max = questions.size
                currentQuestionIndex = 0
                score = 0
                showQuestion(questions[0])
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun showQuestion(q: Question) {
        submitButton.visibility = View.GONE
        questionTextView.visibility = View.VISIBLE
        progressTextView.text = getString(
            R.string.question_progress,
            currentQuestionIndex + 1,
            questions.size
        )
        progressBar.progress = currentQuestionIndex

        choicesContainer.apply {
            columnCount = 2
            removeAllViews()
        }

        when (gameMode) {
            GameMode.GAME1 -> displayOnePicFourWords(q)
            GameMode.GAME2 -> displayPhraseTranslation(q)
            GameMode.GAME3 -> displayWordTranslation(q)
        }
    }

    private fun displayOnePicFourWords(q: Question) {
        questionTextView.visibility = View.GONE

        q.questionImage?.let { base64 ->
            val decoded = Base64.decode(base64, Base64.DEFAULT)
            val bmp = android.graphics.BitmapFactory.decodeByteArray(decoded, 0, decoded.size)
            questionImageView.setImageBitmap(bmp)
            questionImageView.visibility = View.VISIBLE
        } ?: run {
            questionImageView.visibility = View.GONE
        }

        q.choices.shuffled().forEach { choice ->
            val btn = MaterialButton(this).apply {
                text = choice.choiceText
                layoutParams = GridLayout.LayoutParams(
                    GridLayout.spec(GridLayout.UNDEFINED, 1f),
                    GridLayout.spec(GridLayout.UNDEFINED, 1f)
                ).apply {
                    width = 0
                    setMargins(dpToPx(8), dpToPx(8), dpToPx(8), dpToPx(8))
                }
                setOnClickListener { handlePicChoice(q, choice) }
            }
            choicesContainer.addView(btn)
        }
    }

    private fun displayWordTranslation(q: Question) {
        questionTextView.visibility = View.VISIBLE
        questionTextView.text = q.questionText
        questionImageView.visibility = View.GONE

        q.choices.shuffled().forEach { choice ->
            val btn = MaterialButton(this).apply {
                text = choice.choiceText
                layoutParams = GridLayout.LayoutParams(
                    GridLayout.spec(GridLayout.UNDEFINED, 1f),
                    GridLayout.spec(GridLayout.UNDEFINED, 1f)
                ).apply {
                    width = 0
                    setMargins(dpToPx(8), dpToPx(8), dpToPx(8), dpToPx(8))
                }
                setOnClickListener { handleWordChoice(q, choice) }
            }
            choicesContainer.addView(btn)
        }
    }

    private fun displayPhraseTranslation(q: Question) {
        questionTextView.visibility = View.VISIBLE
        questionTextView.text = q.questionDescription
        questionImageView.visibility = View.GONE

        val seq = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
        }
        seq.layoutParams = GridLayout.LayoutParams(
            GridLayout.spec(GridLayout.UNDEFINED, 1),
            GridLayout.spec(0, 2)
        ).apply {
            width = GridLayout.LayoutParams.MATCH_PARENT
            setMargins(0, 0, 0, dpToPx(8))
        }
        choicesContainer.addView(seq)

        val selected = mutableListOf<Int>()

        q.choices.shuffled().forEach { choice ->
            val btn = MaterialButton(this).apply {
                text = choice.choiceText
                isAllCaps = false
                tag = choice.choiceId
                layoutParams = GridLayout.LayoutParams(
                    GridLayout.spec(GridLayout.UNDEFINED, 1f),
                    GridLayout.spec(GridLayout.UNDEFINED, 1f)
                ).apply {
                    width = 0
                    setMargins(dpToPx(8), dpToPx(8), dpToPx(8), dpToPx(8))
                }
                setOnClickListener {
                    isEnabled = false
                    selected += choice.choiceId

                    val tv = TextView(this@LessonView).apply {
                        text = choice.choiceText
                        tag = choice.choiceId
                        setPadding(dpToPx(8), dpToPx(4), dpToPx(8), dpToPx(4))
                        setOnClickListener { view ->
                            val id = view.tag as Int
                            seq.removeView(view)
                            selected.remove(id)
                            for (i in 0 until choicesContainer.childCount) {
                                val child = choicesContainer.getChildAt(i)
                                if (child is MaterialButton && child.tag == id) {
                                    child.isEnabled = true
                                    break
                                }
                            }
                            if (selected.isEmpty()) {
                                submitButton.visibility = View.GONE
                            } else {
                                submitButton.tag = Pair(q, selected.toList())
                            }
                        }
                    }
                    seq.addView(tv)

                    submitButton.tag = Pair(q, selected.toList())
                    submitButton.visibility = View.VISIBLE
                }
            }
            choicesContainer.addView(btn)
        }
    }

    private fun handlePicChoice(q: Question, choice: Choice) {
        for (i in 0 until choicesContainer.childCount) {
            (choicesContainer.getChildAt(i) as? MaterialButton)?.isEnabled = false
        }
        if (choice.correct) {
            score += q.score?.score ?: 0
            scoreTextView.text = getString(R.string.score_format, score)
        }
        lifecycleScope.launch {
            TokenManager.getToken(this@LessonView)?.let { token ->
                val userId = decodeJwt(token)?.userId ?: return@let
                try {
                    api.awardScoreToUser("Bearer $token", q.questionId, userId, choice.choiceId)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
                advance()
            }
        }
    }

    private fun handleWordChoice(q: Question, choice: Choice) {
        if (choice.correct) {
            score += q.score?.score ?: 0
            scoreTextView.text = getString(R.string.score_format, score)
        }
        lifecycleScope.launch {
            TokenManager.getToken(this@LessonView)?.let { token ->
                val userId = decodeJwt(token)?.userId ?: return@let
                try {
                    api.awardScoreToUser("Bearer $token", q.questionId, userId, choice.choiceId)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
                advance()
            }
        }
    }

    private fun handlePhraseSubmit(q: Question, selectedIds: List<Int>) {
        val correctSeq = q.choices.filter { it.correct }
            .sortedBy { it.choiceOrder ?: Int.MAX_VALUE }
            .map { it.choiceId }
        if (selectedIds == correctSeq) {
            score++
            scoreTextView.text = getString(R.string.score_format, score)
        }
        lifecycleScope.launch {
            TokenManager.getToken(this@LessonView)?.let { token ->
                val userId = decodeJwt(token)?.userId ?: return@let
                try {
                    api.awardScoreForTranslationGame("Bearer $token", q.questionId, userId, selectedIds)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
                advance()
            }
        }
    }

    private fun advance() {
        currentQuestionIndex++
        progressBar.progress = currentQuestionIndex
        if (currentQuestionIndex < questions.size) {
            showQuestion(questions[currentQuestionIndex])
        } else {
            showFinalScore()
        }
    }

    private fun showFinalScore() {
        if (score == questions.size) markActivityCompleted()
        AlertDialog.Builder(this)
            .setTitle("Game Over")
            .setMessage(getString(R.string.final_score_format, score, questions.size))
            .setPositiveButton("OK") { dlg, _ -> dlg.dismiss(); finish() }
            .show()
    }

    private fun markActivityCompleted() = lifecycleScope.launch {
        TokenManager.getToken(this@LessonView)?.let { token ->
            val userId = decodeJwt(token)?.userId ?: return@let
            try {
                api.markActivityAsCompleted("Bearer $token", lessonId, userId)
            } catch (_: Exception) {}
        }
    }

    private fun decodeJwt(token: String): JwtPayload? {
        return try {
            val parts = token.split('.')
            if (parts.size != 3) return null
            val json = JSONObject(
                String(Base64.decode(parts[1], Base64.URL_SAFE or Base64.NO_PADDING or Base64.NO_WRAP))
            )
            JwtPayload(
                userId = json.optInt("userId"),
                sub = json.optString("sub"),
                iat = json.optLong("iat"),
                exp = json.optLong("exp")
            )
        } catch (_: Exception) {
            null
        }
    }

    data class JwtPayload(
        val userId: Int,
        val sub: String,
        val iat: Long,
        val exp: Long
    )
}
