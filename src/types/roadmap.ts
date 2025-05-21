
export interface RoadmapItem {
  id?: string;
  label: string;
  tooltip?: string;
  link?: string;
  completed?: boolean;
}

export interface RoadmapSection {
  title: string;
  items: RoadmapItem[];
  collapsed?: boolean;
}

export interface Roadmap {
  id?: string;
  title: string;
  type: 'role' | 'skill' | 'course';
  sections: RoadmapSection[];
  created_at?: string;
  user_id?: string;
  is_public?: boolean;
}

export interface RoadmapProgress {
  id?: string;
  roadmap_id: string;
  user_id: string;
  progress_pct: number;
  completed_items: string[];
  started_at?: string;
  updated_at?: string;
}

export interface RoadmapFormData {
  role: string;
  studentType: 'student' | 'working';
  collegeTier?: string;
  degree?: string;
  knownSkills?: string;
  learningPreference: 'video' | 'text' | 'project';
}
