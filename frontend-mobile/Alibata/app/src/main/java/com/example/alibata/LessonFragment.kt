// LessonFragment.kt
package com.example.alibata

import android.content.Intent
import android.os.Bundle
import android.util.Base64
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.example.alibata.models.Activity
import com.example.alibata.models.UserActivity
import com.example.alibata.network.RetrofitInstance
import com.example.alibata.utils.TokenManager
import com.google.android.material.button.MaterialButton
import kotlinx.coroutines.launch
import android.content.res.ColorStateList
import org.json.JSONObject

class LessonFragment : Fragment(R.layout.fragment_lesson) {

    private lateinit var activitiesContainer: LinearLayout
    private var activities: List<Activity> = emptyList()
    private val api by lazy { RetrofitInstance.apiService }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val view = inflater.inflate(R.layout.fragment_lesson, container, false)
        activitiesContainer = view.findViewById(R.id.activitiesContainer)
        fetchActivities()
        return view
    }

    override fun onResume() {
        super.onResume()
        // reload every time we come back to this fragment
        fetchActivities()
    }

    private fun fetchActivities() {
        viewLifecycleOwner.lifecycleScope.launch {
            val safeContext = context ?: return@launch
            try {
                val rawToken = TokenManager.getToken(safeContext) ?: return@launch
                val payload = decodeJwt(rawToken) ?: return@launch
                val userId = if (payload.userId != 0) payload.userId else payload.sub.toIntOrNull() ?: return@launch
                val bearer = "Bearer $rawToken"

                // Fetch assigned and all activities
                val userActivities: List<UserActivity> = api.getActivitiesForUser(bearer, userId)
                val allActivities: List<Activity> = api.getAllActivities(bearer)

                // Merge and preserve completed flag
                activities = allActivities.map { activity ->
                    val match = userActivities.find { it.activityId == activity.activityId }
                    if (match != null) activity.copy(completed = match.completed)
                    else activity
                }

                if (isAdded) addActivityButtons()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun addActivityButtons() {
        activitiesContainer.removeAllViews()
        activities.forEach { activity ->
            val button = MaterialButton(requireContext()).apply {
                text = activity.activityName
                backgroundTintList = ColorStateList.valueOf(
                    ContextCompat.getColor(
                        context,
                        if (activity.completed) R.color.pastel_green else R.color.text_primary_dark
                    )
                )
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    val margin = resources.getDimensionPixelOffset(R.dimen.button_margin)
                    setMargins(margin, margin, margin, margin)
                }
                setOnClickListener {
                    val intent = Intent(requireContext(), LessonView::class.java).apply {
                        putExtra(LessonView.EXTRA_LESSON_ID, activity.activityId)
                        putExtra(LessonView.EXTRA_TITLE, activity.activityName)
                        putExtra(LessonView.EXTRA_GAME_TYPE, activity.gameType)
                    }
                    startActivity(intent)
                }
            }
            activitiesContainer.addView(button)
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
            if (parts.size != 3) return null
            val payloadJson = String(
                Base64.decode(parts[1], Base64.URL_SAFE or Base64.NO_PADDING or Base64.NO_WRAP),
                charset("UTF-8")
            )
            val json = JSONObject(payloadJson)
            JwtPayload(
                userId = json.optInt("userId", 0),
                sub    = json.optString("sub", ""),
                iat    = json.optLong("iat", 0L),
                exp    = json.optLong("exp", 0L)
            )
        } catch (ex: Exception) {
            ex.printStackTrace()
            null
        }
    }
}