import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import HoverExplainer from './HoverExplainer';

interface DashboardChartsProps {
  savingsData: {
    totalSavings: number;
    weeklyGrowth: number;
    monthlyGrowth: number;
    yearlyGrowth: number;
    rewardPoints: number;
    savingStreak: number;
  };
  goals: Array<{
    id: string;
    name: string;
    target: number;
    current: number;
    category: string;
  }>;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ savingsData, goals }) => {
  const { t } = useTranslation();

  // Growth data for bar chart
  const growthData = [
    {
      period: 'Week',
      growth: savingsData.weeklyGrowth,
      color: '#10B981'
    },
    {
      period: 'Month',
      growth: savingsData.monthlyGrowth,
      color: '#3B82F6'
    },
    {
      period: 'Year',
      growth: savingsData.yearlyGrowth,
      color: '#8B5CF6'
    }
  ];

  // Goal progress data for pie chart
  const goalProgressData = goals.map(goal => ({
    name: goal.name,
    completed: goal.current,
    remaining: Math.max(0, goal.target - goal.current),
    progress: (goal.current / goal.target) * 100
  }));

  // Category distribution for pie chart
  const categoryData = goals.reduce((acc, goal) => {
    const category = goal.category;
    const existing = acc.find(item => item.category === category);
    if (existing) {
      existing.amount += goal.current;
      existing.count += 1;
    } else {
      acc.push({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: goal.current,
        count: 1
      });
    }
    return acc;
  }, [] as Array<{ category: string; amount: number; count: number }>);

  // Monthly savings trend (simulated data)
  const trendData = [
    { month: 'Jan', savings: 2500 },
    { month: 'Feb', savings: 4200 },
    { month: 'Mar', savings: 6800 },
    { month: 'Apr', savings: 9500 },
    { month: 'May', savings: 12200 },
    { month: 'Jun', savings: savingsData.totalSavings }
  ];

  const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Growth Chart */}
      <HoverExplainer 
        explanation="This bar chart shows your savings growth percentage across different time periods"
        value={`Week: ${savingsData.weeklyGrowth}%, Month: ${savingsData.monthlyGrowth}%, Year: ${savingsData.yearlyGrowth}%`}
      >
        <Card className="savings-card">
          <CardHeader>
            <CardTitle className="text-lg">Savings Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Growth']}
                  labelFormatter={(label) => `This ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="growth" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </HoverExplainer>

      {/* Goal Progress Chart */}
      <HoverExplainer 
        explanation="This pie chart shows the progress distribution across all your active savings goals"
        value={`${goals.length} active goals`}
      >
        <Card className="savings-card">
          <CardHeader>
            <CardTitle className="text-lg">Goal Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`₹${Number(value).toLocaleString()}`, 'Amount Saved']}
                  labelFormatter={(label) => `${label} Goals`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {categoryData.map((entry, index) => (
                <div key={entry.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{entry.category}</span>
                  </div>
                  <span className="text-sm font-medium">₹{entry.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </HoverExplainer>

      {/* Savings Trend Chart */}
      <HoverExplainer 
        explanation="This line chart shows your savings growth trend over the past 6 months"
        value={`Current total: ₹${savingsData.totalSavings.toLocaleString()}`}
      >
        <Card className="savings-card">
          <CardHeader>
            <CardTitle className="text-lg">Savings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Total Savings']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </HoverExplainer>

      {/* Goals Progress Overview */}
      <HoverExplainer 
        explanation="This chart shows individual progress for each of your savings goals"
        value={`Average progress: ${Math.round(goals.reduce((acc, goal) => acc + (goal.current / goal.target * 100), 0) / goals.length)}%`}
      >
        <Card className="savings-card">
          <CardHeader>
            <CardTitle className="text-lg">Individual Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={goalProgressData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  width={100}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'progress') {
                      return [`${Number(value).toFixed(1)}%`, 'Progress'];
                    }
                    return [`₹${Number(value).toLocaleString()}`, name === 'completed' ? 'Completed' : 'Remaining'];
                  }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="progress" 
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </HoverExplainer>
    </div>
  );
};

export default DashboardCharts;