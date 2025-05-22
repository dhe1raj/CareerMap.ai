
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import SEOMetadata from '@/components/SEOMetadata';
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { CareerChat } from "@/components/dashboard/CareerChat";
import { ResumeAnalysis } from "@/components/dashboard/ResumeAnalysis";
import { useUserData } from "@/hooks/use-user-data";
import { RoadmapProgress } from "@/components/dashboard/RoadmapProgress";
import SuggestionChip from "@/components/dashboard/SuggestionChip";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userData, saveField } = useUserData();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <DashboardLayout>
      <SEOMetadata 
        title="Dashboard | CareerMap"
        description="Your personal career growth dashboard"
        keywords="career, dashboard, progress, skills"
        canonicalPath="/dashboard"
      />
      
      <div className="container py-8 max-w-7xl">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RoadmapProgress />
          
          <Card className="glass-morphism">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  AI Career Chat
                </h2>
                <Sparkles className="h-6 w-6 text-purple-300" />
              </div>
              <p className="text-white/70 text-sm">
                Get instant career advice and insights from our AI-powered chat assistant.
              </p>
            </div>
            <CareerChat 
              userData={userData}
              onUpdateField={saveField}
            />
          </Card>
          
          <Card className="glass-morphism">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-4">
                Resume Analysis
              </h2>
              <p className="text-white/70 text-sm">
                Get instant feedback on your resume and identify areas for improvement.
              </p>
            </div>
            <ResumeAnalysis 
              userData={userData}
              onUpdateField={saveField}
            />
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-white tracking-tight">
          Quick Actions
        </h2>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <SuggestionChip 
            label="Explore job matches" 
            href="/career-matches" 
          />
          <SuggestionChip 
            label="Career roadmaps" 
            href="/career-progress" 
          />
          <SuggestionChip 
            label="Learning resources" 
            href="/career-resources" 
          />
          <SuggestionChip 
            label="Resume analyzer" 
            href="/resume-analysis" 
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
