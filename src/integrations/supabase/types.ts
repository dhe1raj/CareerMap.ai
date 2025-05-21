export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      career_roles: {
        Row: {
          avg_salary: number | null
          created_at: string | null
          description: string
          id: string
          job_demand: string | null
          title: string
          work_environment: string | null
        }
        Insert: {
          avg_salary?: number | null
          created_at?: string | null
          description: string
          id?: string
          job_demand?: string | null
          title: string
          work_environment?: string | null
        }
        Update: {
          avg_salary?: number | null
          created_at?: string | null
          description?: string
          id?: string
          job_demand?: string | null
          title?: string
          work_environment?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_ai: boolean
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_ai: boolean
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_ai?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          bullets: Json
          created_at: string | null
          icon: string
          id: string
          match_pct: number
          role: string
          short_desc: string
        }
        Insert: {
          bullets: Json
          created_at?: string | null
          icon: string
          id?: string
          match_pct: number
          role: string
          short_desc: string
        }
        Update: {
          bullets?: Json
          created_at?: string | null
          icon?: string
          id?: string
          match_pct?: number
          role?: string
          short_desc?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          education: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string | null
          description: string
          id: string
          skill_tag: string
          thumbnail: string | null
          title: string
          type: string
          url: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          skill_tag: string
          thumbnail?: string | null
          title: string
          type: string
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          skill_tag?: string
          thumbnail?: string | null
          title?: string
          type?: string
          url?: string
        }
        Relationships: []
      }
      roadmap_resources: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          label: string
          roadmap_id: string
          url: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          label: string
          roadmap_id: string
          url?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          label?: string
          roadmap_id?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_resources_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "user_roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_skills: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          label: string
          roadmap_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          label: string
          roadmap_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          label?: string
          roadmap_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_skills_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "user_roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_steps: {
        Row: {
          category: string
          completed: boolean | null
          created_at: string | null
          description: string
          id: string
          resource_url: string | null
          roadmap_id: string
          step_number: number
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          completed?: boolean | null
          created_at?: string | null
          description: string
          id?: string
          resource_url?: string | null
          roadmap_id: string
          step_number: number
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          completed?: boolean | null
          created_at?: string | null
          description?: string
          id?: string
          resource_url?: string | null
          roadmap_id?: string
          step_number?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_steps_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_timeline: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          order_number: number
          roadmap_id: string
          step: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          order_number: number
          roadmap_id: string
          step: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          order_number?: number
          roadmap_id?: string
          step?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_timeline_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "user_roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_tools: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          label: string
          roadmap_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          label: string
          roadmap_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          label?: string
          roadmap_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_tools_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "user_roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          role_id: string
          sections: Json | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          role_id: string
          sections?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          role_id?: string
          sections?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmaps_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "career_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roadmaps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_skills: {
        Row: {
          created_at: string | null
          id: string
          importance: string
          role_id: string
          skill_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          importance: string
          role_id: string
          skill_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          importance?: string
          role_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_skills_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "career_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_matches: {
        Row: {
          id: string
          match_id: string
          saved_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          match_id: string
          saved_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          match_id?: string
          saved_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      user_resource_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: string
          resource_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          resource_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_resource_progress_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roadmap_steps: {
        Row: {
          completed: boolean | null
          created_at: string | null
          est_time: string | null
          id: string
          label: string
          order_number: number
          roadmap_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          est_time?: string | null
          id?: string
          label: string
          order_number: number
          roadmap_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          est_time?: string | null
          id?: string
          label?: string
          order_number?: number
          roadmap_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roadmap_steps_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "user_roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roadmaps: {
        Row: {
          category: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_custom: boolean | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_custom?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_custom?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          created_at: string | null
          id: string
          proficiency_level: string | null
          skill_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          proficiency_level?: string | null
          skill_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          proficiency_level?: string | null
          skill_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users_roadmap_progress: {
        Row: {
          completed_items: Json | null
          id: string
          progress_pct: number | null
          roadmap_id: string
          started_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_items?: Json | null
          id?: string
          progress_pct?: number | null
          roadmap_id: string
          started_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_items?: Json | null
          id?: string
          progress_pct?: number | null
          roadmap_id?: string
          started_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_roadmap_progress_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_roadmap_resources_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_roadmap_skills_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_roadmap_timeline_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_roadmap_tools_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
