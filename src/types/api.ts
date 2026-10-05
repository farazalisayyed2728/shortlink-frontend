export interface ShortURL {
  id?: number;
  short_code: string;
  original_url: string;
  short_url: string;
  total_clicks: number;
  created_at: string;
  is_active?: boolean;
}

export interface OverviewMetrics {
  total_urls: number;
  total_clicks: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  total_pages: number;
  current_page: number;
}

export interface DailyClickStat {
  date: string;
  clicks: number;
}

export interface ReferrerStat {
  referrer: string;
  clicks: number;
}

export interface URLAnalytics {
  original_url: string;
  total_clicks: number;
  today_clicks: number;
  clicks_by_day: DailyClickStat[];
  devices: Record<string, number>;
  top_referrers: ReferrerStat[];
}

export interface APIErrorEnvelope {
  error?: {
    message?: string;
    details?: string;
  };
  message?: string;
}
