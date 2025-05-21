
// This file contains type helpers for Supabase tables that haven't been 
// added to the generated types yet

// Match types
export interface MatchInsert {
  role: string;
  short_desc: string;
  icon: string;
  match_pct: number;
  bullets: string[];
}

export interface MatchRow extends MatchInsert {
  id: string;
  created_at: string;
}

// User Match types
export interface UserMatchInsert {
  user_id: string;
  match_id: string;
}

export interface UserMatchRow extends UserMatchInsert {
  id: string;
  saved_at: string;
}

// Resource types
export interface ResourceInsert {
  type: string;
  title: string;
  url: string;
  thumbnail?: string;
  skill_tag: string;
  description: string;
}

export interface ResourceRow extends ResourceInsert {
  id: string;
  created_at: string;
}

// User Resource Progress types
export interface UserResourceProgressInsert {
  user_id: string;
  resource_id: string;
  completed?: boolean;
  completed_at?: string;
}

export interface UserResourceProgressRow extends UserResourceProgressInsert {
  id: string;
}
