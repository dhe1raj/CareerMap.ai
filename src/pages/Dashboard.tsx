
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, John!</h1>
          <p className="text-muted-foreground">
            Here's an overview of your career journey progress.
          </p>
        </div>

        <Card className="bg-brand-100 border-brand-300">
          <CardHeader>
            <CardTitle>Start Your Career Journey Today</CardTitle>
            <CardDescription>
              Take our questionnaire to discover your ideal career path.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="bg-brand-500 hover:bg-brand-600"
              onClick={() => navigate("/career-designer")}
            >
              Design My Career
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Your Progress</CardTitle>
              <CardDescription>Career path completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Career Suggestions</CardTitle>
              <CardDescription>Based on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                <Button variant="outline" className="w-full justify-start text-left" asChild>
                  <div>
                    <p>Frontend Developer</p>
                    <p className="text-xs text-muted-foreground">85% match</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left" asChild>
                  <div>
                    <p>UX Designer</p>
                    <p className="text-xs text-muted-foreground">78% match</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Career Chat</CardTitle>
              <CardDescription>Ask our AI assistant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Need guidance on your next career step?
              </p>
              <Button onClick={() => navigate("/career-chat")}>
                Start Chatting
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Roadmap</CardTitle>
            <CardDescription>
              Your personalized learning path
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Roadmap would be populated after career design */}
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                You haven't created a roadmap yet. Complete the career designer questionnaire to generate your roadmap.
              </p>
              <Button 
                className="mt-4"
                variant="outline"
                onClick={() => navigate("/career-designer")}
              >
                Design My Career
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
