import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { useToast } from '@/hooks/use-toast';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (goal: any) => void;
}

interface GoalForm {
  name: string;
  targetAmount: string;
  deadline: string;
  category: string;
  description: string;
}

const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onCreateGoal }) => {
  const { t } = useTranslation();
  const { speak } = useVoiceInteraction();
  const { toast } = useToast();
  
  const [form, setForm] = useState<GoalForm>({
    name: '',
    targetAmount: '',
    deadline: '',
    category: '',
    description: ''
  });

  const categories = [
    { value: 'emergency', label: t('goals.categories.emergency') },
    { value: 'vacation', label: t('goals.categories.vacation') },
    { value: 'gadget', label: t('goals.categories.gadget') },
    { value: 'education', label: t('goals.categories.education') },
    { value: 'other', label: t('goals.categories.other') }
  ];

  useEffect(() => {
    if (isOpen) {
      speak(t('audio.goalGuide'));
    }
  }, [isOpen, speak, t]);

  const handleInputChange = (field: keyof GoalForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.targetAmount || !form.deadline || !form.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      speak("Please fill in all required fields");
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      name: form.name,
      target: parseFloat(form.targetAmount),
      current: 0,
      deadline: form.deadline,
      category: form.category,
      description: form.description,
      createdAt: new Date().toISOString()
    };

    onCreateGoal(newGoal);
    speak(`Goal "${form.name}" created successfully with target amount of ${form.targetAmount}`);
    
    // Reset form
    setForm({
      name: '',
      targetAmount: '',
      deadline: '',
      category: '',
      description: ''
    });
    
    onClose();
  };

  const getMinDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {t('goals.createGoal')}
          </DialogTitle>
          <DialogDescription>
            Create a new savings goal to help you stay motivated and track your progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Name */}
          <div className="space-y-2">
            <Label htmlFor="goalName" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              {t('goals.goalName')} *
            </Label>
            <Input
              id="goalName"
              value={form.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Emergency Fund, New Laptop, Vacation"
              className="w-full"
              required
            />
          </div>

          {/* Target Amount */}
          <div className="space-y-2">
            <Label htmlFor="targetAmount" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t('goals.targetAmount')} *
            </Label>
            <Input
              id="targetAmount"
              type="number"
              value={form.targetAmount}
              onChange={(e) => handleInputChange('targetAmount', e.target.value)}
              placeholder="Enter target amount"
              min="1"
              step="0.01"
              className="w-full"
              required
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('goals.deadline')} *
            </Label>
            <Input
              id="deadline"
              type="date"
              value={form.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              min={getMinDate()}
              className="w-full"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t('goals.category')} *
            </Label>
            <Select 
              value={form.category} 
              onValueChange={(value) => handleInputChange('category', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('goals.description')} (Optional)
            </Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your goal and why it's important to you..."
              rows={3}
              className="w-full"
            />
          </div>

          {/* Goal Preview */}
          {form.name && form.targetAmount && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <h4 className="font-semibold text-primary mb-2">Goal Preview</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Goal:</strong> {form.name}</p>
                  <p><strong>Target:</strong> ₹{parseFloat(form.targetAmount || '0').toLocaleString()}</p>
                  {form.deadline && (
                    <p><strong>Deadline:</strong> {new Date(form.deadline).toLocaleDateString()}</p>
                  )}
                  {form.category && (
                    <p><strong>Category:</strong> {categories.find(c => c.value === form.category)?.label}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              className="btn-primary flex-1"
            >
              {t('goals.createGoal')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalModal;