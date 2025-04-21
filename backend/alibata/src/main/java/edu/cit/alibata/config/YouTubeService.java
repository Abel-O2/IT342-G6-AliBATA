package edu.cit.alibata.config;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoListResponse;

import edu.cit.alibata.dto.YouTubeVideoDto;
import jakarta.annotation.PostConstruct;

@Service
public class YouTubeService {
    private static final String APPLICATION_NAME = "alibata";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    @Value("${youtube.api.key}")
    private String apiKey;

    private YouTube youtube;

    @PostConstruct
    public void init() throws GeneralSecurityException, IOException {
        NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        HttpRequestInitializer httpRequestInitializer = request -> {

        };

        this.youtube = new YouTube.Builder(httpTransport, JSON_FACTORY, httpRequestInitializer)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }
    
    public YouTubeVideoDto getVideo(String videoId) throws GeneralSecurityException, IOException  {
        if (videoId == null || videoId.isEmpty()) {
            throw new IllegalArgumentException("Video ID cannot be null or empty");
        }

        try {
            String parts = "snippet";
            YouTube.Videos.List request = youtube.videos().list(parts);
            request.setId(videoId);
            request.setKey(apiKey);

            VideoListResponse response = request.execute();
            List<Video> videoList = response.getItems();

            if (videoList != null && !videoList.isEmpty()) {
                Video video = videoList.get(0);
                String description = video.getSnippet().getDescription();
                String thumbnailUrl = video.getSnippet().getThumbnails().getHigh().getUrl(); // You can also use getDefault() or getMedium()
    
                return new YouTubeVideoDto(description, thumbnailUrl);
            } else {
                throw new IOException("No video found for the given ID: " + videoId);
            }
        } catch (GoogleJsonResponseException e) {
            throw new IOException("Error fetching video details: " + e.getMessage(), e);
        } 
    }
}
