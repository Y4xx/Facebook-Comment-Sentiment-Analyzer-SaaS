export interface Comment {
  id: number;
  comment_text: string;
  sentiment: "positive" | "neutral" | "negative";
  score: number;
}

export interface Analysis {
  id: number;
  post_url: string;
  overall_sentiment: "positive" | "neutral" | "negative" | null;
  overall_score: number | null;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  total_comments: number;
  created_at: string;
  comments?: Comment[];
}

export interface AnalysisCreate {
  facebook_post_url: string;
}

export interface ApiError {
  detail: string;
}
