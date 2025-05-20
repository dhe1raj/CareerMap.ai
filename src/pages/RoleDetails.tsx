
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

// Mock data for the role
const roleMockData = {
  "cybersecurity-analyst": {
    title: "Cybersecurity Analyst",
    summary: "Cybersecurity Analysts are responsible for protecting an organization's computer systems and networks from cyber threats. They monitor systems for breaches, investigate incidents, and implement security measures to protect sensitive information and digital infrastructure.",
    skills: ["Network Security", "Threat Analysis", "Security Tools", "Vulnerability Assessment", "Incident Response", "SIEM Tools", "Firewall Management", "Risk Assessment"],
    tools: ["Wireshark", "Metasploit", "Nessus", "Splunk", "Burp Suite", "Kali Linux"],
    averageSalary: {
      us: "$95,000",
      eu: "€75,000",
      asia: "¥650,000"
    },
    demandData: [
      { month: "Jan", demand: 65 },
      { month: "Feb", demand: 70 },
      { month: "Mar", demand: 75 },
      { month: "Apr", demand: 72 },
      { month: "May", demand: 78 },
      { month: "Jun", demand: 85 },
      { month: "Jul", demand: 89 },
      { month: "Aug", demand: 92 },
      { month: "Sep", demand: 90 },
      { month: "Oct", demand: 94 },
      { month: "Nov", demand: 98 },
      { month: "Dec", demand: 100 }
    ]
  },
  "data-scientist": {
    title: "Data Scientist",
    summary: "Data Scientists analyze and interpret complex data to help organizations make better decisions. They use advanced analytics, machine learning, and statistical methods to extract insights and develop predictive models from large datasets.",
    skills: ["Python", "R", "SQL", "Machine Learning", "Statistical Analysis", "Data Visualization", "Big Data Tools", "Deep Learning"],
    tools: ["Jupyter", "TensorFlow", "PyTorch", "Tableau", "Power BI", "Hadoop"],
    averageSalary: {
      us: "$120,000",
      eu: "€85,000",
      asia: "¥800,000"
    },
    demandData: [
      { month: "Jan", demand: 80 },
      { month: "Feb", demand: 82 },
      { month: "Mar", demand: 85 },
      { month: "Apr", demand: 88 },
      { month: "May", demand: 90 },
      { month: "Jun", demand: 92 },
      { month: "Jul", demand: 95 },
      { month: "Aug", demand: 98 },
      { month: "Sep", demand: 100 },
      { month: "Oct", demand: 98 },
      { month: "Nov", demand: 99 },
      { month: "Dec", demand: 100 }
    ]
  },
  "ux-designer": {
    title: "UX Designer",
    summary: "UX Designers focus on creating meaningful and relevant experiences for users. They research, prototype, and design digital products, ensuring they are intuitive, accessible, and provide value to both users and businesses.",
    skills: ["User Research", "Wireframing", "Prototyping", "Usability Testing", "Information Architecture", "Visual Design", "Interaction Design", "Design Thinking"],
    tools: ["Figma", "Adobe XD", "Sketch", "InVision", "Axure", "Miro"],
    averageSalary: {
      us: "$90,000",
      eu: "€65,000",
      asia: "¥600,000"
    },
    demandData: [
      { month: "Jan", demand: 75 },
      { month: "Feb", demand: 78 },
      { month: "Mar", demand: 80 },
      { month: "Apr", demand: 82 },
      { month: "May", demand: 85 },
      { month: "Jun", demand: 88 },
      { month: "Jul", demand: 90 },
      { month: "Aug", demand: 92 },
      { month: "Sep", demand: 95 },
      { month: "Oct", demand: 97 },
      { month: "Nov", demand: 98 },
      { month: "Dec", demand: 100 }
    ]
  }
};

export default function RoleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [region, setRegion] = useState("us");
  
  // In a real app, we would fetch the role data based on the ID
  // For now, we'll use the mock data
  const roleData = roleMockData[id as keyof typeof roleMockData] || roleMockData["data-scientist"];
  
  const handleGenerateRoadmap = () => {
    // Navigate to the roadmap page for this role
    navigate(`/roadmap/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{roleData.title}</h1>
          <p className="text-muted-foreground">
            Detailed information about the role and requirements.
          </p>
        </div>
        
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle>Role Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {roleData.summary}
            </p>
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
              <CardDescription>Key skills needed for this role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {roleData.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-sm py-1 px-2">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tools & Technologies</CardTitle>
              <CardDescription>Common tools used in this role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {roleData.tools.map((tool, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1 px-2">
                    {tool}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Average Salary</CardTitle>
            <CardDescription>Estimated annual salary based on region</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="us" onValueChange={setRegion}>
              <TabsList className="mb-4">
                <TabsTrigger value="us">United States</TabsTrigger>
                <TabsTrigger value="eu">Europe</TabsTrigger>
                <TabsTrigger value="asia">Asia</TabsTrigger>
              </TabsList>
              <div className="text-3xl font-bold text-primary">
                {roleData.averageSalary[region as keyof typeof roleData.averageSalary]}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Salary ranges may vary based on experience, location, and company size.
              </p>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Job Demand Trend</CardTitle>
            <CardDescription>Market demand over the past 12 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roleData.demandData}>
                <defs>
                  <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="demand" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#demandGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Ready to Start Your Journey?</CardTitle>
            <CardDescription>
              Generate a personalized roadmap to become a {roleData.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get a step-by-step plan including courses, projects, certifications, and more.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={handleGenerateRoadmap}
            >
              Generate My Roadmap
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
