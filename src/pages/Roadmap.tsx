
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGeminiContext } from "@/context/GeminiContext";
import { useGemini } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import GeminiApiKeyInput from "@/components/GeminiApiKeyInput";

// Mock data for the roadmaps
const roadmapMockData = {
  "cybersecurity-analyst": {
    title: "Cybersecurity Analyst",
    steps: [
      {
        title: "Learn Foundational Concepts",
        description: "Master the basic principles of cybersecurity and networking.",
        items: [
          "Networking fundamentals (TCP/IP, DNS, routing)",
          "Basic security concepts (CIA triad, authentication, authorization)",
          "Operating system security (Windows, Linux)"
        ]
      },
      {
        title: "Recommended Courses",
        description: "Take these courses to build your knowledge base.",
        items: [
          "CompTIA Security+ Certification Course",
          "Cybersecurity Fundamentals by University of Maryland (Coursera)",
          "Ethical Hacking by Troy Hunt (Pluralsight)"
        ]
      },
      {
        title: "Build These Projects",
        description: "Gain practical experience by building these projects.",
        items: [
          "Set up a home lab with virtual machines to practice security tasks",
          "Conduct vulnerability assessment on a test environment",
          "Configure and monitor a basic firewall"
        ]
      },
      {
        title: "Certifications to Pursue",
        description: "Industry-recognized certifications to boost your credibility.",
        items: [
          "CompTIA Security+",
          "Certified Ethical Hacker (CEH)",
          "GIAC Security Essentials (GSEC)"
        ]
      },
      {
        title: "Communities to Join",
        description: "Connect with other professionals in your field.",
        items: [
          "OWASP (Open Web Application Security Project)",
          "r/netsec on Reddit",
          "Infosec Community on Discord"
        ]
      }
    ]
  },
  "data-scientist": {
    title: "Data Scientist",
    steps: [
      {
        title: "Learn Foundational Concepts",
        description: "Master the fundamental principles of data science.",
        items: [
          "Mathematics and statistics (probability, hypothesis testing, regression)",
          "Programming in Python and R",
          "Data manipulation and cleaning techniques"
        ]
      },
      {
        title: "Recommended Courses",
        description: "Take these courses to build your knowledge base.",
        items: [
          "Data Science Specialization by Johns Hopkins University (Coursera)",
          "Machine Learning by Andrew Ng (Stanford/Coursera)",
          "Python for Data Science and Machine Learning Bootcamp (Udemy)"
        ]
      },
      {
        title: "Build These Projects",
        description: "Gain practical experience by building these projects.",
        items: [
          "Exploratory data analysis on a public dataset",
          "Predictive model for housing prices or stock market",
          "Customer segmentation using clustering algorithms"
        ]
      },
      {
        title: "Certifications to Pursue",
        description: "Industry-recognized certifications to boost your credibility.",
        items: [
          "IBM Data Science Professional Certificate",
          "Microsoft Certified: Azure Data Scientist Associate",
          "Google Professional Data Engineer"
        ]
      },
      {
        title: "Communities to Join",
        description: "Connect with other professionals in your field.",
        items: [
          "Kaggle",
          "r/datascience on Reddit",
          "Data Science Community on Discord"
        ]
      }
    ]
  },
  "ux-designer": {
    title: "UX Designer",
    steps: [
      {
        title: "Learn Foundational Concepts",
        description: "Master the fundamental principles of UX design.",
        items: [
          "User-centered design principles",
          "Interaction design basics",
          "Information architecture"
        ]
      },
      {
        title: "Recommended Courses",
        description: "Take these courses to build your knowledge base.",
        items: [
          "Google UX Design Professional Certificate (Coursera)",
          "User Experience Design Fundamentals (Udemy)",
          "Interaction Design Foundation courses"
        ]
      },
      {
        title: "Build These Projects",
        description: "Gain practical experience by building these projects.",
        items: [
          "Redesign an existing app or website",
          "Conduct user research and create personas",
          "Design a complete app from scratch with proper user flows"
        ]
      },
      {
        title: "Certifications to Pursue",
        description: "Industry-recognized certifications to boost your credibility.",
        items: [
          "Nielsen Norman Group UX Certification",
          "Certified User Experience Professional (CUXP)",
          "Interaction Design Foundation Certification"
        ]
      },
      {
        title: "Communities to Join",
        description: "Connect with other professionals in your field.",
        items: [
          "Dribbble",
          "UX Design Community on Behance",
          "r/userexperience on Reddit"
        ]
      }
    ]
  }
};

interface RoadmapStep {
  title: string;
  description: string;
  items: string[];
}

interface RoadmapData {
  title: string;
  steps: RoadmapStep[];
}

export default function Roadmap() {
  const { id } = useParams<{ id: string }>();
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { apiKey } = useGeminiContext();
  const { callGemini } = useGemini();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoadmap = async () => {
      setIsLoading(true);
      try {
        // First check if we have a stored roadmap from CareerDesigner
        const storedRoadmap = localStorage.getItem('careerRoadmap');
        
        if (storedRoadmap) {
          try {
            const parsedRoadmap = JSON.parse(storedRoadmap);
            setRoadmapData(parsedRoadmap);
            localStorage.removeItem('careerRoadmap'); // Clear it after use
            setIsLoading(false);
            return;
          } catch (error) {
            console.error("Error parsing stored roadmap:", error);
            // Continue to fallback options if parsing fails
          }
        }
        
        // If no stored roadmap or parsing failed, check if we have API key to generate one
        if (apiKey && id) {
          const careerField = id.replace(/-/g, ' ');
          
          // Generate roadmap with Gemini
          const prompt = `Create a detailed career roadmap for someone who wants to become a ${careerField}.
          
          Include the following sections:
          1. Foundational concepts to learn
          2. Recommended courses or learning resources
          3. Practical projects to build
          4. Certifications to pursue
          5. Professional communities to join
          
          Format the response as a JSON object with this structure:
          {
            "title": "${careerField}",
            "steps": [
              {
                "title": "Step Title",
                "description": "Brief description of the step",
                "items": ["Item 1", "Item 2", "Item 3"]
              }
            ]
          }`;
          
          const geminiResponse = await callGemini(prompt, apiKey);
          
          if (geminiResponse) {
            try {
              const parsedResponse = JSON.parse(geminiResponse);
              setRoadmapData(parsedResponse);
              setIsLoading(false);
              return;
            } catch (error) {
              console.error("Error parsing Gemini response:", error);
              toast({
                title: "Error",
                description: "Failed to parse the roadmap data. Using default data instead.",
                variant: "destructive"
              });
            }
          }
        }
        
        // If all else fails, use the mock data
        setRoadmapData(roadmapMockData[id as keyof typeof roadmapMockData] || roadmapMockData["data-scientist"]);
      } catch (error) {
        console.error("Error fetching roadmap:", error);
        toast({
          title: "Error",
          description: "Failed to load the roadmap. Using default data instead.",
          variant: "destructive"
        });
        setRoadmapData(roadmapMockData[id as keyof typeof roadmapMockData] || roadmapMockData["data-scientist"]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoadmap();
  }, [id, apiKey, callGemini, toast]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="mt-4 text-lg">Generating your personalized career roadmap...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!roadmapData) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Career Roadmap
            </h1>
            <p className="text-muted-foreground">
              We need a Gemini API key to generate your personalized career roadmap
            </p>
          </div>
          
          <GeminiApiKeyInput />
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Your Career Roadmap to {roadmapData.title}
          </h1>
          <p className="text-muted-foreground">
            Follow this step-by-step plan to achieve your career goal.
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute left-9 top-3 bottom-3 w-px bg-border/50" />
          
          <div className="space-y-6">
            {roadmapData.steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="absolute left-0 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-background z-10 text-primary font-bold">
                  {index + 1}
                </div>
                
                <Card className="ml-16">
                  <CardHeader className="pb-2">
                    <CardTitle>{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <Badge variant="outline" className="mr-2 mt-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                            ✓
                          </Badge>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  {index === 1 && ( // Only for courses section
                    <CardFooter>
                      <Button variant="outline" size="sm">
                        Explore All Courses
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Export or Share Your Roadmap</CardTitle>
            <CardDescription>
              Save your roadmap for later reference or share with others.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button>
                Export as PDF
              </Button>
              <Button variant="outline">
                Email This Roadmap
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
