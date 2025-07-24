import { useState, useCallback } from 'react';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface UserAccountData {
  savings: number;
  goals: any[];
  totalSaved: number;
}

export const useEnhancedChatbot = (isLoggedIn: boolean, userAccountData?: UserAccountData) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: isLoggedIn 
        ? `Hello! I'm your Gullak assistant. I can help you with investment advice, savings strategies, and answer your banking questions. Your current savings: ₹${userAccountData?.savings.toLocaleString() || '0'}`
        : "Hello! I'm your Gullak assistant. I can help you with general banking questions, savings tips, and guide you through our features. Please login for personalized advice.",
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const getAIResponse = useCallback(async (userMessage: string): Promise<string> => {
    const systemPrompt = isLoggedIn
      ? `You are Gullak, a friendly Indian banking and investment assistant. The user is logged in with ₹${userAccountData?.savings.toLocaleString()} in savings and ${userAccountData?.goals.length || 0} active goals. Provide personalized investment advice, savings strategies, and banking guidance in Indian context. Keep responses concise and helpful. Focus on Indian investment options like PPF, ELSS, SIP, FD, NSC, and government schemes.`
      : `You are Gullak, a friendly Indian banking assistant. The user is not logged in. Provide general banking guidance, savings tips, and information about Gullak's features. Keep responses concise and encourage them to sign up for personalized advice. Focus on Indian banking context.`;

    // Simple response system (in a real app, you'd integrate with OpenAI or similar)
    const responses = {
      // Investment related
      investment: [
        "For your savings amount, I'd recommend a diversified approach: 60% in equity mutual funds (SIP), 20% in PPF for tax benefits, and 20% in liquid funds for emergency. This gives you growth potential with safety.",
        "Consider ELSS mutual funds for tax saving under 80C, PPF for long-term wealth creation, and some gold ETFs for portfolio diversification. Start with small SIPs and increase gradually.",
        "Based on Indian market conditions, equity mutual funds through SIP are excellent for long-term wealth creation. Also explore government schemes like PPF and NSC for stable returns."
      ],
      
      // Savings related
      saving: [
        "Great question! Try the 50-30-20 rule: 50% for needs, 30% for wants, 20% for savings. Start with automating your savings through SIPs and use our goal-based saving feature.",
        "Build an emergency fund worth 6 months of expenses first, then focus on goal-based savings. Use our round-up feature while shopping to save effortlessly.",
        "Set up automatic transfers to savings on salary day. Create specific goals in the app and track your progress. Even ₹500/month can grow significantly over time!"
      ],
      
      // Banking related
      banking: [
        "Indian banks offer various savings products: Fixed Deposits for guaranteed returns, Recurring Deposits for systematic saving, and Sweep-in accounts for better interest rates.",
        "For banking services, consider features like UPI, mobile banking, and doorstep banking. Compare interest rates and maintain minimum balance to avoid charges.",
        "Use UPI for instant transfers, set up standing instructions for regular payments, and explore bank-specific savings schemes like sweep accounts for better returns."
      ],
      
      // General/default
      general: [
        isLoggedIn 
          ? `With ₹${userAccountData?.savings.toLocaleString()} in savings, you're doing great! Consider diversifying into mutual funds, PPF, or FDs based on your risk appetite. What's your investment goal?`
          : "I can help you with savings strategies, investment options, and banking queries. Sign up for personalized advice based on your financial goals!",
        isLoggedIn
          ? "Based on your savings pattern, I suggest exploring SIP investments for long-term growth. Would you like me to explain different mutual fund categories suitable for Indian investors?"
          : "Gullak offers goal-based savings, investment guidance, and smart money management tools. Create an account to get started with your financial journey!"
      ]
    };

    const message = userMessage.toLowerCase();
    
    if (message.includes('invest') || message.includes('mutual fund') || message.includes('sip') || message.includes('ppf') || message.includes('elss')) {
      return responses.investment[Math.floor(Math.random() * responses.investment.length)];
    } else if (message.includes('save') || message.includes('saving') || message.includes('goal') || message.includes('money')) {
      return responses.saving[Math.floor(Math.random() * responses.saving.length)];
    } else if (message.includes('bank') || message.includes('account') || message.includes('upi') || message.includes('transfer')) {
      return responses.banking[Math.floor(Math.random() * responses.banking.length)];
    } else {
      return responses.general[Math.floor(Math.random() * responses.general.length)];
    }
  }, [isLoggedIn, userAccountData]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(text);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [getAIResponse]);

  return {
    messages,
    sendMessage,
    isLoading
  };
};