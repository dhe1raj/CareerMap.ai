
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock career matches data
const careerMatches = [
  {
    title: "Frontend Developer",
    matchPercentage: 95,
    description: "Frontend developers build the user interfaces for websites and applications. They implement visual elements that users see and interact with in a web application.",
    skills: ["HTML", "CSS", "JavaScript", "React", "UI/UX"],
    averageSalary: "$85,000 - $120,000",
    growth: "High growth (17% annually)",
  },
  {
    title: "UX Designer",
    matchPercentage: 82,
    description: "UX designers focus on creating user-friendly interfaces that provide a positive experience for users. They conduct research, create wireframes, and prototype designs.",
    skills: ["User Research", "Wireframing", "Prototyping", "Information Architecture", "Visual Design"],
    averageSalary: "$75,000 - $110,000",
    growth: "Above average growth (8% annually)",
  },
  {
    title: "Product Manager",
    matchPercentage: 78,
    description: "Product managers guide the development and launch of products, determining strategy, features, and roadmaps based on market research and user needs.",
    skills: ["Strategy", "User Stories", "Market Research", "Prioritization", "Communication"],
    averageSalary: "$90,000 - $140,000", 
    growth: "Strong growth (10% annually)",
  }
];

export default function CareerMatches() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Career Matches</h1>
          <p className="text-muted-foreground">
            Based on your answers, here are your top career matches
          </p>
        </div>

        <div className="space-y-6">
          {careerMatches.map((career, index) => (
            <Card key={index} className={index === 0 ? "border-primary" : ""}>
              {index === 0 && (
                <div className="bg-primary text-primary-foreground py-1 px-4 text-sm font-medium text-center">
                  Top Match
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{career.title}</CardTitle>
                    <CardDescription>Match: {career.matchPercentage}%</CardDescription>
                  </div>
                  <Badge variant={index === 0 ? "default" : "outline"} className={index === 0 ? "bg-primary" : ""}>
                    {career.matchPercentage}% Match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Overview</h3>
                  <p className="text-sm text-muted-foreground">{career.description}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Key Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {career.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-1">Salary Range</h3>
                    <p className="text-sm">{career.averageSalary}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Growth Outlook</h3>
                    <p className="text-sm">{career.growth}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate(`/career/${career.title.toLowerCase().replace(/\s+/g, '-')}`)}
                  className={index === 0 ? "bg-primary hover:bg-primary/90" : ""}
                >
                  View Career Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
