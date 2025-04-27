package com.example.alibata

import android.content.Intent
import android.os.Bundle
import android.util.Base64
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.Toast
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

    private fun fetchActivities() {
        viewLifecycleOwner.lifecycleScope.launch {
            // Get a safe reference to the context or exit the coroutine if null
            val safeContext = context ?: run {
                ////Log.e("LessonFragment", "Fragment not attached to context.")
                return@launch
            }

            try {
                // Retrieve token and decode it using the safe context
                val rawToken = TokenManager.getToken(safeContext)
                if (rawToken.isNullOrEmpty()) {
                    //Toast.makeText(safeContext, "Token not found", //Toast.LENGTH_SHORT).show()
                    return@launch
                }

                val payload = decodeJwt(rawToken)
                if (payload == null) {
                    //Toast.makeText(safeContext, "Invalid token", //Toast.LENGTH_SHORT).show()
                    return@launch
                }
                ////Log.d("LessonFragment", "Decoded token payload: userId=${payload.userId}, sub=${payload.sub}")

                // Use payload.userId if nonzero; otherwise try to parse sub into an Int
                val userId = if (payload.userId != 0) {
                    payload.userId
                } else {
                    try {
                        payload.sub.toInt()
                    } catch (e: Exception) {
                        //Log.e("LessonFragment", "Failed to parse user id from 'sub': ${payload.sub}")
                        return@launch
                    }
                }

                val bearer = "Bearer $rawToken"

                // 1. Fetch user-specific activities data
                val userActivities: List<UserActivity> = api.getActivitiesForUser(bearer, userId)
                //Log.d("LessonFragmentUSER", "UserActivities size: ${userActivities.size}")
                userActivities.forEach {
                    //Log.d("LessonFragmentUSER", "UserActivity: id=${it.activityId}, completed=${it.completed}")
                }

                // Fetch all activities (full data)
                val allActivities: List<Activity> = api.getAllActivities(bearer)
                //Log.d("LessonFragmentALL", "AllActivities size: ${allActivities.size}")
                allActivities.forEach {
                    //Log.d("LessonFragmentALL", "Activity: id=${it.activityId}, title=${it.activityName}")
                }

                // Match userActivities with allActivities
                val matchedActivities = userActivities.mapNotNull { userActivity ->
                    val activityId = userActivity.activityId
                    if (activityId == null) {
                        //Log.d("LessonFragment", "Skipping userActivity with null activityId")
                        return@mapNotNull null
                    }

                    val fullActivity = allActivities.find { it.activityId == activityId }
                    if (fullActivity == null) {
                        //Log.d("LessonFragment", "No match found for userActivity id=$activityId")
                    }
                    fullActivity?.copy(completed = userActivity.completed)
                }




                //Log.d("LessonFragment", "MatchedActivities size: ${matchedActivities.size}")
                activities = matchedActivities

                // Before updating UI, check that the fragment is still added
                if (isAdded) {
                    addActivityButtons()
                } else {
                    //Log.e("LessonFragment", "Fragment not added when trying to update UI.")
                }
            } catch (e: Exception) {
                e.printStackTrace()
                //Log.e("LessonFragment", "Error fetching activities: ${e.message}")
                //Toast.makeText(safeContext, "Failed to fetch activities", //Toast.LENGTH_SHORT).show()
            }
        }
    }



    private fun addActivityButtons() {
        activitiesContainer.removeAllViews() // Clear previous buttons if needed

        activities.forEach { activity ->
            val button = MaterialButton(requireContext()).apply {
                text = activity.activityName

                val colorRes = if (activity.completed)
                    R.color.pastel_green
                else
                    R.color.text_primary_dark

                backgroundTintList = ColorStateList.valueOf(
                    ContextCompat.getColor(context, colorRes)
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
                        putExtra(LessonView.EXTRA_TITLE, activity.activityName) // Use activityName for title
                    }
                    startActivity(intent)
                }

            }

            activitiesContainer.addView(button)
        }
    }

    // Updated JWT payload data class
    data class JwtPayload(
        val userId: Int,
        val sub: String,
        val iat: Long,
        val exp: Long
    )

    // Improved decodeJwt function to try using 'sub' if userId is missing or zero.
    private fun decodeJwt(token: String): JwtPayload? {
        try {
            val parts = token.split('.')
            if (parts.size != 3) return null
            val payloadJson = String(
                Base64.decode(parts[1], Base64.URL_SAFE or Base64.NO_PADDING or Base64.NO_WRAP),
                charset("UTF-8")
            )
            val json = JSONObject(payloadJson)
            // Get the userId if exists (defaulting to 0)
            val userId = json.optInt("userId", 0)
            // Get the subject field. It might contain the user ID.
            val sub = json.optString("sub", "")
            val iat = json.optLong("iat", 0L)
            val exp = json.optLong("exp", 0L)
            return JwtPayload(userId, sub, iat, exp)
        } catch (ex: Exception) {
            ex.printStackTrace()
            return null
        }
    }
}
