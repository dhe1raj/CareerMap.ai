
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import SEOMetadata from '@/components/SEOMetadata';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useGeminiCareer } from '@/hooks/use-gemini-career';
import { CareerMatch, CareerMatchCard } from '@/components/career/CareerMatchCard';
import { Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CareerMatches() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string>('');
  const [interests, setInterests] = useState<string>('');
  const [education, setEducation] = useState<string>('');
  const [showMatches, setShowMatches] = useState(false);
  const { isLoading, matches, generateCareerMatches } = useGeminiCareer();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleGenerateMatches = async () => {
    if (!skills && !interests && !education) {
      toast({
        title: "Missing Information",
        description: "Please provide at least one of: skills, interests, or education.",
        variant: "destructive"
      });
      return;
    }

    try {
      await generateCareerMatches(
        skills.split(',').map(s => s.trim()).filter(Boolean),
        interests.split(',').map(i => i.trim()).filter(Boolean),
        education.trim()
      );

      setShowMatches(true);
    } catch (error) {
      console.error("Error generating matches:", error);
      toast({
        title: "Error",
        description: "Failed to generate career matches. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUploadResume = () => {
    navigate('/resume-analysis');
  };

  return (
    <DashboardLayout>
      <SEOMetadata
        title="Career Matches | CareerMap"
        description="Discover career paths that match your skills, interests, and education."
        keywords="career matches, job matches, skills match, career recommendations"
        canonicalPath="/career-matches"
      />

      <div className="container py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Career Matches</h1>
            <p className="text-muted-foreground">
              Find career paths that match your skills, interests, and education
            </p>
          </div>

          <Button onClick={handleUploadResume} className="glowing-purple">
            <Sparkles className="mr-2 h-4 w-4" />
            Upload Resume for Matches
          </Button>
        </div>

        {!showMatches ? (
          <Card className="glass-morphism mb-10">
            <CardHeader>
              <CardTitle>Find Your Career Matches</CardTitle>
              <CardDescription>
                Enter your skills, interests, and education to get personalized career recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Skills
                </label>
                <Textarea
                  placeholder="E.g., Python, Data Analysis, Project Management, Communication (separate with commas)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Interests
                </label>
                <Textarea
                  placeholder="E.g., Technology, Healthcare, Finance, Art (separate with commas)"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Education
                </label>
                <Textarea
                  placeholder="E.g., Bachelor's in Computer Science, High School Diploma, Self-taught"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  rows={2}
                />
              </div>

              <Button
                onClick={handleGenerateMatches}
                className="w-full glowing-purple"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Matches...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Career Matches
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-medium">
                {matches.length} Career Matches Found
              </div>
              <Button
                variant="outline"
                onClick={() => setShowMatches(false)}
              >
                Edit Profile
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match, index) => (
                <CareerMatchCard key={index} match={match} />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
