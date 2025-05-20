
import { BookMarked, Briefcase, ChevronRight, FileText, Route } from "lucide-react";
import { CareerProgress } from "@/components/dashboard/CareerProgress";
import { ResumeAnalysis } from "@/components/dashboard/ResumeAnalysis";
import { CareerChat } from "@/components/dashboard/CareerChat";
import { UserData } from "@/hooks/use-user-data";
import { CareerDesignCard } from "./CareerDesignCard";
import { NavCard } from "./NavCard";

interface DashboardContentProps {
  userData: UserData;
  saveField: (path: string, value: any) => void;
  userRoadmap: any;
  roadmapProgress: number;
}

export function DashboardContent({
  userData,
  saveField,
  userRoadmap,
  roadmapProgress
}: DashboardContentProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Career Progress Card */}
      <div className="md:col-span-2 lg:col-span-2">
        <CareerProgress 
          userData={userData} 
          onUpdateField={saveField}
        />
      </div>
      
      {/* Resume Analysis Card */}
      <ResumeAnalysis 
        userData={userData} 
        onUpdateField={saveField}
      />
      
      {/* Career Chat Card */}
      <CareerChat 
        userData={userData} 
        onUpdateField={saveField}
      />
      
      {/* Career Design Card */}
      <CareerDesignCard 
        userRoadmap={userRoadmap} 
        roadmapProgress={roadmapProgress} 
      />
      
      {/* Career Roadmap Card */}
      <NavCard
        title="Career Roadmap"
        description="Your personalized learning path"
        content="Follow a step-by-step roadmap to achieve your career goals with curated resources."
        path="/roadmap"
        buttonText="View Roadmap"
        icon={<BookMarked className="mr-2 h-4 w-4" />}
      />
      
      {/* Career Matches Card */}
      <NavCard
        title="Career Matches"
        description="Explore roles that match your profile"
        content="Discover career paths and roles that align with your skills, interests, and experience."
        path="/career-matches"
        buttonText="View Matches"
        icon={<Briefcase className="mr-2 h-4 w-4" />}
      />
      
      {/* Resume Analysis Full Card */}
      <NavCard
        title="Resume Analysis"
        description="Get detailed feedback on your resume"
        content="Get comprehensive AI-powered feedback and suggestions to improve your resume and stand out to employers."
        path="/resume-analysis"
        buttonText="Full Analysis"
        icon={<FileText className="mr-2 h-4 w-4" />}
      />
    </div>
  );
}
