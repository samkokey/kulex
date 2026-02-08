import { YouTubeChatResponse, YouTubeVideoResponse, ChatMessage } from '../types';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const getLiveChatId = async (videoId: string, apiKey: string): Promise<string> => {
  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=liveStreamingDetails&id=${videoId}&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Video bilgileri alınamadı. API Key veya Video ID kontrol edin.');
    }

    const data: YouTubeVideoResponse = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Video bulunamadı.');
    }

    const liveChatId = data.items[0].liveStreamingDetails?.activeLiveChatId;
    
    if (!liveChatId) {
      throw new Error('Bu video canlı değil veya sohbet kapalı.');
    }

    return liveChatId;
  } catch (error) {
    console.error('Error fetching Live Chat ID:', error);
    throw error;
  }
};

export const fetchChatMessages = async (
  liveChatId: string, 
  apiKey: string, 
  pageToken?: string
): Promise<{ messages: ChatMessage[]; nextPageToken: string; pollingInterval: number }> => {
  try {
    let url = `${BASE_URL}/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${apiKey}`;
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      // Handle quota errors or invalid tokens gracefully by throwing specific messages if needed
      throw new Error('Mesajlar alınamadı.');
    }

    const data: YouTubeChatResponse = await response.json();
    
    const messages: ChatMessage[] = data.items.map((item) => {
      const isSuperChat = item.snippet.type === 'superChatEvent';
      const messageText = isSuperChat 
        ? (item.snippet.superChatDetails?.userComment || '') 
        : (item.snippet.textMessageDetails?.messageText || '');

      return {
        id: item.id,
        authorName: item.authorDetails.displayName,
        authorPhotoUrl: item.authorDetails.profileImageUrl,
        message: messageText,
        type: isSuperChat ? 'superchat' : 'text',
        amount: item.snippet.superChatDetails?.amountDisplayString,
        timestamp: item.snippet.publishedAt
      };
    });

    return {
      messages,
      nextPageToken: data.nextPageToken,
      pollingInterval: Math.max(data.pollingIntervalMillis || 3000, 1000) // Ensure at least 1s, usually Youtube gives 3s+
    };

  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};