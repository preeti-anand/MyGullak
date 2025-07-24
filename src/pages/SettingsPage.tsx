import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Mic, 
  Globe, 
  Bell, 
  Shield, 
  HelpCircle,
  User,
  LogOut
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import LanguageSelector from '@/components/LanguageSelector';
import ChatBot from '@/components/ChatBot';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';

interface SettingsState {
  voiceEnabled: boolean;
  audioGuideEnabled: boolean;
  notificationsEnabled: boolean;
  autoSpeakEnabled: boolean;
}

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { speak, getAvailableCommands } = useVoiceInteraction();

  const [settings, setSettings] = useState<SettingsState>({
    voiceEnabled: true,
    audioGuideEnabled: true,
    notificationsEnabled: true,
    autoSpeakEnabled: true
  });

  const [showCommands, setShowCommands] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      speak(t('audio.settingsGuide'));
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak, t]);

  const handleVoiceCommand = (command: string, transcript: string) => {
    switch (command) {
      case 'GO_BACK':
      case 'GO_DASHBOARD':
        navigate('/dashboard');
        break;
      case 'SHOW_HELP':
      case 'SHOW_COMMANDS':
        setShowCommands(!showCommands);
        speak(showCommands ? 'Hiding voice commands' : 'Showing available voice commands');
        break;
      case 'LOGOUT':
        handleLogout();
        break;
      case 'TOGGLE_VOICE':
        toggleSetting('voiceEnabled');
        break;
      case 'TOGGLE_AUDIO':
        toggleSetting('audioGuideEnabled');
        break;
      default:
        speak(`Sorry, I didn't understand: ${transcript}`);
    }
  };

  const toggleSetting = (key: keyof SettingsState) => {
    setSettings(prev => {
      const newValue = !prev[key];
      const settingName = key.replace('Enabled', '').replace(/([A-Z])/g, ' $1').toLowerCase();
      speak(`${settingName} ${newValue ? 'enabled' : 'disabled'}`);
      return { ...prev, [key]: newValue };
    });
  };

  const handleLogout = () => {
    speak('Signing you out...');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const voiceCommands = getAvailableCommands();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-soft">
        <div className="max-w-4xl mx-auto px-4 py-6">
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
                <h1 className="text-2xl font-bold text-white">{t('nav.settings')}</h1>
                <p className="text-primary-foreground/80 text-sm">Manage your preferences</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <LanguageSelector variant="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Voice & Audio Settings */}
        <Card className="savings-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5" />
              <span>Voice & Audio Settings</span>
            </CardTitle>
            <CardDescription>
              Configure voice interaction and audio guides
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Voice Commands */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center space-x-2">
                  <Mic className="h-4 w-4" />
                  <span>Voice Commands</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable voice command recognition
                </p>
              </div>
              <Switch
                checked={settings.voiceEnabled}
                onCheckedChange={() => toggleSetting('voiceEnabled')}
                aria-label="Toggle voice commands"
              />
            </div>

            <Separator />

            {/* Audio Guide */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center space-x-2">
                  {settings.audioGuideEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                  <span>Audio Guide</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable audio descriptions and guidance
                </p>
              </div>
              <Switch
                checked={settings.audioGuideEnabled}
                onCheckedChange={() => toggleSetting('audioGuideEnabled')}
                aria-label="Toggle audio guide"
              />
            </div>

            <Separator />

            {/* Auto-Speak */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Auto-Speak Responses</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically speak system responses
                </p>
              </div>
              <Switch
                checked={settings.autoSpeakEnabled}
                onCheckedChange={() => toggleSetting('autoSpeakEnabled')}
                aria-label="Toggle auto-speak"
              />
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="savings-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Language Settings</span>
            </CardTitle>
            <CardDescription>
              Choose your preferred language for the app and voice commands
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">App Language</Label>
                <p className="text-sm text-muted-foreground">
                  Current: {i18n.language === 'en' ? 'English' : 
                           i18n.language === 'es' ? 'Español' :
                           i18n.language === 'de' ? 'Deutsch' :
                           i18n.language === 'mr' ? 'मराठी' :
                           i18n.language === 'hi' ? 'हिन्दी' : 'English'}
                </p>
              </div>
              <LanguageSelector variant="default" />
            </div>
          </CardContent>
        </Card>

        {/* Voice Commands Reference */}
        <Card className="savings-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Voice Commands Reference</span>
            </CardTitle>
            <CardDescription>
              Available voice commands you can use throughout the app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => setShowCommands(!showCommands)}
              className="mb-4"
            >
              {showCommands ? 'Hide Commands' : 'Show Commands'}
            </Button>

            {showCommands && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {voiceCommands.map((command, index) => (
                    <div 
                      key={index}
                      className="bg-accent rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          "{command.pattern.source.replace(/[\/\\^$.*+?()[\]{}|]/g, '').toLowerCase()}"
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {command.action.replace('_', ' ').toLowerCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {command.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="savings-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about savings goals and reminders
                </p>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={() => toggleSetting('notificationsEnabled')}
                aria-label="Toggle notifications"
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="savings-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Account</span>
            </CardTitle>
            <CardDescription>
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => speak('Profile management coming soon!')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Privacy & Security
            </Button>

            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('nav.logout')}
            </Button>
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
              💬 Say: "Show commands", "Go back", "Toggle voice", "Logout"
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
          totalSaved: 15750
        }}
      />
    </div>
  );
};

export default SettingsPage;