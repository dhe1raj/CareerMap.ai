
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserData } from "@/hooks/use-user-data";

interface CareerChatProps {
  userData: UserData;
  onUpdateField: (path: string, value: any) => void;
}

export function CareerChat({ userData, onUpdateField }: CareerChatProps) {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  
  const handleStartChat = async () => {
    setIsCreating(true);
    
    try {
      if (userData.chat.latestThreadId) {
        // Navigate to existing thread
        navigate(`/career-chat/${userData.chat.latestThreadId}`);
      } else {
        // Create a new thread ID (simulated)
        const newThreadId = `thread_${Date.now()}`;
        onUpdateField('chat.latestThreadId', newThreadId);
        navigate('/career-chat');
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <Card className="glass-morphism shadow-[0_0_15px_rgba(168,85,247,0.2)]">
      <CardHeader>
        <CardTitle className="text-gradient">Career Chat</CardTitle>
        <CardDescription>Get answers to your career questions</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-4">
        <div className="flex flex-col items-center">
          <MessageSquare className="h-12 w-12 mb-4 text-brand-400 opacity-80" />
          <p className="text-sm text-white/70 max-w-xs mx-auto">
            Chat with our AI career coach to get personalized advice and answers to your questions.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={handleStartChat} 
          className="w-full"
          disabled={isCreating}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Start Chatting
        </Button>
      </CardFooter>
    </Card>
  );
}
