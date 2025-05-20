
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
      
      // Generate AI response with Gemini - more conversational tone
      const prompt = `You're a helpful career mentor named Alex having a casual conversation with a student. 
      
      Respond to this question about career development, job search, skills, or career transitions. Keep your answer:
      - Conversational and friendly (like you're texting a friend)
      - Short and focused (3-4 paragraphs max)
      - Specific and actionable (avoid vague advice)
      - Encouraging but honest
      
      If asked about something unrelated to careers, briefly acknowledge and gently steer back to career topics.
      
      Their message: "${inputMessage}"`;
      
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
          <h1 className="text-3xl font-bold tracking-tight text-white">Career Chat</h1>
          <p className="text-white/70">
            Chat with our AI career assistant for personalized guidance and advice.
          </p>
        </div>
        
        <Card className="flex-1 p-4 overflow-hidden flex flex-col glass-card">
          <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <h3 className="text-lg font-medium text-white">Welcome to Career Chat</h3>
                <p className="text-white/70 mt-2">
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
                        ? "bg-brand-500 text-white"
                        : "bg-white/10 text-white border border-white/10"
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
                <div className="max-w-[80%] space-y-2 bg-white/10 p-4 rounded-lg">
                  <Skeleton className="h-4 w-[250px] bg-white/20" />
                  <Skeleton className="h-4 w-[200px] bg-white/20" />
                  <Skeleton className="h-4 w-[150px] bg-white/20" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/10 pt-4 mt-auto">
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
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button type="submit" size="icon" disabled={isLoading} className="bg-brand-500 hover:bg-brand-600 text-white">
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
