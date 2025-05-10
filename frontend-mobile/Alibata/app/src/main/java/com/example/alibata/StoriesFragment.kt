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
import com.example.alibata.models.Story
import com.example.alibata.models.UserStory
import com.example.alibata.network.RetrofitInstance
import com.example.alibata.utils.TokenManager
import com.google.android.material.button.MaterialButton
import org.json.JSONObject
import kotlinx.coroutines.launch
import android.content.res.ColorStateList

class StoriesFragment : Fragment(R.layout.fragment_stories) {

    private lateinit var storiesContainer: LinearLayout
    private var stories: List<Story> = emptyList()
    private val api by lazy { RetrofitInstance.apiService }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val view = inflater.inflate(R.layout.fragment_stories, container, false)
        storiesContainer = view.findViewById(R.id.storiesContainer)

        fetchStories()

        return view
    }

    override fun onResume() {
        super.onResume()
        fetchStories()
    }

    private fun fetchStories() {
        viewLifecycleOwner.lifecycleScope.launch {
            try {
                // Retrieve token and decode it
                val rawToken = TokenManager.getToken(requireContext())
                if (rawToken.isNullOrEmpty()) {
                    Toast.makeText(requireContext(), "Token not found", Toast.LENGTH_SHORT).show()
                    return@launch
                }
                val payload = decodeJwt(rawToken)
                if (payload == null) {
                    Toast.makeText(requireContext(), "Invalid token", Toast.LENGTH_SHORT).show()
                    return@launch
                }
                //Log.d("StoriesFragment", "Decoded token payload: userId=${payload.userId}, sub=${payload.sub}")

                // Use payload.userId if nonzero; otherwise try to parse sub into an Int
                val userId = if (payload.userId != 0) {
                    payload.userId
                } else {
                    try {
                        payload.sub.toInt()
                    } catch (e: Exception) {
                        //Log.e("StoriesFragment", "Failed to parse user id from 'sub': ${payload.sub}")
                        return@launch
                    }
                }

                val bearer = "Bearer $rawToken"

                // 1. Fetch user-specific (partial) stories data
                val userStories: List<UserStory> = api.getStoriesForUser(bearer, userId)
                //Log.d("StoriesFragmentUSER", "UserStories size: ${userStories.size}")
                userStories.forEach {
                    //Log.d("StoriesFragmentUSER", "UserStory: id=${it.userStoryId}, completed=${it.completed}")
                }

                // 2. Fetch ALL stories (full data)
                val allStories: List<Story> = api.getAllStories(bearer)
                //Log.d("StoriesFragmentALL", "AllStories size: ${allStories.size}")
                allStories.forEach {
                    //Log.d("StoriesFragmentALL", "Story: id=${it.storyId}, title=${it.title}")
                }

                // 3. For each user story, find the matching full story and update the 'completed' status
                val matchedStories = userStories.mapNotNull { userStory ->
                    val fullStory = allStories.find { it.storyId == userStory.userStoryId }
                    if (fullStory == null) {
                        //Log.d("StoriesFragment", "No match found for userStory id=${userStory.userStoryId}")
                    }
                    fullStory?.copy(completed = userStory.completed)
                }

                //Log.d("StoriesFragment", "MatchedStories size: ${matchedStories.size}")

                stories = matchedStories
                addStoryButtons()
            } catch (e: Exception) {
                e.printStackTrace()
                //Log.e("StoriesFragment", "Error fetching stories: ${e.message}")
                //Toast.makeText(requireContext(), "Failed to fetch stories", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun addStoryButtons() {
        storiesContainer.removeAllViews() // Clear previous buttons if needed

        stories.forEach { story ->
            val button = MaterialButton(requireContext()).apply {
                text = story.title

                val colorRes = if (story.completed)
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
                    val cleanVideoId = story.youtubeVideoId.substringAfter('=') // assumes youtubeVideoId contains "="
                    val intent = Intent(requireContext(), StoryView::class.java).apply {
                        putExtra(StoryView.EXTRA_VIDEO_ID, cleanVideoId)
                        putExtra(StoryView.EXTRA_TITLE, story.title)
                        putExtra(StoryView.EXTRA_DESCRIPTION, story.storyText)
                        putExtra(StoryView.EXTRA_STORY_ID, story.storyId)
                    }
                    startActivity(intent)
                }
            }

            storiesContainer.addView(button)
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
