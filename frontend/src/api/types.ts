export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

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
