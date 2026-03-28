import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { API_KEYS } from "@/constants/apiKeys";

const contentTypeEnum = z.enum(['text', 'image', 'video', 'audio']);

export default publicProcedure
  .input(z.object({ 
    prompt: z.string(),
    platform: z.string(),
    contentType: contentTypeEnum
  }))
  .mutation(async ({ input, ctx }) => {
    try {
      const { prompt, platform, contentType } = input;
      
      // Use the API key from constants
      const apiKey = API_KEYS.mainApiKey;
      console.log(`Backend using API key: ${apiKey.substring(0, 10)}...`);
      
      console.log(`Generating ${contentType} content for ${platform}`);
      console.log(`Prompt: ${prompt.substring(0, 100)}...`);
      
      // For text content, use the 1min.ai API
      if (contentType === 'text') {
        const response = await fetch('https://api.1min.ai/api/features', {
          method: 'POST',
          headers: {
            'API-KEY': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: "TEXT_GENERATION",
            model: "gpt-3.5-turbo",
            promptObject: {
              messages: [
                {
                  role: "system",
                  content: `You are a social media content creator for ${platform}. Create engaging content based on the user's prompt. Make it appropriate for the platform's style and format.`
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
              temperature: 0.7,
              max_tokens: 500
            }
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('API error:', errorData);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('AI response:', data);
        
        // Extract the generated content from the API response
        let generatedContent = '';
        
        if (data && data.result && data.result.choices && data.result.choices.length > 0) {
          generatedContent = data.result.choices[0].message.content;
        } else if (data && data.result && typeof data.result === 'string') {
          generatedContent = data.result;
        } else {
          // Fallback to a default response if the API response format is unexpected
          generatedContent = getPlatformSpecificContent(platform, prompt);
        }
        
        return generatedContent;
      }
      
      // For image content, use the 1min.ai API for image generation
      if (contentType === 'image') {
        try {
          const response = await fetch('https://api.1min.ai/api/features', {
            method: 'POST',
            headers: {
              'API-KEY': apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: "IMAGE_GENERATION",
              model: "dall-e-3",
              promptObject: {
                prompt: `Create a social media image for ${platform} about: ${prompt}`,
                n: 1,
                size: "1024x1024",
                quality: "standard"
              }
            }),
          });
  
          if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
          }
  
          const data = await response.json();
          
          if (data && data.result && data.result.data && data.result.data.length > 0) {
            return data.result.data[0].url;
          }
          
          throw new Error('No image URL in response');
        } catch (error) {
          console.error('Error generating image:', error);
          
          // Fallback to Unsplash if the API call fails
          let query = platform.toLowerCase();
          
          // Add specific terms based on platform to get better images
          switch (platform.toLowerCase()) {
            case 'instagram':
              query = 'instagram social media photography';
              break;
            case 'facebook':
              query = 'facebook social media marketing';
              break;
            case 'twitter/x':
            case 'twitter':
              query = 'twitter social media post';
              break;
            case 'linkedin':
              query = 'linkedin professional business';
              break;
            case 'tiktok':
              query = 'tiktok video content creation';
              break;
            case 'youtube':
              query = 'youtube video content creator';
              break;
            default:
              query = `${platform.toLowerCase()} social media`;
          }
          
          // Add a random parameter to prevent caching
          const randomParam = Math.floor(Math.random() * 1000);
          return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(query)}&random=${randomParam}`;
        }
      }
      
      // For video content, return a related sample based on platform
      if (contentType === 'video') {
        // In a real app, you would generate or select a relevant video
        // For now, we return a sample video URL
        const videoOptions = [
          "https://assets.mixkit.co/videos/preview/mixkit-woman-typing-on-a-laptop-in-a-cafe-2558-large.mp4",
          "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-smartphone-4353-large.mp4",
          "https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogging-about-her-new-laptop-42634-large.mp4"
        ];
        
        // Randomly select a video from options
        const randomIndex = Math.floor(Math.random() * videoOptions.length);
        return videoOptions[randomIndex];
      }
      
      // For audio content, return a related sample based on platform
      if (contentType === 'audio') {
        // In a real app, you would generate or select a relevant audio
        // For now, we return a sample audio URL
        const audioOptions = [
          "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
          "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3",
          "https://assets.mixkit.co/music/preview/mixkit-raising-me-higher-34.mp3"
        ];
        
        // Randomly select an audio from options
        const randomIndex = Math.floor(Math.random() * audioOptions.length);
        return audioOptions[randomIndex];
      }
      
      throw new Error(`Unsupported content type: ${contentType}`);
    } catch (error) {
      console.error('Error generating content:', error);
      
      // Return a fallback response for any error
      return `Error generating content. Please try again. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  });

// Helper function to generate platform-specific content
function getPlatformSpecificContent(platform: string, prompt: string): string {
  const hashtags = getRelevantHashtags(platform, prompt);
  const emojis = getRelevantEmojis();
  
  switch (platform.toLowerCase()) {
    case 'instagram':
      return `✨ ${emojis[0]} New Post ${emojis[0]} ✨

${formatPrompt(prompt)}

${emojis[1]} Double tap if you agree!
${emojis[2]} Tag friends who need to see this

${hashtags.join(' ')}`;
    
    case 'facebook':
      return `${emojis[0]} Just published: ${formatPrompt(prompt)}

${emojis[1]} What do you think? Let me know in the comments!

${hashtags.slice(0, 3).join(' ')}`;
    
    case 'twitter':
    case 'twitter/x':
      return `${emojis[0]} ${formatPrompt(prompt)}

${hashtags.slice(0, 2).join(' ')} ${emojis[1]}`;
    
    case 'linkedin':
      return `I'm excited to share my thoughts on ${formatPrompt(prompt)}

${emojis[0]} Key takeaways:
- Professional insight 1
- Strategic approach 2
- Future outlook

What's your experience? I'd love to hear your perspective in the comments.

#ProfessionalDevelopment ${hashtags[0]}`;
    
    case 'tiktok':
      return `${emojis[0]} When you discover ${formatPrompt(prompt)} ${emojis[1]}

Follow for more content like this! ${emojis[2]}

${hashtags.join(' ')}`;
    
    default:
      return `${emojis[0]} Check out this amazing content about ${prompt}!

${emojis[1]} Let me know your thoughts in the comments.

${hashtags.join(' ')}`;
  }
}

function formatPrompt(prompt: string): string {
  return prompt.charAt(0).toUpperCase() + prompt.slice(1);
}

function getRelevantHashtags(platform: string, prompt: string): string[] {
  // Extract potential keywords from prompt
  const words = prompt.toLowerCase().split(/\s+/);
  const keywords = words.filter(word => word.length > 3).slice(0, 3);
  
  // Platform-specific hashtags
  const platformTags: Record<string, string[]> = {
    instagram: ['#Instagram', '#Content', '#Marketing'],
    facebook: ['#Facebook', '#Sharing', '#Community'],
    twitter: ['#Twitter', '#Trending', '#News'],
    linkedin: ['#LinkedIn', '#Professional', '#Business'],
    tiktok: ['#TikTok', '#Trending', '#Viral'],
    youtube: ['#YouTube', '#Video', '#Content'],
  };
  
  // Get platform hashtags or use generic ones
  const platformKey = platform.toLowerCase().replace(/[^a-z]/g, '');
  const baseTags = platformTags[platformKey] || ['#Content', '#SocialMedia'];
  
  // Create hashtags from keywords
  const keywordTags = keywords.map(word => `#${word}`);
  
  // Combine and return unique hashtags
  return [...new Set([...baseTags, ...keywordTags])];
}

function getRelevantEmojis(): string[] {
  const emojiSets = [
    '✨', '🔥', '👀', '💯', '🚀', '💪', '🎯', '💡', '🌟', '👍', 
    '❤️', '😊', '🎉', '👋', '💬', '📊', '💼', '📈', '🔗', '👔',
    '🎵', '💃', '🕺', '✌️', '😂', '📹', '🎬', '🎥', '🔔'
  ];
  
  // Randomly select 3 emojis from the set
  const selectedEmojis = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * emojiSets.length);
    selectedEmojis.push(emojiSets[randomIndex]);
  }
  
  return selectedEmojis;
}