package edu.cit.alibata.dto;

import edu.cit.alibata.Entity.StoryEntity;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StoryDetailsDto {

    private StoryEntity storyEntity;
    private YouTubeVideoDto youtubeVideoDetails;
    
}
