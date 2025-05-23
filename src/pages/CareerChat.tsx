
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
      } else {
        // Add fallback response if AI fails
        const fallbackMessage: Message = {
          id: crypto.randomUUID(),
          sender: "ai",
          content: "I'm having trouble processing your request right now. Could you try asking your question differently, or try again later?",
          timestamp: new Date()
        };
        
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          content: fallbackMessage.content,
          is_ai: true
        });
        
        setMessages(prevMessages => [...prevMessages, fallbackMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
        className: "bg-red-500/10 border-red-500/20 backdrop-blur-md"
      });
      
      // Add fallback response if error occurs
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        content: "Sorry, I encountered an error while processing your message. Please try again later.",
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white neon-purple-text">Career Chat</h1>
          <p className="text-white/70">
            Chat with our AI career assistant for personalized guidance and advice.
          </p>
        </div>
        
        <Card className="flex-1 p-4 overflow-hidden flex flex-col glass-card border-white/10">
          <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-2 scrollbar-thin">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="bg-brand-400/10 p-6 rounded-full mb-4 backdrop-blur-md box-glow">
                  <svg className="w-10 h-10 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white text-glow-sm">Welcome to Career Chat</h3>
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
                        ? "bg-gradient-to-r from-brand-400/80 to-brand-500/80 backdrop-blur-md text-white"
                        : "futuristic-glass text-white"
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
                <div className="max-w-[80%] space-y-2 futuristic-glass p-4 rounded-lg">
                  <Skeleton className="h-4 w-[250px] bg-white/10" />
                  <Skeleton className="h-4 w-[200px] bg-white/10" />
                  <Skeleton className="h-4 w-[150px] bg-white/10" />
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
                className="flex-1 glass-input"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading} 
                variant="neon"
              >
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
