import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Target, 
  Calculator,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import LanguageSelector from '@/components/LanguageSelector';
import ChatBot from '@/components/ChatBot';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { useToast } from '@/hooks/use-toast';

interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
}

const SavingsShoppingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { speak } = useVoiceInteraction();
  const { toast } = useToast();

  const [amount, setAmount] = useState<string>('');
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [roundUpAmount, setRoundUpAmount] = useState<number>(0);
  const [roundUpOption, setRoundUpOption] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock goals data - in real app, this would come from state management
  const [goals] = useState<SavingsGoal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      target: 50000,
      current: 15750,
      deadline: '2024-12-31',
      category: 'emergency'
    },
    {
      id: '2',
      name: 'Vacation to Goa',
      target: 25000,
      current: 8500,
      deadline: '2024-10-15',
      category: 'vacation'
    },
    {
      id: '3',
      name: 'New Laptop',
      target: 75000,
      current: 22000,
      deadline: '2024-11-30',
      category: 'gadget'
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      speak('Savings via Shopping screen. Enter your shopping amount and select a goal to add the rounded up amount.');
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak]);

  const handleVoiceCommand = (command: string, transcript: string) => {
    // Check for amount in voice command
    const amountMatch = transcript.match(/(\d+)/);
    if (amountMatch && command === 'ADD_MONEY') {
      setAmount(amountMatch[1]);
      speak(`Shopping amount set to ${amountMatch[1]} rupees.`);
      return;
    }

    switch (command) {
      case 'GO_BACK':
      case 'GO_DASHBOARD':
        navigate('/dashboard');
        break;
      case 'SHOW_HELP':
        speak('Enter your shopping amount, select a savings goal, and the rounded up amount will be added to your goal.');
        break;
      default:
        speak(`Sorry, I didn't understand: ${transcript}`);
    }
  };

  // Calculate round up amount when amount or option changes
  useEffect(() => {
    if (amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        const remainder = numAmount % roundUpOption;
        const roundUp = remainder === 0 ? 0 : roundUpOption - remainder;
        setRoundUpAmount(roundUp);
      }
    } else {
      setRoundUpAmount(0);
    }
  }, [amount, roundUpOption]);

  const handleSavingsSubmit = async () => {
    if (!amount || !selectedGoal || roundUpAmount === 0) {
      toast({
        title: "Error",
        description: "Please enter amount and select a goal",
        variant: "destructive"
      });
      speak("Please enter shopping amount and select a goal");
      return;
    }

    setIsProcessing(true);
    speak(`Adding ₹${roundUpAmount} to your selected goal...`);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      const selectedGoalName = goals.find(g => g.id === selectedGoal)?.name;
      speak(`Successfully added ₹${roundUpAmount} to your ${selectedGoalName} goal!`);
      
      toast({
        title: "Savings Added!",
        description: `₹${roundUpAmount} has been added to your ${selectedGoalName} goal`,
      });

      // Reset form
      setAmount('');
      setSelectedGoal('');
      setRoundUpAmount(0);
    }, 2000);
  };

  const roundUpOptions = [100, 500, 1000];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-soft">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Savings via Shopping</h1>
                <p className="text-primary-foreground/80 text-sm">Round up your purchases and save</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <LanguageSelector variant="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shopping Amount Input */}
          <Card className="savings-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Shopping Amount</span>
              </CardTitle>
              <CardDescription>
                Enter the amount you spent on shopping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="amount" className="sr-only">Shopping Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-lg text-muted-foreground">₹</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 text-lg h-12 transition-smooth"
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Round Up Options */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Round up to nearest:</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roundUpOptions.map((option) => (
                    <Button
                      key={option}
                      variant={roundUpOption === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRoundUpOption(option)}
                      className="transition-smooth"
                    >
                      ₹{option}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Round Up Calculation */}
              {amount && roundUpAmount > 0 && (
                <div className="bg-accent rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Shopping Amount:</span>
                    <span className="text-sm">₹{parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Round up to:</span>
                    <span className="text-sm">₹{Math.ceil(parseFloat(amount) / roundUpOption) * roundUpOption}</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="font-medium text-primary">Savings Amount:</span>
                    <span className="font-bold text-primary">₹{roundUpAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {roundUpAmount === 0 && amount && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <span className="text-sm text-warning-foreground">
                      Amount is already rounded to ₹{roundUpOption}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goal Selection */}
          <Card className="savings-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Select Savings Goal</span>
              </CardTitle>
              <CardDescription>
                Choose which goal to add your rounded up savings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Choose Goal:</Label>
                <Select value={selectedGoal} onValueChange={setSelectedGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a savings goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{goal.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Goal Details */}
              {selectedGoal && (
                <div className="space-y-4">
                  {(() => {
                    const goal = goals.find(g => g.id === selectedGoal);
                    if (!goal) return null;
                    
                    const currentProgress = (goal.current / goal.target) * 100;
                    const newAmount = goal.current + roundUpAmount;
                    const newProgress = (newAmount / goal.target) * 100;
                    
                    return (
                      <div className="goal-card">
                        <h4 className="font-semibold mb-3">{goal.name}</h4>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Current Progress:</span>
                            <span>{currentProgress.toFixed(1)}%</span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span>Current Amount:</span>
                            <span>₹{goal.current.toLocaleString()}</span>
                          </div>
                          
                          {roundUpAmount > 0 && (
                            <>
                              <div className="flex justify-between text-sm text-primary">
                                <span>Adding:</span>
                                <span>+₹{roundUpAmount.toFixed(2)}</span>
                              </div>
                              
                              <div className="flex justify-between text-sm font-medium">
                                <span>New Amount:</span>
                                <span>₹{newAmount.toLocaleString()}</span>
                              </div>
                              
                              <div className="flex justify-between text-sm font-medium">
                                <span>New Progress:</span>
                                <span>{newProgress.toFixed(1)}%</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSavingsSubmit}
                disabled={!amount || !selectedGoal || roundUpAmount === 0 || isProcessing}
                className="w-full btn-primary"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Add ₹{roundUpAmount.toFixed(2)} to Goal
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <Card className="mt-8 savings-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>How Savings via Shopping Works</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-medium mb-2">Enter Amount</h4>
                <p className="text-sm text-muted-foreground">
                  Enter the amount you spent on shopping
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h4 className="font-medium mb-2">Round Up</h4>
                <p className="text-sm text-muted-foreground">
                  We calculate the difference to the nearest 100, 500, or 1000
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h4 className="font-medium mb-2">Save Automatically</h4>
                <p className="text-sm text-muted-foreground">
                  The rounded up amount is added to your selected goal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Voice Button */}
      <VoiceButton 
        variant="floating"
        onCommand={handleVoiceCommand}
      />

      {/* Voice Instructions */}
      <div className="fixed bottom-20 right-6 max-w-xs">
        <Card className="bg-primary text-primary-foreground shadow-large">
          <CardContent className="p-3">
            <p className="text-xs">
              💬 Say: "Add 95", "Go back", "Help"
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ChatBot */}
      <ChatBot 
        isLoggedIn={true} 
        userAccountData={{
          savings: 15750,
          goals: goals,
          totalSaved: 15750
        }}
      />
    </div>
  );
};

export default SavingsShoppingPage;