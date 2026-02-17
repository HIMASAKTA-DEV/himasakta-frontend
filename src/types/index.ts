export interface Meta {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
  sort: string;
  sort_by: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Meta;
}

export interface Media {
  id: string;
  image_url: string;
  caption: string;
  category: string;
  department_id: string | null;
  progenda_id: string | null;
  created_at: string;
  updated_at: string;
  DeletedAt: string | null;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  logo_id?: string;
  logo?: Media | null;
  social_media_link: string;
  bank_soal_link: string;
  silabus_link: string;
  bank_ref_link: string;
  created_at?: string;
  updated_at?: string;
}

export interface CabinetInfo {
  id: string;
  visi: string;
  misi: string;
  tagline: string;
  description: string;
  period_start: string;
  period_end: string;
  logo_id?: string;
  logo?: Media | null;
  organigram_id?: string | null;
  organigram?: Media | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface News {
  id: string;
  slug: string;
  title: string;
  content: string;
  thumbnail_id?: string;
  thumbnail?: Media;
  tagline: string;
  hashtags: string;
  published_at: string;
  created_at: string;
  updated_at?: string;
}

export interface MonthlyEvent {
  id: string;
  title: string;
  description: string;
  thumbnail_id?: string;
  thumbnail?: Media;
  month: string; // ISO Date string
  link: string;
  created_at?: string;
  updated_at?: string;
}

export interface Timeline {
  id: string;
  progenda_id: string;
  date: string;
  info: string;
  link: string;
  created_at?: string;
  updated_at?: string;
}

export interface Progenda {
  id: string;
  name: string;
  goal: string;
  description: string;
  website_link: string;
  instagram_link: string;
  twitter_link: string;
  linkedin_link: string;
  youtube_link: string;
  department_id: string;
  department?: Department;
  thumbnail_id?: string;
  thumbnail?: Media;
  timelines: Timeline[];
  feeds: Media[];
  created_at?: string;
  updated_at?: string;
}

export interface Gallery {
  id: string;
  image_url: string;
  caption: string;
  category: string;
  department_id: string | null;
  progenda_id: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Member {
  id: string;
  name: string;
  nrp: string;
  role: string;
  department_id: string;
  department?: Department;
  photo_id?: string;
  photo?: Media;
  period: string; // Note: Member still has period string in response example
  created_at?: string;
  updated_at?: string;
}

export type NewsAutocompletion = string;

export interface LoginCredentials {
  username?: string;
  password?: string;
}

export interface AuthResponse {
  token?: string;
  access_token?: string;
  data?: {
    token?: string;
    user?: unknown;
  };
  user?: {
    username: string;
    role: string;
  };
}
