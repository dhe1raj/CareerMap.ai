
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

// Add custom RPC function definitions
interface CustomRPCFunctions {
  insert_match: (args: {
    role_param: string;
    short_desc_param: string;
    icon_param: string;
    match_pct_param: number;
    bullets_param: string[];
  }) => Promise<{ data: null; error: any }>;

  insert_user_match: (args: {
    user_id_param: string;
    match_id_param: string;
  }) => Promise<{ data: null; error: any }>;

  get_all_resources: () => Promise<{ data: ResourceRow[]; error: any }>;

  get_user_resource_progress: (args: {
    user_id_param: string;
  }) => Promise<{ data: UserResourceProgressRow[]; error: any }>;

  insert_resource: (args: {
    type_param: string;
    title_param: string;
    url_param: string;
    thumbnail_param: string | null;
    skill_tag_param: string;
    description_param: string;
  }) => Promise<{ data: null; error: any }>;

  upsert_user_resource_progress: (args: {
    user_id_param: string;
    resource_id_param: string;
    completed_param: boolean;
    completed_at_param: string | null;
  }) => Promise<{ data: null; error: any }>;
}

// Helper functions to work around type limitations
export const supabaseCustomHelpers = {
  // Matches
  matches: {
    select: async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ddjqbsscsxgiicaabxxc.supabase.co'}/rest/v1/matches?select=*`, {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanFic3Njc3hnaWljYWFieHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MTg4OTEsImV4cCI6MjA2MzI5NDg5MX0.gyBvS28g8ohGSUrlXCUofZuUwWIcaPdNnq0yungEAas',
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        return { data: data as MatchRow[], error: null };
      } catch (error) {
        return { data: [] as MatchRow[], error };
      }
    },
    insert: async (match: MatchInsert) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ddjqbsscsxgiicaabxxc.supabase.co'}/rest/v1/matches`, {
          method: 'POST',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanFic3Njc3hnaWljYWFieHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MTg4OTEsImV4cCI6MjA2MzI5NDg5MX0.gyBvS28g8ohGSUrlXCUofZuUwWIcaPdNnq0yungEAas',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(match)
        });
        const data = await response.json();
        return { data: data as MatchRow[], error: null };
      } catch (error) {
        return { data: [] as MatchRow[], error };
      }
    }
  },
  
  // User matches
  userMatches: {
    insert: async (userMatch: UserMatchInsert) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ddjqbsscsxgiicaabxxc.supabase.co'}/rest/v1/user_matches`, {
          method: 'POST',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanFic3Njc3hnaWljYWFieHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MTg4OTEsImV4cCI6MjA2MzI5NDg5MX0.gyBvS28g8ohGSUrlXCUofZuUwWIcaPdNnq0yungEAas',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userMatch)
        });
        const data = await response.json();
        return { data: data as UserMatchRow[], error: null };
      } catch (error) {
        return { data: [] as UserMatchRow[], error };
      }
    }
  },
  
  // Resources
  resources: {
    select: async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ddjqbsscsxgiicaabxxc.supabase.co'}/rest/v1/resources?select=*`, {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanFic3Njc3hnaWljYWFieHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MTg4OTEsImV4cCI6MjA2MzI5NDg5MX0.gyBvS28g8ohGSUrlXCUofZuUwWIcaPdNnq0yungEAas',
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        return { data: data as ResourceRow[], error: null };
      } catch (error) {
        return { data: [] as ResourceRow[], error };
      }
    },
    insert: async (resource: ResourceInsert) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ddjqbsscsxgiicaabxxc.supabase.co'}/rest/v1/resources`, {
          method: 'POST',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanFic3Njc3hnaWljYWFieHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MTg4OTEsImV4cCI6MjA2MzI5NDg5MX0.gyBvS28g8ohGSUrlXCUofZuUwWIcaPdNnq0yungEAas',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resource)
        });
        const data = await response.json();
        return { data: data as ResourceRow[], error: null };
      } catch (error) {
        return { data: [] as ResourceRow[], error };
      }
    }
  },
  
  // User resource progress
  userResourceProgress: {
    select: async (userId: string) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ddjqbsscsxgiicaabxxc.supabase.co'}/rest/v1/user_resource_progress?user_id=eq.${userId}`, {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanFic3Njc3hnaWljYWFieHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MTg4OTEsImV4cCI6MjA2MzI5NDg5MX0.gyBvS28g8ohGSUrlXCUofZuUwWIcaPdNnq0yungEAas',
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        return { data: data as UserResourceProgressRow[], error: null };
      } catch (error) {
        return { data: [] as UserResourceProgressRow[], error };
      }
    },
    upsert: async (progress: UserResourceProgressInsert) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ddjqbsscsxgiicaabxxc.supabase.co'}/rest/v1/user_resource_progress`, {
          method: 'POST',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanFic3Njc3hnaWljYWFieHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MTg4OTEsImV4cCI6MjA2MzI5NDg5MX0.gyBvS28g8ohGSUrlXCUofZuUwWIcaPdNnq0yungEAas',
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(progress)
        });
        const data = await response.json();
        return { data: data as UserResourceProgressRow[], error: null };
      } catch (error) {
        return { data: [] as UserResourceProgressRow[], error };
      }
    }
  }
};

// Helper function to safely call RPC functions
export const callRPC = async <T extends keyof CustomRPCFunctions>(
  functionName: T, 
  params?: Parameters<CustomRPCFunctions[T]>[0]
): Promise<ReturnType<CustomRPCFunctions[T]> extends Promise<infer R> ? R : never> => {
  try {
    // Use direct fetch for RPC calls
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ddjqbsscsxgiicaabxxc.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanFic3Njc3hnaWljYWFieHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MTg4OTEsImV4cCI6MjA2MzI5NDg5MX0.gyBvS28g8ohGSUrlXCUofZuUwWIcaPdNnq0yungEAas';
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: params ? JSON.stringify(params) : null
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return { data: null, error: new Error(errorText) } as any;
    }
    
    const result = await response.json();
    return { data: result, error: null } as any;
  } catch (error) {
    return { data: null, error } as any;
  }
};
