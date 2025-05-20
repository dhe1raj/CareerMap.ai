
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface NavCardProps {
  title: string;
  description: string;
  content: string;
  path: string;
  buttonText: string;
  icon: ReactNode;
}

export function NavCard({ 
  title, 
  description, 
  content,
  path,
  buttonText,
  icon
}: NavCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="glass-morphism card-hover">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-white/70">{content}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate(path)}
          className="w-full"
          variant="outline"
        >
          {icon}
          {buttonText}
          <ChevronRight className="ml-auto h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
