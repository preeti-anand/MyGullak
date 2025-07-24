import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  PiggyBank, 
  Target, 
  TrendingUp, 
  Gift, 
  Plus, 
  Settings, 
  LogOut,
  Calendar,
  Star,
  Wallet,
  BarChart3,
  PieChart,
  ShoppingCart,
  Receipt
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import LanguageSelector from '@/components/LanguageSelector';
import HoverExplainer from '@/components/HoverExplainer';
import GoalModal from '@/components/GoalModal';
import DashboardCharts from '@/components/DashboardCharts';
import InvestmentModal from '@/components/InvestmentModal';
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

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { speak } = useVoiceInteraction();
  const { toast } = useToast();

  const [savingsData, setSavingsData] = useState({
    totalSavings: 15750,
    weeklyGrowth: 8.5,
    monthlyGrowth: 12.3,
    yearlyGrowth: 34.7,
    rewardPoints: 2340,
    savingStreak: 23
  });

  const [goals, setGoals] = useState<SavingsGoal[]>([
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

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [completedGoalForInvestment, setCompletedGoalForInvestment] = useState<{id: string; name: string; amount: number} | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      speak(t('audio.dashboardGuide'));
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak, t]);

  // Check for completed transactions and update data
  useEffect(() => {
    const lastTransaction = localStorage.getItem('lastTransaction');
    if (lastTransaction) {
      const transaction = JSON.parse(lastTransaction);
      
      // Update total savings
      setSavingsData(prev => ({
        ...prev,
        totalSavings: prev.totalSavings + transaction.amount
      }));

      // Update goal current amount
      setGoals(prev => prev.map(goal => 
        goal.id === transaction.goalId 
          ? { ...goal, current: goal.current + transaction.amount }
          : goal
      ));

      // Clear the transaction from localStorage
      localStorage.removeItem('lastTransaction');
      
      // Check if goal is completed
      const updatedGoal = goals.find(g => g.id === transaction.goalId);
      if (updatedGoal && (updatedGoal.current + transaction.amount) >= updatedGoal.target) {
        setTimeout(() => {
          setCompletedGoalForInvestment({
            id: updatedGoal.id,
            name: updatedGoal.name,
            amount: updatedGoal.target
          });
          setIsInvestmentModalOpen(true);
          speak(`Congratulations! You've completed your ${updatedGoal.name} goal. Would you like to explore investment options?`);
        }, 2000);
      }
    }
  }, [goals, speak]);

  const handleVoiceCommand = (command: string, transcript: string) => {
    switch (command) {
      case 'ADD_MONEY':
        navigate('/payment');
        speak(t('audio.navigatingToPayment'));
        break;
      case 'CREATE_GOAL':
        setIsGoalModalOpen(true);
        speak(t('audio.openingGoalForm'));
        break;
      case 'CHECK_BALANCE':
        speak(t('audio.currentBalance', { amount: savingsData.totalSavings.toLocaleString() }));
        break;
      case 'SHOW_REWARDS':
      case 'VIEW_REWARDS':
        navigate('/rewards');
        speak(t('audio.rewardPoints', { points: savingsData.rewardPoints }));
        break;
      case 'OPEN_SETTINGS':
        navigate('/settings');
        speak(t('audio.navigatingToSettings'));
        break;
      case 'LOGOUT':
        handleLogout();
        break;
      case 'SHOW_CHARTS':
        setShowCharts(!showCharts);
        speak(showCharts ? t('audio.hidingCharts') : t('audio.showingCharts'));
        break;
      case 'SAVINGS_SHOPPING':
        navigate('/savings-shopping');
        speak('Opening savings via shopping screen');
        break;
      case 'MY_TRANSACTIONS':
        navigate('/transactions');
        speak('Opening transaction history');
        break;
      case 'SHOW_HELP':
        speak(t('audio.helpCommands'));
        break;
      default:
        speak(t('audio.didNotUnderstand', { transcript }));
    }
  };

  const handleLogout = () => {
    speak(t('audio.signingOut'));
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const endDate = new Date(deadline);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handleCreateGoal = (newGoal: SavingsGoal) => {
    setGoals(prev => [...prev, newGoal]);
    toast({
      title: "Goal Created!",
      description: `Your goal "${newGoal.name}" has been created successfully.`,
    });
    speak(`Goal "${newGoal.name}" has been created successfully!`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-soft">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center">
                <img src="/src/assets/gullak_logo.png" alt="Gullak" className="h-16 w-16 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Gullak</h1>
                <p className="text-primary-foreground/80 text-sm">Welcome back!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <LanguageSelector variant="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/settings')}
                className="text-white hover:bg-white/10"
                aria-label={t('nav.settings')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/10"
                aria-label={t('nav.logout')}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Savings */}
          <HoverExplainer 
            explanation="This shows your total savings amount across all goals and general savings"
            value={formatCurrency(savingsData.totalSavings)}
          >
            <Card className="savings-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('dashboard.totalSavings')}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(savingsData.totalSavings)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </HoverExplainer>

          {/* Weekly Growth */}
          <HoverExplainer 
            explanation="This shows your savings growth percentage for the current week"
            value={`+${savingsData.weeklyGrowth}%`}
          >
            <Card className="savings-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('dashboard.thisWeek')}
                    </p>
                    <p className="text-2xl font-bold text-success">
                      +{savingsData.weeklyGrowth}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-success-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </HoverExplainer>

          {/* Reward Points */}
          <HoverExplainer 
            explanation="These are reward points you earned by consistent saving and achieving milestones"
            value={`${savingsData.rewardPoints.toLocaleString()} points`}
          >
            <Card className="savings-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('dashboard.rewardPoints')}
                    </p>
                    <p className="text-2xl font-bold text-secondary">
                      {savingsData.rewardPoints.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                    <Gift className="h-6 w-6 text-secondary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </HoverExplainer>

          {/* Saving Streak */}
          <HoverExplainer 
            explanation="This shows how many consecutive days you have been saving money"
            value={`${savingsData.savingStreak} days streak`}
          >
            <Card className="savings-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('dashboard.savingStreak')}
                    </p>
                    <p className="text-2xl font-bold text-warning">
                      {savingsData.savingStreak} days
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-warning-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </HoverExplainer>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
            <CardDescription>
              Manage your savings and goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <HoverExplainer 
                explanation="Click here to add money to your savings account. You can use UPI, bank transfer, or card payment"
              >
                <Button 
                  onClick={() => navigate('/payment')}
                  className="btn-primary h-auto py-4 flex-col space-y-2"
                  aria-label={t('dashboard.addMoney')}
                >
                  <Plus className="h-6 w-6" />
                  <span>{t('dashboard.addMoney')}</span>
                </Button>
              </HoverExplainer>
              
              <HoverExplainer 
                explanation="Click here to create a new savings goal. Set your target amount, deadline, and category"
              >
                <Button 
                  onClick={() => setIsGoalModalOpen(true)}
                  variant="outline"
                  className="h-auto py-4 flex-col space-y-2 hover:bg-accent"
                  aria-label={t('dashboard.setGoal')}
                >
                  <Target className="h-6 w-6" />
                  <span>{t('dashboard.setGoal')}</span>
                </Button>
              </HoverExplainer>
              
              <HoverExplainer 
                explanation="Click here to view your reward points and available rewards"
                value={`${savingsData.rewardPoints} points available`}
              >
                <Button 
                  onClick={() => navigate('/rewards')}
                  variant="outline"
                  className="h-auto py-4 flex-col space-y-2 hover:bg-accent"
                  aria-label={t('dashboard.viewRewards')}
                >
                  <Gift className="h-6 w-6" />
                  <span>{t('dashboard.viewRewards')}</span>
                </Button>
              </HoverExplainer>

              <HoverExplainer 
                explanation="Click here to toggle between data view and graphical charts view of your savings"
              >
                <Button 
                  onClick={() => setShowCharts(!showCharts)}
                  variant="outline"
                  className="h-auto py-4 flex-col space-y-2 hover:bg-accent"
                  aria-label="Toggle charts view"
                >
                  {showCharts ? <BarChart3 className="h-6 w-6" /> : <PieChart className="h-6 w-6" />}
                  <span>{showCharts ? 'Hide Charts' : 'Show Charts'}</span>
                </Button>
              </HoverExplainer>

              <HoverExplainer 
                explanation="Click here to save money by rounding up your shopping expenses to the nearest amount"
              >
                <Button 
                  onClick={() => navigate('/savings-shopping')}
                  variant="outline"
                  className="h-auto py-4 flex-col space-y-2 hover:bg-accent"
                  aria-label="Savings via Shopping"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span>Savings via Shopping</span>
                </Button>
              </HoverExplainer>

              <HoverExplainer 
                explanation="Click here to view all your transaction history including deposits, savings, and goal contributions"
              >
                <Button 
                  onClick={() => navigate('/transactions')}
                  variant="outline"
                  className="h-auto py-4 flex-col space-y-2 hover:bg-accent"
                  aria-label="My Transactions"
                >
                  <Receipt className="h-6 w-6" />
                  <span>My Transactions</span>
                </Button>
              </HoverExplainer>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        {showCharts && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Savings Analytics
                </CardTitle>
                <CardDescription>
                  Visual representation of your savings data and goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardCharts savingsData={savingsData} goals={goals} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Goals */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.activeGoals')}</CardTitle>
            <CardDescription>
              Track your progress towards your savings goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {goals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                const daysLeft = getDaysLeft(goal.deadline);
                
                return (
                  <HoverExplainer 
                    key={goal.id}
                    explanation={`This is your ${goal.name} goal. You have saved ${formatCurrency(goal.current)} out of ${formatCurrency(goal.target)}`}
                    value={`${progress.toFixed(1)}% complete, ${daysLeft} days remaining`}
                  >
                    <div className="goal-card">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{goal.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {progress >= 100 ? (
                            <Button
                              size="sm"
                              className="btn-primary"
                              onClick={() => {
                                setCompletedGoalForInvestment({
                                  id: goal.id,
                                  name: goal.name,
                                  amount: goal.target
                                });
                                setIsInvestmentModalOpen(true);
                              }}
                            >
                              Invest Now
                            </Button>
                          ) : (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{daysLeft} {t('goals.daysLeft')}</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t('goals.progress')}</span>
                          <span>{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        {progress >= 100 && (
                          <div className="text-success text-sm font-medium">
                            🎉 Goal Completed! Ready for investment.
                          </div>
                        )}
                      </div>
                    </div>
                  </HoverExplainer>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Goal Creation Modal */}
      <GoalModal 
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onCreateGoal={handleCreateGoal}
      />

      {/* Voice Button */}
      <VoiceButton 
        variant="floating"
        onCommand={handleVoiceCommand}
      />

      {/* Voice Instructions Overlay */}
      <div className="fixed bottom-20 right-6 max-w-xs">
        <Card className="bg-primary text-primary-foreground shadow-large">
          <CardContent className="p-3">
            <p className="text-xs">
              💬 Say: "Add money", "Check balance", "Show rewards", "Settings"
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Investment Modal */}
      <InvestmentModal
        isOpen={isInvestmentModalOpen}
        onClose={() => setIsInvestmentModalOpen(false)}
        completedGoal={completedGoalForInvestment}
      />

      {/* ChatBot */}
      <ChatBot 
        isLoggedIn={true} 
        userAccountData={{
          savings: savingsData.totalSavings,
          goals: goals,
          totalSaved: savingsData.totalSavings
        }}
      />
    </div>
  );
};

export default Dashboard;