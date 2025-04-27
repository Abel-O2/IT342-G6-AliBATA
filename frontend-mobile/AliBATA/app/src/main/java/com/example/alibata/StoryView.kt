package com.example.alibata

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Base64
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebSettings
import android.webkit.WebView
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.alibata.network.RetrofitInstance
import com.example.alibata.utils.TokenManager
import com.google.android.material.textfield.TextInputLayout
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONObject

class StoryView : AppCompatActivity() {

    private val api by lazy { RetrofitInstance.apiService }

    companion object {
        const val EXTRA_VIDEO_ID = "com.example.alibata.YOUTUBE_VIDEO_ID"
        const val EXTRA_TITLE = "com.example.alibata.STORY_TITLE"
        const val EXTRA_DESCRIPTION = "com.example.alibata.STORY_DESCRIPTION"
        const val EXTRA_STORY_ID = "com.example.alibata.STORY_ID"
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_story_view)

        // Handle window insets if you need edge-to-edge layout
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val sys = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(sys.left, sys.top, sys.right, sys.bottom)
            insets
        }

        val storyViewReturn = findViewById<TextView>(R.id.story_return)
        storyViewReturn.setOnClickListener{
            finish()
        }


        val videoId = intent.getStringExtra(EXTRA_VIDEO_ID)
        val title = intent.getStringExtra(EXTRA_TITLE) ?: "No Title"
        val description = intent.getStringExtra(EXTRA_DESCRIPTION) ?: "No Description"

        val titleTextView = findViewById<TextView>(R.id.story_title)
        val descriptionTextView = findViewById<TextView>(R.id.story_description)

        titleTextView.text = title
        descriptionTextView.text = description
        if (videoId.isNullOrEmpty()) {
            //Log.w("StoryView", "No YouTube Video ID received.")
            return
        }

        //Log.d("StoryView", "Received YouTube Video ID: $videoId")


        val webView = findViewById<WebView>(R.id.youtube_web_view)
        val statusBar = findViewById<TextView>(R.id.story_status)
        webView.settings.javaScriptEnabled = true

        // expose JS bridge
        webView.addJavascriptInterface(object {
            @JavascriptInterface
            fun onVideoEnded() {
                runOnUiThread {
                    statusBar.text = "✅ You finished watching!"
                    markStoryCompleted()
                }
            }
            @JavascriptInterface
            fun onMajorityWatched() {
                runOnUiThread {
                    // only show if you want it:
                    statusBar.text = "👍 You watched 75% of this video"
                }
            }
        }, "AndroidBridge")

        webView.settings.javaScriptEnabled = true
        webView.loadData(getYoutubeIframe(videoId), "text/html", "utf-8")
    }

    private fun markStoryCompleted() {
        val rawToken = TokenManager.getToken(this)

        if (rawToken.isNullOrEmpty()) {
            //Log.e("StoryView", "No JWT token found!")
            return
        }

        val jwtPayload: StoryView.JwtPayload? = decodeJwt(rawToken) // Explicitly type jwtPayload

        if (jwtPayload == null || jwtPayload.userId == 0) {
            //Log.e("StoryView", "Invalid JWT payload or missing userId!")
            return
        }

        val storyId = intent.getIntExtra(EXTRA_STORY_ID, -1)
        if (storyId == -1) {
            //Log.e("StoryView", "No story ID found!")
            return
        }

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = api.markStoryAsComplete(
                    bearerToken = "Bearer $rawToken",
                    storyId = storyId,
                    userId = jwtPayload.userId // Now this should resolve correctly
                )
                if (response.isSuccessful) {
                    //Log.d("StoryView", "Story marked as completed successfully!")
                } else {
                    //Log.e("StoryView", "Failed to mark story as completed: ${response.code()}")
                    //Log.e("StoryView", "STORY ID and USERID: $storyId and ${jwtPayload.userId}")
                }
            } catch (e: Exception) {
                //Log.e("StoryView", "Error marking story completed: ${e.localizedMessage}")
            }
        }
    }


    @SuppressLint("SetJavaScriptEnabled")
    private fun getYoutubeIframe(videoId: String): String = """
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <style>
              body { margin:0; }
              .container {
                position:relative;
                width:100%;
                height:0;
                padding-bottom:56.25%;
              }
              .video {
                position:absolute;
                top:0; left:0;
                width:100%;
                height:100%;
              }
            </style>
            <script src="https://www.youtube.com/iframe_api"></script>
            <script>
              var player, checkTimer;
              function onYouTubeIframeAPIReady() {
                player = new YT.Player('player', {
                  height: '100%', width: '100%',
                  videoId: '$videoId',
                  events: {
                    'onStateChange': onPlayerStateChange
                  }
                });
              }
              function onPlayerStateChange(event) {
                if (event.data === YT.PlayerState.ENDED) {
                  AndroidBridge.onVideoEnded();
                  clearInterval(checkTimer);
                }
                if (event.data === YT.PlayerState.PLAYING) {
                  // poll once per second
                  checkTimer = setInterval(function() {
                    var t = player.getCurrentTime();
                    var d = player.getDuration();
                    if (d > 0 && t/d >= 0.75) {
                      AndroidBridge.onMajorityWatched();
                      clearInterval(checkTimer);
                    }
                  }, 1000);
                }
                if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.BUFFERING) {
                  clearInterval(checkTimer);
                }
              }
            </script>
          </head>
          <body>
            <div class="container">
              <div id="player" class="video"></div>
            </div>
          </body>
        </html>
    """.trimIndent()

    data class JwtPayload(
        val userId: Int,
        val sub: String,
        val iat: Long,
        val exp: Long
    )

    // Improved decodeJwt function to try using 'sub' if userId is missing or zero.
    private fun decodeJwt(token: String): StoryView.JwtPayload? {
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
