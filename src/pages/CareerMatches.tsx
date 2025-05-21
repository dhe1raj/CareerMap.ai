
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import SEOMetadata from '@/components/SEOMetadata';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGeminiCareer } from '@/hooks/use-gemini-career';
import { Skeleton } from '@/components/ui/skeleton';
import { CareerMatchCard } from '@/components/career/CareerMatchCard';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Sparkles, Upload } from 'lucide-react';

const CareerMatches = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [education, setEducation] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [resumeAnalysis, setResumeAnalysis] = useState<{ summary: string; suggestions: string[] } | null>(null);
  
  // Remove references to isProcessing and generateSuggestions
  const { isLoading, matches, generateCareerMatches, analyzeResume } = useGeminiCareer();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };
  
  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };
  
  const handleAddInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };
  
  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };
  
  const handleGenerateMatches = async () => {
    const results = await generateCareerMatches(skills, interests, education);
    console.log("Generated matches:", results);
  };
  
  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) return;
    
    const analysis = await analyzeResume(resumeText);
    setResumeAnalysis(analysis);
  };
  
  return (
    <DashboardLayout>
      <SEOMetadata 
        title="Career Matches | CareerMap"
        description="Discover career paths that match your skills and interests."
        keywords="career matches, job recommendations, skills assessment"
        canonicalPath="/career-matches"
      />
      
      <div className="container py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-2">Career Matches</h1>
        <p className="text-muted-foreground mb-6">Find career paths that match your skills and interests</p>
        
        <Tabs defaultValue="skills">
          <TabsList className="mb-6">
            <TabsTrigger value="skills">Skills & Interests</TabsTrigger>
            <TabsTrigger value="resume">Resume Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Enter your skills, interests, and education</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Skills</label>
                    <div className="flex gap-2 mb-2">
                      <Input 
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill..."
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                      />
                      <Button onClick={handleAddSkill} type="button">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill) => (
                        <div key={skill} className="bg-purple-500/20 text-purple-100 px-2 py-1 rounded-md flex items-center gap-2">
                          {skill}
                          <button 
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-purple-300 hover:text-white"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Interests</label>
                    <div className="flex gap-2 mb-2">
                      <Input 
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        placeholder="Add an interest..."
                        onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                      />
                      <Button onClick={handleAddInterest} type="button">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {interests.map((interest) => (
                        <div key={interest} className="bg-purple-500/20 text-purple-100 px-2 py-1 rounded-md flex items-center gap-2">
                          {interest}
                          <button 
                            onClick={() => handleRemoveInterest(interest)}
                            className="text-purple-300 hover:text-white"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Education</label>
                    <Input 
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="Highest education level or field of study"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleGenerateMatches} 
                    disabled={isLoading || skills.length === 0}
                    className="w-full glowing-purple"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Career Matches
                  </Button>
                </CardContent>
              </Card>
              
              <div>
                <h2 className="text-xl font-bold mb-4">Your Career Matches</h2>
                
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="glass-morphism">
                        <CardHeader>
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-5/6" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : matches.length > 0 ? (
                  <div className="space-y-4">
                    {matches.map((match, index) => (
                      <CareerMatchCard key={index} match={match} />
                    ))}
                  </div>
                ) : (
                  <Card className="glass-morphism text-center p-6">
                    <p className="text-muted-foreground">
                      Enter your skills and interests, then generate matches to see career recommendations.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resume">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Resume Analysis</CardTitle>
                  <CardDescription>Paste your resume to get career insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea 
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    className="min-h-[200px]"
                  />
                  
                  <Button 
                    onClick={handleAnalyzeResume} 
                    disabled={isLoading || !resumeText.trim()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Analyze Resume
                  </Button>
                </CardContent>
              </Card>
              
              <div>
                <h2 className="text-xl font-bold mb-4">Resume Analysis</h2>
                
                {isLoading ? (
                  <Card className="glass-morphism">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ) : resumeAnalysis ? (
                  <Card className="glass-morphism">
                    <CardHeader>
                      <CardTitle>Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Summary</h3>
                        <p>{resumeAnalysis.summary}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Suggestions</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {resumeAnalysis.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="glass-morphism text-center p-6">
                    <p className="text-muted-foreground">
                      Paste your resume and analyze it to get personalized feedback and career suggestions.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CareerMatches;
