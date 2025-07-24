import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Gift, 
  Star,
  TrendingUp,
  Calendar,
  Award,
  Coins,
  Target,
  Zap,
  Crown
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import LanguageSelector from '@/components/LanguageSelector';
import ChatBot from '@/components/ChatBot';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  earnedDate: string;
  type: 'streak' | 'goal' | 'milestone' | 'interest' | 'bonus';
  interestRate?: number;
  savingsAmount?: number;
}

interface RewardTier {
  name: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
  color: string;
  icon: React.ReactNode;
}

const RewardsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { speak } = useVoiceInteraction();

  const [currentPoints] = useState(2340);
  const [totalEarned] = useState(5680);
  const [interestEarned] = useState(1250);

  const [rewards] = useState<Reward[]>([
    {
      id: '1',
      title: 'Weekly Savings Streak',
      description: '7 consecutive days of saving',
      points: 100,
      earnedDate: '2024-01-15',
      type: 'streak'
    },
    {
      id: '2',
      title: 'Goal Achievement Bonus',
      description: 'Completed Emergency Fund goal',
      points: 500,
      earnedDate: '2024-01-14',
      type: 'goal'
    },
    {
      id: '3',
      title: 'Interest Reward',
      description: 'Monthly interest on savings',
      points: 250,
      earnedDate: '2024-01-13',
      type: 'interest',
      interestRate: 5.2,
      savingsAmount: 15000
    },
    {
      id: '4',
      title: 'Savings Milestone',
      description: 'Reached ₹10,000 in total savings',
      points: 300,
      earnedDate: '2024-01-12',
      type: 'milestone'
    },
    {
      id: '5',
      title: 'Shopping Saver',
      description: 'Used savings via shopping 10 times',
      points: 150,
      earnedDate: '2024-01-11',
      type: 'bonus'
    },
    {
      id: '6',
      title: 'Monthly Interest',
      description: 'Interest earned on December savings',
      points: 180,
      earnedDate: '2024-01-01',
      type: 'interest',
      interestRate: 4.8,
      savingsAmount: 12000
    }
  ]);

  const rewardTiers: RewardTier[] = [
    {
      name: 'Bronze Saver',
      minPoints: 0,
      maxPoints: 999,
      benefits: ['Basic interest rate: 3%', 'Monthly rewards summary'],
      color: 'text-amber-600',
      icon: <Coins className="h-5 w-5" />
    },
    {
      name: 'Silver Saver',
      minPoints: 1000,
      maxPoints: 2499,
      benefits: ['Enhanced interest rate: 4%', 'Weekly bonus opportunities', 'Priority support'],
      color: 'text-gray-500',
      icon: <Award className="h-5 w-5" />
    },
    {
      name: 'Gold Saver',
      minPoints: 2500,
      maxPoints: 4999,
      benefits: ['Premium interest rate: 5%', 'Daily bonus opportunities', 'Exclusive rewards', 'Personal advisor'],
      color: 'text-yellow-500',
      icon: <Star className="h-5 w-5" />
    },
    {
      name: 'Platinum Saver',
      minPoints: 5000,
      maxPoints: 9999,
      benefits: ['Maximum interest rate: 6%', 'VIP rewards program', 'Custom savings plans', 'Investment opportunities'],
      color: 'text-purple-500',
      icon: <Crown className="h-5 w-5" />
    }
  ];

  const currentTier = rewardTiers.find(tier => 
    currentPoints >= tier.minPoints && currentPoints <= tier.maxPoints
  ) || rewardTiers[0];

  const nextTier = rewardTiers.find(tier => tier.minPoints > currentPoints);
  const progressToNextTier = nextTier 
    ? ((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      speak(`Rewards screen. You have ${currentPoints} reward points and are currently in the ${currentTier.name} tier. You've earned ₹${interestEarned} in interest rewards.`);
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak, currentPoints, currentTier.name, interestEarned]);

  const handleVoiceCommand = (command: string, transcript: string) => {
    switch (command) {
      case 'GO_BACK':
      case 'GO_DASHBOARD':
        navigate('/dashboard');
        break;
      case 'CHECK_BALANCE':
        speak(`You have ${currentPoints} reward points and have earned ₹${interestEarned} in interest.`);
        break;
      case 'SHOW_HELP':
        speak('This is your rewards screen. You can see your points, tier status, and interest earned. Say "go back" to return to dashboard.');
        break;
      default:
        speak(`Sorry, I didn't understand: ${transcript}`);
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Zap className="h-4 w-4" />;
      case 'goal':
        return <Target className="h-4 w-4" />;
      case 'milestone':
        return <Award className="h-4 w-4" />;
      case 'interest':
        return <TrendingUp className="h-4 w-4" />;
      case 'bonus':
        return <Gift className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'streak':
        return 'text-warning';
      case 'goal':
        return 'text-success';
      case 'milestone':
        return 'text-primary';
      case 'interest':
        return 'text-secondary';
      case 'bonus':
        return 'text-purple-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-secondary shadow-soft">
        <div className="max-w-6xl mx-auto px-4 py-6">
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
                <h1 className="text-2xl font-bold text-white">My Rewards</h1>
                <p className="text-secondary-foreground/80 text-sm">Track your points and interest earnings</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <LanguageSelector variant="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Points Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="savings-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Points</p>
                  <p className="text-3xl font-bold text-secondary">{currentPoints.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="savings-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                  <p className="text-3xl font-bold text-primary">{totalEarned.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Gift className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="savings-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interest Earned</p>
                  <p className="text-3xl font-bold text-success">₹{interestEarned.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Tier Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={currentTier.color}>
                {currentTier.icon}
              </div>
              Current Tier: {currentTier.name}
            </CardTitle>
            <CardDescription>
              {nextTier 
                ? `${nextTier.minPoints - currentPoints} points to reach ${nextTier.name}`
                : 'You\'ve reached the highest tier!'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nextTier && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to {nextTier.name}</span>
                  <span>{Math.round(progressToNextTier)}%</span>
                </div>
                <Progress value={progressToNextTier} className="h-2" />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Current Benefits</h4>
                <ul className="space-y-2">
                  {currentTier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {nextTier && (
                <div>
                  <h4 className="font-semibold mb-3">Next Tier Benefits</h4>
                  <ul className="space-y-2">
                    {nextTier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interest Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Interest Earnings by Gullak
            </CardTitle>
            <CardDescription>
              Gullak adds interest to your savings based on your tier and saving habits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                  <h4 className="font-semibold text-success mb-2">Current Interest Rate</h4>
                  <p className="text-2xl font-bold text-success">
                    {currentTier.name === 'Bronze Saver' ? '3%' :
                     currentTier.name === 'Silver Saver' ? '4%' :
                     currentTier.name === 'Gold Saver' ? '5%' : '6%'} per annum
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on your {currentTier.name} tier
                  </p>
                </div>
                
                <div className="bg-accent rounded-lg p-4">
                  <h4 className="font-semibold mb-2">How Interest Works</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Interest calculated monthly on your average balance</li>
                    <li>• Higher tiers get better interest rates</li>
                    <li>• Interest is added as reward points</li>
                    <li>• Consistent saving increases your tier</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Recent Interest Earnings</h4>
                <div className="space-y-3">
                  {rewards.filter(r => r.type === 'interest').map((reward) => (
                    <div key={reward.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{reward.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {reward.interestRate}% on ₹{reward.savingsAmount?.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-success">+{reward.points} pts</p>
                        <p className="text-xs text-muted-foreground">{formatDate(reward.earnedDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Recent Rewards
            </CardTitle>
            <CardDescription>
              Your latest reward points and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full bg-accent flex items-center justify-center ${getRewardColor(reward.type)}`}>
                      {getRewardIcon(reward.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{reward.title}</h4>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                      {reward.type === 'interest' && reward.interestRate && (
                        <p className="text-xs text-success">
                          {reward.interestRate}% interest on ₹{reward.savingsAmount?.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-secondary text-lg">
                      +{reward.points} pts
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(reward.earnedDate)}
                    </div>
                  </div>
                </div>
              ))}
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
        <Card className="bg-secondary text-secondary-foreground shadow-large">
          <CardContent className="p-3">
            <p className="text-xs">
              💬 Say: "Check balance", "Go back", "Help"
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ChatBot */}
      <ChatBot 
        isLoggedIn={true} 
        userAccountData={{
          savings: 15750,
          goals: [],
          totalSaved: totalEarned
        }}
      />
    </div>
  );
};

export default RewardsPage;