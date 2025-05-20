
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useGeminiContext } from "@/context/GeminiContext";
import { useGemini } from "@/lib/gemini";

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
  const { apiKey } = useGeminiContext();
  const { callGemini } = useGemini();

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
      
      // Generate AI response with Gemini
      const prompt = `You are CareerForge AI — a helpful career advisor specializing in career guidance. 
      
      Answer the following question about careers, job search, skill development, or career transition. 
      Provide practical, actionable advice. If you're asked about something unrelated to careers, politely redirect the conversation to career topics.
      
      User question: ${inputMessage}`;
      
      const aiResponse = await callGemini(prompt, apiKey);
      
      if (aiResponse) {
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
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
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
                    <div className="whitespace-pre-wrap">
                      {message.content}
                    </div>
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
