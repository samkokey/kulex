export interface ChatMessage {
  id: string;
  authorName: string;
  authorPhotoUrl: string;
  message: string;
  type: 'text' | 'superchat';
  amount?: string; // For SuperChat
  timestamp: string;
}

export interface Block {
  id: string;
  builder: string;
  photo: string;
}

export interface GameState {
  currentHeight: number;
  highScore: number;
  lastBuilder: string | null;
  lastDestroyer: string | null;
  history: GameEvent[];
  blocks: Block[];
}

export interface GameEvent {
  id: string;
  type: 'build' | 'collapse';
  username: string;
  userPhoto: string;
  detail?: string; // e.g., height reached or superchat amount
  timestamp: Date;
}

export interface YouTubeConfig {
  apiKey: string;
  videoId: string;
}

// Minimal YouTube API Response Types
export interface YouTubeVideoResponse {
  items: Array<{
    liveStreamingDetails?: {
      activeLiveChatId?: string;
    };
  }>;
}

export interface YouTubeChatResponse {
  nextPageToken: string;
  pollingIntervalMillis: number;
  items: Array<{
    id: string;
    snippet: {
      type: string;
      publishedAt: string;
      authorChannelId: string;
      displayMessage: string;
      textMessageDetails?: {
        messageText: string;
      };
      superChatDetails?: {
        amountDisplayString: string;
        userComment: string;
      };
    };
    authorDetails: {
      displayName: string;
      profileImageUrl: string;
    };
  }>;
}