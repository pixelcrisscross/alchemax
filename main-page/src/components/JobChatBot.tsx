import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ==========================================
// 🔑 CONFIG: YOUR GEMINI API KEY
// ==========================================
const GEN_AI_KEY = "AIzaSyCuVmJQUcLrJzeRluBeuanoBQkTJXTUJnI"; 

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(GEN_AI_KEY);

// ⚠️ FIX: Using 'gemini-1.5-flash' which is the current standard free model.
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface JobChatBotProps {
  userSkills?: string[];
}

export const JobChatBot = ({ userSkills = [] }: JobChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your job discovery assistant. I can help you find jobs that match your skills. Ask me anything!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            if (scrollAreaRef.current) {
                const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
                if (scrollContainer) {
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }
            }
        }, 100);
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input; 
    setInput("");
    setIsLoading(true);

    try {
      const skillsContext = userSkills && userSkills.length > 0 
        ? `User Skills: ${userSkills.join(', ')}.` 
        : "";

      const prompt = `
      Act as "Community Connect AI", a helpful career assistant.
      Context: ${skillsContext}
      User Question: "${currentInput}"
      
      Provide a helpful, concise (2-3 sentences) response.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [...prev, { role: "assistant", content: text }]);

    } catch (error: any) {
      console.error("Chat error:", error);
      
      let errorMessage = "I'm having trouble connecting. Please try again.";
      
      if (error.message?.includes("404")) {
          errorMessage = "Error: Model 'gemini-1.5-flash' not found. Please check if your API Key is valid and has the 'Generative Language API' enabled in Google Cloud Console.";
      } else if (error.message?.includes("400")) {
          errorMessage = "Error: Invalid Request. Please check your API Key.";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: errorMessage }]);
      
      toast({
        title: "AI Error",
        description: "Failed to connect to Gemini API.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform bg-primary text-primary-foreground z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] flex flex-col shadow-2xl z-50 animate-in slide-in-from-bottom-10 duration-300 border-2 border-primary/10 bg-background">
          <div className="flex items-center justify-between p-4 border-b bg-primary/5">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                  <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Job Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4 pr-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-4"
                        : "bg-muted text-foreground mr-4"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about jobs..."
                disabled={isLoading}
                className="flex-1 focus-visible:ring-primary"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};