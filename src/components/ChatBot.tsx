import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, Mic, MicOff, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { useEnhancedChatbot } from '@/hooks/useEnhancedChatbot';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  isLoggedIn?: boolean;
  userAccountData?: {
    savings: number;
    goals: any[];
    totalSaved: number;
  };
}

const ChatBot: React.FC<ChatBotProps> = ({ isLoggedIn = false, userAccountData }) => {
  const { t, i18n } = useTranslation();
  const { speak, voiceState, startListening, stopListening } = useVoiceInteraction();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, isLoading } = useEnhancedChatbot(isLoggedIn, userAccountData);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle voice recognition results
  useEffect(() => {
    if (voiceState.transcript && !voiceState.isListening && isListening) {
      setInputMessage(voiceState.transcript);
      setIsListening(false);
      // Auto-send the voice message
      setTimeout(() => {
        handleSendMessage(voiceState.transcript);
      }, 500);
    }
  }, [voiceState.transcript, voiceState.isListening, isListening]);


  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);

    setInputMessage('');
    await sendMessage(textToSend);
    
    // Speak the latest bot response
    setTimeout(() => {
      const lastBotMessage = messages.filter(m => !m.isUser).slice(-1)[0];
      if (lastBotMessage) {
        speak(lastBotMessage.text);
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsListening(true);
    }
  };

  return (
    <>
      {/* Chat Toggle Button - Fixed positioning above voice button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-24 right-6 z-50 rounded-full w-14 h-14 shadow-large",
          "bg-gradient-primary hover:shadow-glow transition-all duration-300",
          isOpen && "scale-95"
        )}
        aria-label={t('chatbot.toggleChat')}
        style={{ zIndex: 9999 }}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <div className="relative">
            <img 
              src="/src/assets/gullak_logo.png" 
              alt="Gullak Assistant" 
              className={cn(
                "h-9 w-9 object-contain transition-transform duration-500",
                "hover:rotate-12"
              )}
              style={{
                animation: isAnimating ? 'none' : 'chatBotPulse 2s ease-in-out infinite'
              }}
            />
            <div className="absolute inset-0 border-2 border-accent/30 rounded-full opacity-30" 
                 style={{
                   animation: 'chatBotPulse 2s ease-in-out infinite reverse'
                 }} 
            />
          </div>
        )}
      </Button>

      {/* Chat Window - Fixed positioning */}
      {isOpen && (
        <Card className={cn(
          "fixed bottom-40 right-6 z-40 w-80 h-96",
          "shadow-large border-0 bg-card/95 backdrop-blur-sm",
          "animate-scale-in"
        )}
        style={{ zIndex: 9998 }}
        >
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="relative">
                 <img 
                   src="/src/assets/gullak_logo.png" 
                   alt="Gullak" 
                   className={cn(
                     "h-10 w-10 object-contain transition-transform duration-1000",
                     isAnimating ? "animate-spin" : "animate-pulse"
                   )}
                 />
              </div>
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {t('chatbot.assistantName')}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                     className={cn(
                       "flex gap-2",
                       !message.isUser ? "justify-start" : "justify-end"
                     )}
                   >
                     {!message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                         <img 
                           src="/src/assets/gullak_logo.png" 
                           alt="Bot" 
                           className="h-6 w-6 object-contain"
                         />
                      </div>
                    )}
                    <div
                       className={cn(
                         "max-w-[70%] p-3 rounded-lg text-sm",
                         !message.isUser
                           ? "bg-muted text-muted-foreground"
                           : "bg-primary text-primary-foreground"
                       )}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chatbot.typePlaceholder')}
                  className="flex-1 transition-smooth"
                />
                <Button
                  onClick={handleVoiceToggle}
                  size="icon"
                  variant={isListening ? "default" : "outline"}
                  className={cn(
                    "transition-smooth",
                    isListening && "bg-red-500 hover:bg-red-600"
                  )}
                  disabled={!voiceState.isSupported}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={() => handleSendMessage()}
                  size="icon"
                  className="bg-gradient-primary hover:shadow-soft"
                  disabled={!inputMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {isListening && (
                <div className="mt-2 text-xs text-center text-muted-foreground">
                  {t('voice.listening')}...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChatBot;