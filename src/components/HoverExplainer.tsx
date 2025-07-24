import React, { useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';

interface HoverExplainerProps {
  children: React.ReactNode;
  explanation: string;
  value?: string | number;
  className?: string;
}

const HoverExplainer: React.FC<HoverExplainerProps> = ({ 
  children, 
  explanation, 
  value, 
  className = '' 
}) => {
  const { t } = useTranslation();
  const { speak } = useVoiceInteraction();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      let message = explanation;
      if (value !== undefined) {
        message += `. Current value is ${value}`;
      }
      speak(message);
    }, 800); // 800ms delay for hover
  }, [explanation, value, speak]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleFocus = useCallback(() => {
    let message = explanation;
    if (value !== undefined) {
      message += `. Current value is ${value}`;
    }
    speak(message);
  }, [explanation, value, speak]);

  return (
    <div
      className={`hover-explainer ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      aria-label={explanation}
    >
      {children}
    </div>
  );
};

export default HoverExplainer;