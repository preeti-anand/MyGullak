import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Receipt, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Wallet,
  PiggyBank,
  ShoppingCart
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import LanguageSelector from '@/components/LanguageSelector';
import ChatBot from '@/components/ChatBot';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';

interface Transaction {
  id: string;
  date: string;
  type: 'deposit' | 'savings_shopping' | 'goal_contribution' | 'reward';
  description: string;
  paidAmount?: number;
  savedAmount: number;
  goalName?: string;
  method?: string;
  status: 'completed' | 'pending' | 'failed';
}

const TransactionsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { speak } = useVoiceInteraction();

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2024-01-15',
      type: 'deposit',
      description: 'Direct deposit via UPI',
      savedAmount: 5000,
      method: 'UPI',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-01-14',
      type: 'savings_shopping',
      description: 'Shopping at Local Store',
      paidAmount: 1295,
      savedAmount: 205,
      goalName: 'Emergency Fund',
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-01-13',
      type: 'goal_contribution',
      description: 'Monthly goal contribution',
      savedAmount: 2000,
      goalName: 'Vacation to Goa',
      status: 'completed'
    },
    {
      id: '4',
      date: '2024-01-12',
      type: 'savings_shopping',
      description: 'Grocery Shopping',
      paidAmount: 850,
      savedAmount: 150,
      goalName: 'New Laptop',
      status: 'completed'
    },
    {
      id: '5',
      date: '2024-01-11',
      type: 'reward',
      description: 'Weekly savings streak bonus',
      savedAmount: 100,
      status: 'completed'
    },
    {
      id: '6',
      date: '2024-01-10',
      type: 'deposit',
      description: 'Bank transfer',
      savedAmount: 3000,
      method: 'Bank Transfer',
      status: 'completed'
    },
    {
      id: '7',
      date: '2024-01-09',
      type: 'savings_shopping',
      description: 'Online Shopping',
      paidAmount: 2450,
      savedAmount: 50,
      goalName: 'Emergency Fund',
      status: 'completed'
    },
    {
      id: '8',
      date: '2024-01-08',
      type: 'goal_contribution',
      description: 'Emergency fund contribution',
      savedAmount: 1500,
      goalName: 'Emergency Fund',
      status: 'completed'
    }
  ]);

  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      speak('Transactions screen. Here you can view all your transaction history including deposits, savings via shopping, and goal contributions.');
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak]);

  useEffect(() => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.goalName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, filterType, transactions]);

  const handleVoiceCommand = (command: string, transcript: string) => {
    switch (command) {
      case 'GO_BACK':
      case 'GO_DASHBOARD':
        navigate('/dashboard');
        break;
      case 'SHOW_HELP':
        speak('This is your transaction history. You can search transactions or filter by type. Say "go back" to return to dashboard.');
        break;
      default:
        speak(`Sorry, I didn't understand: ${transcript}`);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Wallet className="h-4 w-4" />;
      case 'savings_shopping':
        return <ShoppingCart className="h-4 w-4" />;
      case 'goal_contribution':
        return <PiggyBank className="h-4 w-4" />;
      case 'reward':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-primary';
      case 'savings_shopping':
        return 'text-secondary';
      case 'goal_contribution':
        return 'text-success';
      case 'reward':
        return 'text-warning';
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

  const totalSaved = transactions.reduce((sum, transaction) => sum + transaction.savedAmount, 0);
  const totalPaid = transactions.reduce((sum, transaction) => sum + (transaction.paidAmount || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-soft">
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
                <h1 className="text-2xl font-bold text-white">My Transactions</h1>
                <p className="text-primary-foreground/80 text-sm">View your complete transaction history</p>
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="savings-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Saved</p>
                  <p className="text-2xl font-bold text-success">₹{totalSaved.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center">
                  <PiggyBank className="h-6 w-6 text-success-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="savings-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-primary">₹{totalPaid.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="savings-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold text-secondary">{transactions.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="deposit">Deposits</SelectItem>
                    <SelectItem value="savings_shopping">Savings via Shopping</SelectItem>
                    <SelectItem value="goal_contribution">Goal Contributions</SelectItem>
                    <SelectItem value="reward">Rewards</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Transaction History
              </span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardTitle>
            <CardDescription>
              {filteredTransactions.length} of {transactions.length} transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full bg-accent flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{transaction.description}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(transaction.date)}</span>
                        </span>
                        {transaction.goalName && (
                          <span>Goal: {transaction.goalName}</span>
                        )}
                        {transaction.method && (
                          <span>via {transaction.method}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex flex-col space-y-1">
                      {transaction.paidAmount && (
                        <div className="text-sm text-muted-foreground">
                          Paid: ₹{transaction.paidAmount.toLocaleString()}
                        </div>
                      )}
                      <div className="font-semibold text-success">
                        +₹{transaction.savedAmount.toLocaleString()}
                      </div>
                    </div>
                    <Badge 
                      variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No transactions found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterType !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Start saving to see your transactions here.'
                    }
                  </p>
                </div>
              )}
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
              💬 Say: "Go back", "Help"
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ChatBot */}
      <ChatBot 
        isLoggedIn={true} 
        userAccountData={{
          savings: totalSaved,
          goals: [],
          totalSaved: totalSaved
        }}
      />
    </div>
  );
};

export default TransactionsPage;