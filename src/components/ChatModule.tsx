import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";

const translations = {
  english: {
    title: "AI Assistant",
    connected: "Connected",
    offline: "Offline Mode",
    typing: "AI is typing...",
    clearChat: "Clear Chat",
    textInput: "Type your message...",
  },
  hindi: {
    title: "एआई सहायक",
    connected: "कनेक्टेड",
    offline: "ऑफ़लाइन मोड",
    typing: "AI टाइप कर रहा है...",
    clearChat: "चैट साफ़ करें",
    textInput: "अपना संदेश टाइप करें...",
  },
};

const suggestions = {
  english: [
    "What's the best time to plant wheat?",
    "How can I identify tomato diseases?",
    "What are today's onion prices?",
  ],
  hindi: [
    "गेहूं बोने का सबसे अच्छा समय क्या है?",
    "टमाटर की बीमारियों की पहचान कैसे करें?",
    "आज प्याज के दाम क्या हैं?",
  ],
};

// ✅ Mock answers for suggestions
const mockAnswers: Record<string, string> = {
  "what's the best time to plant wheat?":
    "🌾 The best time to plant wheat in India is **October to December**, depending on your region. Northern plains usually sow wheat in **mid-November**.",
  "how can i identify tomato diseases?":
    "🍅 Common tomato diseases include:\n\n- **Early Blight** → brown spots on older leaves.\n- **Late Blight** → dark lesions on stems and fruits.\n- **Leaf Curl Virus** → curled, yellow leaves.\n\nYou can control them using proper crop rotation and fungicide sprays.",
  "what are today's onion prices?":
    "🧅 As of now, the **average onion price** in major Indian markets is around **₹25–₹35 per kg**, but it may vary by location.",
};

export function ChatModule({ language }: { language: "english" | "hindi" }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const t = translations[language];

  // Initial welcome message
  useEffect(() => {
    const welcome = {
      id: Date.now(),
      type: "bot",
      content:
        language === "hindi"
          ? "🙏 नमस्ते! मैं आपका FarmWise AI सहायक हूं। मुझसे कुछ भी पूछें!"
          : "👋 Hello! I'm your FarmWise AI assistant. Ask me anything!",
      timestamp: new Date().toISOString(),
    };
    setMessages([welcome]);
  }, [language]);

  // Auto-scroll
  useEffect(() => {
    const scrollEl =
      scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]");
    if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
  }, [messages]);

  // Text-to-speech
  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = language === "hindi" ? "hi-IN" : "en-US";
      window.speechSynthesis.speak(u);
    }
  };

  // ✅ Send message (with mock answer support)
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    const lowerMsg = inputMessage.trim().toLowerCase();

    // ✅ Check if it matches mock question
    if (mockAnswers[lowerMsg]) {
      setTimeout(() => {
        const botMsg = {
          id: Date.now() + 1,
          type: "bot",
          content: mockAnswers[lowerMsg],
          timestamp: new Date().toISOString(),
        };
        setMessages((m) => [...m, botMsg]);
        if (isListening) speakMessage(botMsg.content);
        setIsTyping(false);
      }, 800);
      return;
    }

    // ✅ Otherwise call Supabase Gemini Function
    try {
      const res = await fetch(
        "https://wnvuczpskvdwywtoqsaf.supabase.co/functions/v1/gemini-chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg.content }),
        }
      );

      const data = await res.json();
      console.log("Gemini Response:", data);

      const reply =
        data.reply ||
        data.output ||
        "⚠️ Sorry, I couldn’t generate a reply right now. Try again.";

      const botMsg = {
        id: Date.now() + 1,
        type: "bot",
        content: reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((m) => [...m, botMsg]);
      setIsConnected(true);
      if (isListening) speakMessage(botMsg.content);
    } catch (err) {
      console.error(err);
      setIsConnected(false);
      const botMsg = {
        id: Date.now() + 1,
        type: "bot",
        content:
          language === "hindi"
            ? "📡 नेटवर्क त्रुटि — कृपया दोबारा प्रयास करें।"
            : "📡 Network issue — please try again later.",
        timestamp: new Date().toISOString(),
        isOffline: true,
      };
      setMessages((m) => [...m, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    const welcome = {
      id: Date.now(),
      type: "bot",
      content:
        language === "hindi"
          ? "🔄 चैट साफ़ कर दी गई!"
          : "🔄 Chat cleared successfully!",
      timestamp: new Date().toISOString(),
    };
    setMessages([welcome]);
  };

  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center items-center mb-3">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-2xl mr-3">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{t.title}</h2>
        </div>
      </div>

      {/* Status Bar */}
      <Card className="shadow-lg border border-gray-300">
        <CardContent className="flex justify-between items-center p-3">
          <Badge
            className={`${
              isConnected
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            } px-3 py-1 rounded-full`}
          >
            <div className="flex gap-2 items-center">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-600" : "bg-yellow-500"
                } animate-pulse`}
              ></div>
              {isConnected ? t.connected : t.offline}
            </div>
          </Badge>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setIsListening(!isListening);
                if (!isListening)
                  toast.success("🔊 Text-to-speech enabled");
                else window.speechSynthesis.cancel();
              }}
              className={`rounded-xl ${
                isListening
                  ? "bg-purple-600 text-white"
                  : "border border-gray-300"
              }`}
            >
              {isListening ? <Volume2 /> : <VolumeX />}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={clearChat}
              className="border-2 hover:bg-gray-100"
            >
              <RefreshCw />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Box */}
      <Card className="h-[550px] flex flex-col border shadow-xl">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <MessageCircle /> FarmWise AI Chat
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden bg-white p-0">
          <ScrollArea ref={scrollAreaRef} className="h-full p-4">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[80%] shadow ${
                      msg.type === "user"
                        ? "bg-purple-600 text-white"
                        : msg.isOffline
                        ? "bg-yellow-100 border border-yellow-300 text-gray-800"
                        : "bg-gray-50 border border-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                    <p className="text-[10px] mt-1 opacity-60 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="text-center text-gray-400 text-sm">
                  {t.typing}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Input */}
        <div className="border-t p-3 bg-gray-50 flex gap-2">
          <Input
            placeholder={t.textInput}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button
            onClick={sendMessage}
            className="bg-purple-600 text-white hover:bg-purple-700 rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-2">
        {suggestions[language].map((s, i) => (
          <Button
            key={i}
            size="sm"
            variant="outline"
            onClick={() => setInputMessage(s)}
            className="rounded-xl border-gray-300 hover:bg-gray-100"
          >
            {s}
          </Button>
        ))}
      </div>
    </div>
  );
}
