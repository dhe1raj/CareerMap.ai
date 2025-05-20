
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Brain, Rocket, Search, Building, Download, ArrowLeft } from "lucide-react";

interface AnalysisResultsProps {
  results: {
    strengths: string[];
    improvements: string[];
    careerPaths: string[];
    topSkills: string[];
    potentialCompanies: string[];
  };
  onReset: () => void;
}

export default function ResumeAnalysisResults({ results, onReset }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState("strengths");
  
  const generateReport = () => {
    // In a real implementation, this would generate a PDF report
    alert("This feature would generate a downloadable PDF report in a real implementation.");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Career Analysis</CardTitle>
              <CardDescription>
                Based on your resume, here's our personalized career guidance
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onReset}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Upload Another Resume
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="strengths" className="flex flex-col items-center gap-1 py-3 h-auto">
                <Check className="h-4 w-4" />
                <span className="text-xs">Strengths</span>
              </TabsTrigger>
              <TabsTrigger value="improvements" className="flex flex-col items-center gap-1 py-3 h-auto">
                <Search className="h-4 w-4" />
                <span className="text-xs">Improvements</span>
              </TabsTrigger>
              <TabsTrigger value="careers" className="flex flex-col items-center gap-1 py-3 h-auto">
                <Rocket className="h-4 w-4" />
                <span className="text-xs">Career Paths</span>
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex flex-col items-center gap-1 py-3 h-auto">
                <Brain className="h-4 w-4" />
                <span className="text-xs">Top Skills</span>
              </TabsTrigger>
              <TabsTrigger value="companies" className="flex flex-col items-center gap-1 py-3 h-auto">
                <Building className="h-4 w-4" />
                <span className="text-xs">Companies</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="strengths" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    What You're Already Strong In
                  </CardTitle>
                  <CardDescription>
                    These are your existing strengths based on your resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="improvements" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Search className="h-5 w-5 mr-2 text-blue-500" />
                    What You Can Improve
                  </CardTitle>
                  <CardDescription>
                    Focus on these areas to enhance your career prospects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <Search className="h-5 w-5 mr-2 text-blue-500 shrink-0 mt-0.5" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="careers" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Rocket className="h-5 w-5 mr-2 text-purple-500" />
                    Careers You Can Go For
                  </CardTitle>
                  <CardDescription>
                    Career paths that align with your current experience and skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.careerPaths.map((career, index) => (
                      <li key={index} className="flex items-start">
                        <Rocket className="h-5 w-5 mr-2 text-purple-500 shrink-0 mt-0.5" />
                        <span>{career}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skills" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-amber-500" />
                    Top Skills to Master Next
                  </CardTitle>
                  <CardDescription>
                    Skills that will enhance your career trajectory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.topSkills.map((skill, index) => (
                      <li key={index} className="flex items-start">
                        <Brain className="h-5 w-5 mr-2 text-amber-500 shrink-0 mt-0.5" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="companies" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Building className="h-5 w-5 mr-2 text-indigo-500" />
                    Where You Could Apply
                  </CardTitle>
                  <CardDescription>
                    Types of companies and platforms where your skills would be valued
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.potentialCompanies.map((company, index) => (
                      <li key={index} className="flex items-start">
                        <Building className="h-5 w-5 mr-2 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{company}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={generateReport} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download Career Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
