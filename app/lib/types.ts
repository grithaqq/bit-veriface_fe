// ─── Menu / RBAC Types ────────────────────────────────────────────────────────

export interface MenuItem {
  id: string | number;
  label: string;
  path: string;
  icon: string;
}

export interface UserInfo {
  user_id: string;
  role: string;
  username: string;
}

export interface MenuResponse {
  success: boolean;
  user: UserInfo;
  navigation: MenuItem[];
}

// ─── Gallery Types ────────────────────────────────────────────────────────────

export interface GalleryItem {
  id: string;
  original_filename: string;
  saved_filename: string;
  thumbnail_filename: string | null;
  content_type: string;
  created_at: string;
  updated_at: string | null;
  user_id: string;
}

export interface GalleryResponse {
  status: number;
  message: string;
  data: GalleryItem[];
  pagination: PaginationInfo;
}

// ─── Search / Upload Types ────────────────────────────────────────────────────

export interface SearchResult {
  img_path: string;
  img_id: string;
  user_id: string;
  distance?: number;
}

export interface PaginationInfo {
  total_item: number;
  total_page: number;
  page_size: number;
  curr_page: number;
  prev_page: number;
  next_page: number;
  has_prev: boolean;
  has_next: boolean;
}

export interface ApiResponse {
  status: number;
  message: string;
  data: SearchResult[];
  pagination: PaginationInfo;
}
