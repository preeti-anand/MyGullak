import React, { useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  onCommand?: (command: string, transcript: string) => void;
  className?: string;
  variant?: 'default' | 'floating' | 'mini';
  autoGuide?: boolean;
  guideText?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onCommand,
  className,
  variant = 'default',
  autoGuide = false,
  guideText
}) => {
  const { t } = useTranslation();
  const { 
    voiceState, 
    startListening, 
    stopListening, 
    speak, 
    processCommand 
  } = useVoiceInteraction();

  // Handle voice command processing
  useEffect(() => {
    if (voiceState.transcript && !voiceState.isListening && !voiceState.isProcessing) {
      const command = processCommand(voiceState.transcript);
      if (command && onCommand) {
        onCommand(command, voiceState.transcript);
      }
    }
  }, [voiceState.transcript, voiceState.isListening, voiceState.isProcessing, processCommand, onCommand]);

  // Auto-speak guide text when component mounts
  useEffect(() => {
    if (autoGuide && guideText) {
      const timer = setTimeout(() => {
        speak(guideText);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoGuide, guideText, speak]);

  const handleVoiceToggle = () => {
    if (voiceState.isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getButtonContent = () => {
    if (voiceState.isListening) {
      return (
        <>
          <MicOff className="h-4 w-4" />
          {variant !== 'mini' && (
            <span className="ml-2">{t('voice.listening')}</span>
          )}
        </>
      );
    } else if (voiceState.isProcessing) {
      return (
        <>
          <Volume2 className="h-4 w-4 animate-pulse" />
          {variant !== 'mini' && (
            <span className="ml-2">{t('voice.processing')}</span>
          )}
        </>
      );
    } else {
      return (
        <>
          <Mic className="h-4 w-4" />
          {variant !== 'mini' && (
            <span className="ml-2">{t('voice.tapToSpeak')}</span>
          )}
        </>
      );
    }
  };

  const getButtonClasses = () => {
    const baseClasses = "btn-voice transition-smooth";
    
    switch (variant) {
      case 'floating':
        return cn(
          baseClasses,
          "fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-large z-50",
          voiceState.isListening && "voice-listening",
          className
        );
      case 'mini':
        return cn(
          baseClasses,
          "w-10 h-10 rounded-full p-0",
          voiceState.isListening && "voice-listening",
          className
        );
      default:
        return cn(
          baseClasses,
          "px-6 py-3",
          voiceState.isListening && "voice-listening voice-pulse",
          className
        );
    }
  };

  if (!voiceState.isSupported) {
    return null;
  }

  return (
    <Button
      onClick={handleVoiceToggle}
      className={getButtonClasses()}
      disabled={voiceState.isProcessing}
      aria-label={
        voiceState.isListening 
          ? t('voice.listening')
          : voiceState.isProcessing 
          ? t('voice.processing')
          : t('voice.tapToSpeak')
      }
      role="button"
      aria-pressed={voiceState.isListening}
    >
      {getButtonContent()}
    </Button>
  );
};

export default VoiceButton;