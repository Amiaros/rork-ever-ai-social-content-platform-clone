export type ThemeType = 
  | 'neonGreen' 
  | 'neonBlue' 
  | 'neonPink' 
  | 'neonRed' 
  | 'neonGold' 
  | 'neonSilver';

export type FontType = 
  | 'system'
  | 'comic';

export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  username?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  connectedPlatforms: SocialPlatform[];
  phoneNumber?: string;
  countryCode?: string;
  dateOfBirth?: string;
}

export interface ContentType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: string;
  platform: string;
  createdAt: number;
  publishedAt?: number;
  status: 'draft' | 'published' | 'scheduled';
  analytics?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface AnalyticsData {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  platform: string;
  posts: number;
  engagement: number;
  followers: number;
  growth: number;
  history: Array<{ date: string; value: number }>;
}

export interface CountryCode {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

export interface GeneratedContent {
  id: string;
  type: ContentType;
  content: string;
  platform: string;
  createdAt: string;
  published: boolean;
}