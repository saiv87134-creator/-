export interface Article {
  id: string;
  title: string;
  content: string;
  searchDescription: string;
  category: string;
  coverImage: string; // Base64 or URL
  isTemplate?: boolean;
  publishedAt: string;
  lang?: 'en' | 'ar';
}

export interface AdSenseConfig {
  enabled: boolean;
  publisherId: string;
  adSlotId: string;
  customCode: string;
  bannerPosition: 'top' | 'sidebar' | 'between_articles' | 'all';
  cookieBannerActive?: boolean; // Whether GDPR consent banner is active
}

export interface SEOAnalysis {
  wordCount: number;
  keywordDensity: Record<string, number>;
  titleScore: number;
  descScore: number;
  overallScore: number;
}
