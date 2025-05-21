
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import SEOMetadata from '@/components/SEOMetadata';
import CareerDesignForm from '@/components/CareerDesignForm';

export default function CareerDesigner() {
  return (
    <DashboardLayout>
      <SEOMetadata 
        title="Career Designer | CareerMap"
        description="Design your career path with our interactive career designer tool."
        keywords="career designer, career path, roadmap"
        canonicalPath="/career-designer"
      />
      
      <div className="container py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Career Designer</h1>
        <p className="text-muted-foreground mb-8">
          Craft your ideal career path by defining your goals, skills, and interests. Our AI-powered tool will generate a personalized roadmap to guide you on your journey.
        </p>
        
        <CareerDesignForm />
      </div>
    </DashboardLayout>
  );
}
