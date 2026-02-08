export interface Meta {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: Meta;
}

export interface Department {
    id: string;
    name: string;
    description: string;
    logo_id?: string;
    logo_url?: string;
}

export interface CabinetInfo {
    id: string;
    visi: string;
    misi: string;
    tagline: string;
    period: string;
    logo_id?: string;
    is_active: boolean;
}

export interface News {
    id: string;
    title: string;
    content: string;
    thumbnail_id?: string;
    thumbnail_url?: string;
    tagline: string;
    hashtags: string;
    published_at: string;
    created_at: string;
}

export interface MonthlyEvent {
    id: string;
    title: string;
    description: string;
    thumbnail_id?: string;
    thumbnail_url?: string;
    month: string;
    link: string;
}

export interface Progenda {
    id: string;
    name: string;
    goal: string;
    description: string;
    timeline: string;
    website_link: string;
    department_id: string;
    thumbnail_id?: string;
}
