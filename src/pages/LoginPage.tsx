import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PiggyBank, Mail, Lock } from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import LanguageSelector from '@/components/LanguageSelector';
import ChatBot from '@/components/ChatBot';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { speak } = useVoiceInteraction();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');


  // Welcome message when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(t('audio.welcomeMessage'));
    }, 1500);
    return () => clearTimeout(timer);
  }, [speak, t]);

  const handleVoiceCommand = (command: string, transcript: string) => {
    switch (command) {
      case 'LOGIN':
      case 'GO_DASHBOARD':
        handleLogin();
        break;
      case 'REGISTER':
        navigate('/register');
        break;
      case 'SHOW_HELP':
        speak(t('audio.loginGuide'));
        break;
      default:
        speak(`Sorry, I didn't understand: ${transcript}`);
    }
  };


  const handleLogin = async () => {
    const response = await axios.post('http://localhost:8080/mygullack/logins/authenticate', {
      userName: email,
      password: password,
    });

    console.log('Login successful:', response.data);

    //add response.data to session storage
    if (response.data) {
      localStorage.setItem('jwtToken', response.data);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data;

      const response1 = await axios.get('http://localhost:8080/mygullack/app/index');
      console.log('User data:', response1.data);

  navigate('/dashboard');
}else{
//speak(t('audio.loginFailed'));
}
};



  const handleGoogleLogin = () => {
    // In a real app, this would integrate with Google OAuth
    speak('Connecting with Google...');
    setTimeout(() => {
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?
      client_id=[YOUR_CLIENT_ID]&
      redirect_uri=[YOUR_REDIRECT_URI]&
      scope=[YOUR_SCOPES_SPACE_SEPARATED]&
      response_type=code&
      access_type=offline&
      state=[YOUR_CSRF_TOKEN]`
      

    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <LanguageSelector variant="compact" />
      </div>

      {/* Voice Button */}
      <VoiceButton 
        variant="floating"
        onCommand={handleVoiceCommand}
        autoGuide={true}
        guideText={t('audio.loginGuide')}
      />

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Educational Section - Left Side */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Come! Let's know about My Gullak
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-6">
              Your intelligent, voice-enabled savings companion for building a secure financial future
            </p>
          </div>

          {/* Supporting Image */}
          <div className="flex justify-center lg:justify-start mb-6">
            <img 
              src="/src/assets/gullak_img3.png" 
              alt="Gullak App Features" 
              className="w-64 h-64 object-contain rounded-lg shadow-soft"
            />
          </div>

          {/* App Features */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white mb-4">Key Features</h2>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">Goal-Based Savings</h3>
                  <p className="text-primary-foreground/80 text-sm">Set specific savings goals and track your progress with visual indicators</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">🎤</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">Voice Commands</h3>
                  <p className="text-primary-foreground/80 text-sm">Navigate the app hands-free with multilingual voice support</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">🛒</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">Smart Shopping Savings</h3>
                  <p className="text-primary-foreground/80 text-sm">Round up your purchases and automatically save the difference</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">🎁</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">Reward System</h3>
                  <p className="text-primary-foreground/80 text-sm">Earn points for consistent saving and achieve milestones</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">🌍</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">Multilingual Support</h3>
                  <p className="text-primary-foreground/80 text-sm">Available in English, Hindi, Marathi, Spanish, and German</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">🔒</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">Bank-Grade Security</h3>
                  <p className="text-primary-foreground/80 text-sm">Your data is protected with advanced encryption and secure authentication</p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Benefits */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Why Choose Gullak?</h3>
            <ul className="space-y-2 text-primary-foreground/90 text-sm">
              <li>• Build systematic saving habits with goal tracking</li>
              <li>• Earn interest on your savings with tier-based rewards</li>
              <li>• Access investment opportunities when goals are completed</li>
              <li>• Get personalized financial advice through AI chatbot</li>
              <li>• Enjoy seamless UPI integration for easy transactions</li>
            </ul>
          </div>
        </div>

        {/* Login Section - Right Side */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md shadow-large border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-soft">
              <img src="/src/assets/gullak_logo.png" alt="Gullak" className="h-14 w-14 object-contain" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {t('common.welcome')}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              {t('auth.welcomeBack')}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Google Login */}
          <Button 
            onClick={handleGoogleLogin}
            className="w-full btn-secondary"
            size="lg"
            aria-label={t('auth.loginWithGoogle')}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t('auth.loginWithGoogle')}
          </Button>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-3 text-sm text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {/* Email Login Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="sr-only">
                {t('auth.email')}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.email')}
                  className="pl-10 transition-smooth"
                  aria-label={t('auth.email')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="sr-only">
                {t('auth.password')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.password')}
                  className="pl-10 transition-smooth"
                  aria-label={t('auth.password')}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full btn-primary"
              size="lg"
              aria-label={t('auth.login')}
            >
              {t('auth.login')}
            </Button>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/register')}
              className="text-sm text-primary hover:text-primary-dark transition-smooth"
              aria-label={t('auth.dontHaveAccount')}
            >
              {t('auth.dontHaveAccount')}
            </button>
          </div>

          {/* Voice Instructions */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              Voice commands: "Login", "Register", "Help"
            </p>
            <VoiceButton 
              variant="mini"
              onCommand={handleVoiceCommand}
              className="mx-auto"
            />
          </div>
        </CardContent>
      </Card>
        </div>
      </div>

      {/* ChatBot */}
      <ChatBot isLoggedIn={false} />
    </div>
  );
};

export default LoginPage;