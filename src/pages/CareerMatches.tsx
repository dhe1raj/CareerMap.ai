
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Briefcase, Clock, BookOpen, DollarSign, Star, BarChart3, Smile, PieChart } from "lucide-react";

interface CareerStep {
  title: string;
  description: string;
  items: string[];
  timeframe: string;
}

interface CareerRoadmap {
  title: string;
  overview: string;
  salary: {
    entry: string;
    mid: string;
    senior: string;
  };
  workLifeBalance: {
    stress: string;
    workHours: string;
    flexibility: string;
  };
  growthPotential: string;
  steps: CareerStep[];
  recommendedCompanies: string[];
  jobPlatforms: string[];
}

export default function CareerMatches() {
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the roadmap data from localStorage
    const roadmapData = localStorage.getItem("careerRoadmap");
    if (roadmapData) {
      try {
        const parsedData = JSON.parse(roadmapData);
        setRoadmap(parsedData);
      } catch (error) {
        console.error("Error parsing roadmap data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const getStressLevelColor = (stressLevel: string) => {
    switch (stressLevel.toLowerCase()) {
      case "low": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-red-500";
      default: return "bg-blue-500";
    }
  };

  const getStressPercentage = (stressLevel: string) => {
    switch (stressLevel.toLowerCase()) {
      case "low": return 30;
      case "medium": return 60;
      case "high": return 90;
      default: return 50;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Analyzing your perfect career match...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!roadmap) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Career Match Not Found</CardTitle>
              <CardDescription>
                We couldn't find a career roadmap for you. Let's create one!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                It looks like you haven't completed the career design process yet, or there was an error analyzing your results.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate("/career-designer")}>
                Go to Career Designer
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{roadmap.title}</h1>
          <p className="text-muted-foreground mt-2">{roadmap.overview}</p>
        </div>

        <Tabs defaultValue="roadmap" className="mb-8">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="insights">Career Insights</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="platforms">Job Platforms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="roadmap" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="mb-6">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" /> 
                    Career Path Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">{roadmap.overview}</p>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" /> 
                    Salary Expectations
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Entry Level</span>
                        <span className="text-sm font-bold text-green-500">{roadmap.salary.entry}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Mid Level</span>
                        <span className="text-sm font-bold text-green-500">{roadmap.salary.mid}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Senior Level</span>
                        <span className="text-sm font-bold text-green-500">{roadmap.salary.senior}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6 mt-6">
              {roadmap.steps.map((step, index) => (
                <Card key={index} className={index === 0 ? "border-l-4 border-l-primary" : ""}>
                  <CardHeader className="bg-muted/30">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="flex items-center justify-center bg-primary text-white rounded-full h-6 w-6 text-sm">
                          {index + 1}
                        </span>
                        {step.title}
                      </CardTitle>
                      <Badge variant="outline" className="ml-2">
                        <Clock className="mr-1 h-3 w-3" /> {step.timeframe}
                      </Badge>
                    </div>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="list-disc list-inside space-y-1">
                      {step.items.map((item, i) => (
                        <li key={i} className="text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    <Smile className="h-5 w-5 text-blue-500" /> 
                    Work-Life Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Stress Level</span>
                        <span className="text-sm font-medium">{roadmap.workLifeBalance.stress}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${getStressLevelColor(roadmap.workLifeBalance.stress)}`} 
                          style={{ width: `${getStressPercentage(roadmap.workLifeBalance.stress)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Work Hours</span>
                        <span className="text-sm font-medium">{roadmap.workLifeBalance.workHours}</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">Flexibility</span>
                      <p className="mt-1 text-muted-foreground">{roadmap.workLifeBalance.flexibility}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" /> 
                    Growth Potential
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">{roadmap.growthPotential}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="companies">
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-indigo-500" /> 
                  Recommended Companies
                </CardTitle>
                <CardDescription>Companies that would be a good match for this career path</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roadmap.recommendedCompanies.map((company, index) => (
                    <div 
                      key={index} 
                      className="p-4 border rounded-lg bg-card hover:bg-accent transition-colors duration-200"
                    >
                      <p className="font-medium">{company}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="platforms">
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-teal-500" /> 
                  Job Platforms
                </CardTitle>
                <CardDescription>Where to find jobs in this career path</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roadmap.jobPlatforms.map((platform, index) => (
                    <div 
                      key={index} 
                      className="p-4 border rounded-lg bg-card hover:bg-accent transition-colors duration-200"
                    >
                      <p className="font-medium">{platform}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => navigate("/career-designer")}>
            Back to Career Designer
          </Button>
          <Button onClick={() => navigate("/roadmap")}>
            View Detailed Roadmap <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
