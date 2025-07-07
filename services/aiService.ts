interface GenerateContentParams {
  prompt: string;
  platform: string;
  contentType: string;
}

export const generateContent = async (params: GenerateContentParams): Promise<string> => {
  try {
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are a professional social media content creator. Create engaging ${params.contentType} content for ${params.platform}. Make it authentic, engaging, and platform-appropriate. Include relevant hashtags when appropriate.`
          },
          {
            role: 'user',
            content: params.prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.completion || 'Failed to generate content';
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content. Please check your internet connection and try again.');
  }
};