
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Example prompts
const examplePrompts = [
  "What's a good roadmap for becoming a Data Scientist?",
  "How do I transition from frontend to ML?",
  "What skills should I focus on for UX design?",
  "Which certifications are most valuable for cybersecurity?",
  "How can I prepare for a technical interview?"
];

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function CareerChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I'm your Career Assistant. How can I help with your career questions today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (text?: string) => {
    const messageText = text || input;
    
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: messageText,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (in a real app, this would call a backend API)
    setTimeout(() => {
      let responseText = "";
      
      if (messageText.toLowerCase().includes("data scientist")) {
        responseText = "To become a Data Scientist, focus on these areas: 1) Statistics and Mathematics, 2) Programming (Python, R), 3) Data Wrangling & SQL, 4) Machine Learning fundamentals, 5) Data Visualization. Start with online courses like Andrew Ng's Machine Learning course on Coursera or fast.ai, then build projects to demonstrate your skills.";
      } else if (messageText.toLowerCase().includes("frontend to ml")) {
        responseText = "Transitioning from Frontend to ML is a great career move! Start by leveraging your JavaScript knowledge with libraries like Tensorflow.js. Then build a foundation in Python, statistics, and machine learning fundamentals. Consider taking structured courses like Fast.ai or deeplearning.ai. Create projects that bridge web development and ML to showcase your unique skillset.";
      } else if (messageText.toLowerCase().includes("ux design")) {
        responseText = "For UX design, key skills to develop include: user research, wireframing, prototyping, visual design fundamentals, and user testing methodologies. Tools like Figma, Adobe XD, and Sketch are important. Also build empathy, critical thinking, and communication skills to effectively translate user needs into design solutions.";
      } else {
        responseText = "That's a great question! To give you the best guidance on this topic, I'd recommend exploring resources like industry blogs, courses on platforms like Coursera or Udemy, and joining professional communities in your field of interest. Would you like more specific recommendations about a particular aspect?";
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleExamplePrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Career Chat AI</h1>
          <p className="text-muted-foreground">
            Ask questions about career paths, skills, and job market trends
          </p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle>Career Assistant</CardTitle>
            <CardDescription>
              Ask me anything about career planning and development
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        {message.sender === "ai" ? (
                          <>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>JD</AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-3 bg-muted">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                          <div
                            className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <div
                            className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-4 bg-muted/50">
            <p className="text-xs text-muted-foreground mb-2">Try asking about:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {examplePrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleExamplePrompt(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
          <CardFooter className="pt-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center w-full space-x-2"
            >
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                Send
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
