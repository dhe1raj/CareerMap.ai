
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

// Helper functions to work around type limitations
export const supabaseCustomHelpers = {
  // Matches
  matches: {
    select: async () => {
      const { data, error } = await fetch(`${process.env.SUPABASE_URL}/rest/v1/matches?select=*`, {
        headers: {
          'apikey': process.env.SUPABASE_KEY || '',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
      return { data: data as MatchRow[], error };
    },
    insert: async (match: MatchInsert) => {
      const { data, error } = await fetch(`${process.env.SUPABASE_URL}/rest/v1/matches`, {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_KEY || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(match)
      }).then(res => res.json());
      return { data: data as MatchRow[], error };
    }
  },
  
  // User matches
  userMatches: {
    insert: async (userMatch: UserMatchInsert) => {
      const { data, error } = await fetch(`${process.env.SUPABASE_URL}/rest/v1/user_matches`, {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_KEY || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userMatch)
      }).then(res => res.json());
      return { data: data as UserMatchRow[], error };
    }
  },
  
  // Resources
  resources: {
    select: async () => {
      const { data, error } = await fetch(`${process.env.SUPABASE_URL}/rest/v1/resources?select=*`, {
        headers: {
          'apikey': process.env.SUPABASE_KEY || '',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
      return { data: data as ResourceRow[], error };
    },
    insert: async (resource: ResourceInsert) => {
      const { data, error } = await fetch(`${process.env.SUPABASE_URL}/rest/v1/resources`, {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_KEY || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resource)
      }).then(res => res.json());
      return { data: data as ResourceRow[], error };
    }
  },
  
  // User resource progress
  userResourceProgress: {
    select: async (userId: string) => {
      const { data, error } = await fetch(`${process.env.SUPABASE_URL}/rest/v1/user_resource_progress?user_id=eq.${userId}`, {
        headers: {
          'apikey': process.env.SUPABASE_KEY || '',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
      return { data: data as UserResourceProgressRow[], error };
    },
    upsert: async (progress: UserResourceProgressInsert) => {
      const { data, error } = await fetch(`${process.env.SUPABASE_URL}/rest/v1/user_resource_progress`, {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_KEY || '',
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(progress)
      }).then(res => res.json());
      return { data: data as UserResourceProgressRow[], error };
    }
  }
};

