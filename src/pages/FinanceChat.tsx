
import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, IndianRupee, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const FinanceChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your financial assistant. You can ask me about maintenance dues, payments, or any other financial matters regarding SukritiHub Whitefield.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const response = generateAIResponse(input.trim().toLowerCase());
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (query: string): string => {
    // Mock AI response logic based on financial keywords
    if (query.includes("maintenance") || query.includes("dues")) {
      return "The maintenance dues for this month are ₹5,500 and are due by the 10th. You can pay via UPI or bank transfer. Would you like payment details?";
    } else if (query.includes("payment") || query.includes("paid")) {
      return "Your last payment of ₹5,500 was received on May 5th, 2023. Your account is currently up to date with no pending dues.";
    } else if (query.includes("pending") || query.includes("outstanding")) {
      return "You have no outstanding dues currently. Your maintenance fees are paid until June 2023.";
    } else if (query.includes("sinking fund") || query.includes("reserve")) {
      return "The society's sinking fund currently has a balance of ₹24,75,000. The last contribution was made in April 2023.";
    } else if (query.includes("receipt") || query.includes("invoice")) {
      return "Your maintenance receipt for May 2023 has been sent to your registered email. Would you like me to resend it?";
    } else if (query.includes("increase") || query.includes("hike")) {
      return "The maintenance fees are scheduled to be reviewed in the upcoming GBM in July 2023. Any changes will be effective from August 2023.";
    } else if (query.includes("budget") || query.includes("expense")) {
      return "The association's monthly operating budget is ₹4,50,000, which includes security, maintenance, gardening, and administrative expenses. The detailed breakdown is available in the monthly report.";
    } else if (query.includes("water") || query.includes("electricity")) {
      return "Water charges are ₹1,200 per month and electricity for common areas is approximately ₹85,000 per month, included in your maintenance fees.";
    } else if (query.includes("late") || query.includes("penalty")) {
      return "Late payment penalties are 2% per month on outstanding dues, applicable after the 15th of every month.";
    } else if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
      return "Hello! I'm your financial assistant for SukritiHub Whitefield. How can I help you with your financial queries today?";
    } else {
      return "I'm not sure I understand your query about finances. Could you please rephrase or ask about maintenance dues, payments, receipts, or the society's financial status?";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-medium">Financial Assistant</h1>
          <Button
            variant="outline"
            onClick={() => {
              setMessages([
                {
                  id: "reset",
                  role: "assistant",
                  content: "How can I help you with your financial queries today?",
                  timestamp: new Date(),
                },
              ]);
              toast({
                title: "Chat reset",
                description: "Your conversation has been reset.",
              });
            }}
          >
            Reset Chat
          </Button>
        </div>
        
        <Card className="flex-1 mb-4 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-240px)]" ref={scrollAreaRef}>
            <CardContent className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex space-x-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary/10 text-foreground"
                        : "bg-secondary text-secondary-foreground"
                    } p-3 rounded-lg`}
                  >
                    <div className="mt-1">
                      {message.role === "user" ? (
                        <User size={18} className="text-primary" />
                      ) : (
                        <Bot size={18} className="text-primary" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary p-3 rounded-lg flex items-center space-x-2">
                    <Bot size={18} className="text-primary" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
        
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about maintenance dues, payments, or receipts..."
              className="pr-10"
              disabled={isLoading}
            />
            {input.includes("payment") && (
              <IndianRupee 
                size={16} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
            )}
          </div>
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isLoading}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default FinanceChat;
