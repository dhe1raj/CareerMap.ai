
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function CareerChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch messages on component mount
  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      
      const formattedMessages: Message[] = data.map(msg => ({
        id: msg.id,
        sender: msg.is_ai ? 'ai' : 'user',
        content: msg.content,
        timestamp: new Date(msg.created_at)
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Save user message to database
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        content: inputMessage,
        is_ai: false
      });
      
      // Simulate AI response (in a real app, this would call an AI service)
      setTimeout(async () => {
        const aiResponse = await generateAIResponse(inputMessage);
        
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          sender: "ai",
          content: aiResponse,
          timestamp: new Date()
        };

        // Save AI message to database
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          content: aiResponse,
          is_ai: true
        });

        setMessages(prevMessages => [...prevMessages, aiMessage]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
      setIsLoading(false);
    }
  };

  // For demo purposes - generates a simple AI response
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // In a real app, this would call an AI service API
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes("skill") || lowerMsg.includes("learn")) {
      return "Based on your interests, you might want to focus on learning JavaScript, Python, or UX design. These skills are highly in demand in the current job market.";
    } else if (lowerMsg.includes("job") || lowerMsg.includes("career")) {
      return "There are several career paths that might be a good fit for you, such as Software Developer, Data Analyst, or UX Designer. Would you like me to give you more information about any of these roles?";
    } else if (lowerMsg.includes("interview") || lowerMsg.includes("resume")) {
      return "For interview preparation, I recommend focusing on your strengths and preparing stories about your achievements. For your resume, highlight your technical skills and projects that demonstrate your abilities.";
    } else {
      return "I'm your career assistant. I can help you explore career options, develop skills, prepare for interviews, or create a career roadmap. What specific area would you like help with today?";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Career Chat</h1>
          <p className="text-muted-foreground">
            Chat with our AI career assistant for personalized guidance and advice.
          </p>
        </div>
        
        <Card className="flex-1 p-4 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <h3 className="text-lg font-medium">Welcome to Career Chat</h3>
                <p className="text-muted-foreground mt-2">
                  Ask me anything about career paths, skills to learn, or job market trends.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t pt-4 mt-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex space-x-2"
            >
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
