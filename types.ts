
export enum NoteCategory {
  WORK = 'အလုပ်',
  PERSONAL = 'ကိုယ်ရေးကိုယ်တာ',
  MINING = 'သတ္တုတူးဖော်ရေး',
  FINANCE = 'ဘဏ္ဍာရေး',
  IDEAS = 'စိတ်ကူးများ',
  DAILY_LOG = 'နေ့စဉ်မှတ်တမ်း',
  UNCATEGORIZED = 'အမျိုးအစားမခွဲခြားရသေး'
}

export interface VoiceNote {
  id: string;
  timestamp: number;
  originalText: string;
  enhancedText: string;
  category: NoteCategory;
  summary: string;
  isUrgent: boolean;
  keywords: string[];
}

export interface AnalyticsData {
  categoryDistribution: { name: string; value: number }[];
  timePattern: { date: string; count: number }[];
  topKeywords: string[];
  insights: string[];
}

export interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  date: string;
  totalNotes: number;
  summary: string;
  keyTopics: string[];
  actionRecommendations: string[];
}
