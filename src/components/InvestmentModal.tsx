import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Building, 
  Landmark, 
  Shield, 
  Zap, 
  Globe,
  ArrowRight,
  Star
} from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedGoal: {
    id: string;
    name: string;
    amount: number;
  } | null;
}

interface InvestmentOption {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  expectedReturn: string;
  risk: 'Low' | 'Medium' | 'High';
  icon: React.ElementType;
  category: 'mutual_fund' | 'government' | 'fixed_deposit' | 'equity';
  popular?: boolean;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ isOpen, onClose, completedGoal }) => {
  const { t } = useTranslation();
  const { speak } = useVoiceInteraction();
  const [selectedOption, setSelectedOption] = useState<string>('');

  const investmentOptions: InvestmentOption[] = [
    {
      id: 'sip_equity',
      name: 'Equity Mutual Funds (SIP)',
      description: 'Systematic Investment Plan in equity mutual funds',
      minAmount: 500,
      expectedReturn: '12-15%',
      risk: 'Medium',
      icon: TrendingUp,
      category: 'mutual_fund',
      popular: true
    },
    {
      id: 'ppf',
      name: 'Public Provident Fund (PPF)',
      description: 'Government backed 15-year tax saving scheme',
      minAmount: 500,
      expectedReturn: '7.1%',
      risk: 'Low',
      icon: Shield,
      category: 'government',
      popular: true
    },
    {
      id: 'nsc',
      name: 'National Savings Certificate',
      description: 'Government savings bond with 5-year lock-in',
      minAmount: 1000,
      expectedReturn: '6.8%',
      risk: 'Low',
      icon: Landmark,
      category: 'government'
    },
    {
      id: 'elss',
      name: 'ELSS Tax Saver Funds',
      description: 'Tax saving mutual funds with 3-year lock-in',
      minAmount: 500,
      expectedReturn: '10-12%',
      risk: 'Medium',
      icon: Star,
      category: 'mutual_fund'
    },
    {
      id: 'fd',
      name: 'Fixed Deposit',
      description: 'Traditional bank fixed deposits',
      minAmount: 1000,
      expectedReturn: '5-7%',
      risk: 'Low',
      icon: Building,
      category: 'fixed_deposit'
    },
    {
      id: 'sukanya',
      name: 'Sukanya Samriddhi Yojana',
      description: 'Government scheme for girl child education',
      minAmount: 250,
      expectedReturn: '7.6%',
      risk: 'Low',
      icon: Zap,
      category: 'government'
    },
    {
      id: 'international',
      name: 'International Funds',
      description: 'Mutual funds investing in global markets',
      minAmount: 1000,
      expectedReturn: '8-12%',
      risk: 'High',
      icon: Globe,
      category: 'mutual_fund'
    }
  ];

  const handleInvestmentSelect = (optionId: string) => {
    setSelectedOption(optionId);
    const option = investmentOptions.find(opt => opt.id === optionId);
    if (option) {
      speak(`Selected ${option.name} with expected return of ${option.expectedReturn}`);
    }
  };

  const handleProceedToInvest = () => {
    const option = investmentOptions.find(opt => opt.id === selectedOption);
    if (option && completedGoal) {
      speak(`Proceeding to invest ₹${completedGoal.amount.toLocaleString()} in ${option.name}`);
      // In a real app, this would navigate to investment processing
      onClose();
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-success bg-success/10';
      case 'Medium': return 'text-warning bg-warning/10';
      case 'High': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Investment Options
          </DialogTitle>
          <DialogDescription>
            {completedGoal && (
              <>Congratulations on completing your "{completedGoal.name}" goal! 
              Choose an investment option for your ₹{completedGoal.amount.toLocaleString()}.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Investment Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investmentOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.id;
              
              return (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-primary border-primary' : 'border-border'
                  }`}
                  onClick={() => handleInvestmentSelect(option.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            {option.name}
                            {option.popular && (
                              <Badge variant="secondary" className="text-xs">Popular</Badge>
                            )}
                          </CardTitle>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      {option.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Expected Return:</span>
                        <span className="font-semibold text-success">{option.expectedReturn}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Minimum Amount:</span>
                        <span className="font-semibold">₹{option.minAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Risk Level:</span>
                        <Badge className={getRiskColor(option.risk)}>
                          {option.risk}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Selected Investment Summary */}
          {selectedOption && completedGoal && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <h4 className="font-semibold text-primary mb-2">Investment Summary</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Investment:</strong> {investmentOptions.find(opt => opt.id === selectedOption)?.name}</p>
                  <p><strong>Amount:</strong> ₹{completedGoal.amount.toLocaleString()}</p>
                  <p><strong>Expected Return:</strong> {investmentOptions.find(opt => opt.id === selectedOption)?.expectedReturn} per annum</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleProceedToInvest}
              disabled={!selectedOption}
              className="btn-primary flex-1"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Proceed to Invest
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentModal;