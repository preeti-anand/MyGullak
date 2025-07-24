import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
}

interface VoiceCommand {
  pattern: RegExp;
  action: string;
  description: string;
}

export const useVoiceInteraction = () => {
  const { t, i18n } = useTranslation();
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    isSupported: false,
    transcript: '',
    error: null
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Voice commands for different languages
  const voiceCommands: Record<string, VoiceCommand[]> = {
    en: [
      { pattern: /add money|deposit|save money/i, action: 'ADD_MONEY', description: 'Add money to savings' },
      { pattern: /create goal|set goal|new goal/i, action: 'CREATE_GOAL', description: 'Create savings goal' },
      { pattern: /check balance|show balance|my savings/i, action: 'CHECK_BALANCE', description: 'Check current balance' },
      { pattern: /show rewards|my rewards|points/i, action: 'SHOW_REWARDS', description: 'Show reward points' },
      { pattern: /open settings|settings|preferences/i, action: 'OPEN_SETTINGS', description: 'Open settings' },
      { pattern: /dashboard|home|main/i, action: 'GO_DASHBOARD', description: 'Go to dashboard' },
      { pattern: /show charts|charts|analytics|graphs/i, action: 'SHOW_CHARTS', description: 'Show/hide charts' },
      { pattern: /help|commands|what can I say/i, action: 'SHOW_HELP', description: 'Show voice commands' },
      { pattern: /logout|sign out|exit/i, action: 'LOGOUT', description: 'Sign out' },
      { pattern: /savings shopping|shopping savings|round up/i, action: 'SAVINGS_SHOPPING', description: 'Open savings via shopping' },
      { pattern: /my transactions|transactions|transaction history/i, action: 'MY_TRANSACTIONS', description: 'View transaction history' },
      { pattern: /view rewards|my rewards|rewards/i, action: 'VIEW_REWARDS', description: 'View rewards and points' },
    ],
    es: [
      { pattern: /agregar dinero|depositar|ahorrar dinero/i, action: 'ADD_MONEY', description: 'Agregar dinero a ahorros' },
      { pattern: /crear objetivo|establecer objetivo|nuevo objetivo/i, action: 'CREATE_GOAL', description: 'Crear objetivo de ahorro' },
      { pattern: /verificar saldo|mostrar saldo|mis ahorros/i, action: 'CHECK_BALANCE', description: 'Verificar saldo actual' },
      { pattern: /mostrar recompensas|mis recompensas|puntos/i, action: 'SHOW_REWARDS', description: 'Mostrar puntos de recompensa' },
      { pattern: /abrir configuración|configuración|preferencias/i, action: 'OPEN_SETTINGS', description: 'Abrir configuración' },
      { pattern: /panel|inicio|principal/i, action: 'GO_DASHBOARD', description: 'Ir al panel' },
      { pattern: /mostrar gráficos|gráficos|analíticas|estadísticas/i, action: 'SHOW_CHARTS', description: 'Mostrar/ocultar gráficos' },
      { pattern: /ayuda|comandos|qué puedo decir/i, action: 'SHOW_HELP', description: 'Mostrar comandos de voz' },
      { pattern: /ahorros comprando|compras ahorros|redondear/i, action: 'SAVINGS_SHOPPING', description: 'Abrir ahorros vía compras' },
      { pattern: /mis transacciones|transacciones|historial de transacciones/i, action: 'MY_TRANSACTIONS', description: 'Ver historial de transacciones' },
      { pattern: /ver recompensas|mis recompensas|recompensas/i, action: 'VIEW_REWARDS', description: 'Ver recompensas y puntos' },
    ],
    de: [
      { pattern: /geld hinzufügen|einzahlen|geld sparen/i, action: 'ADD_MONEY', description: 'Geld zu Ersparnissen hinzufügen' },
      { pattern: /ziel erstellen|ziel setzen|neues ziel/i, action: 'CREATE_GOAL', description: 'Sparziel erstellen' },
      { pattern: /guthaben prüfen|guthaben zeigen|meine ersparnisse/i, action: 'CHECK_BALANCE', description: 'Aktuelles Guthaben prüfen' },
      { pattern: /belohnungen zeigen|meine belohnungen|punkte/i, action: 'SHOW_REWARDS', description: 'Belohnungspunkte zeigen' },
      { pattern: /einstellungen öffnen|einstellungen|präferenzen/i, action: 'OPEN_SETTINGS', description: 'Einstellungen öffnen' },
      { pattern: /dashboard|startseite|haupt/i, action: 'GO_DASHBOARD', description: 'Zum Dashboard gehen' },
      { pattern: /diagramme zeigen|diagramme|analytics|statistiken/i, action: 'SHOW_CHARTS', description: 'Diagramme anzeigen/verbergen' },
      { pattern: /hilfe|befehle|was kann ich sagen/i, action: 'SHOW_HELP', description: 'Sprachbefehle zeigen' },
      { pattern: /sparen beim einkaufen|einkaufs ersparnisse|aufrunden/i, action: 'SAVINGS_SHOPPING', description: 'Sparen beim Einkaufen öffnen' },
      { pattern: /meine transaktionen|transaktionen|transaktionshistorie/i, action: 'MY_TRANSACTIONS', description: 'Transaktionshistorie anzeigen' },
      { pattern: /belohnungen anzeigen|meine belohnungen|belohnungen/i, action: 'VIEW_REWARDS', description: 'Belohnungen und Punkte anzeigen' },
    ],
    mr: [
      { pattern: /पैसे जोडा|ठेव|पैसे वाचवा/i, action: 'ADD_MONEY', description: 'बचतीमध्ये पैसे जोडा' },
      { pattern: /लक्ष्य तयार करा|लक्ष्य सेट करा|नवीन लक्ष्य/i, action: 'CREATE_GOAL', description: 'बचत लक्ष्य तयार करा' },
      { pattern: /शिल्लक तपासा|शिल्लक दाखवा|माझी बचत/i, action: 'CHECK_BALANCE', description: 'सध्याची शिल्लक तपासा' },
      { pattern: /बक्षिसे दाखवा|माझी बक्षिसे|गुण/i, action: 'SHOW_REWARDS', description: 'बक्षीस गुण दाखवा' },
      { pattern: /सेटिंग्ज उघडा|सेटिंग्ज|प्राधान्ये/i, action: 'OPEN_SETTINGS', description: 'सेटिंग्ज उघडा' },
      { pattern: /डॅशबोर्ड|मुख्यपृष्ठ|मुख्य/i, action: 'GO_DASHBOARD', description: 'डॅशबोर्डवर जा' },
      { pattern: /चार्ट दाखवा|चार्ट|आकडेवारी|ग्राफ/i, action: 'SHOW_CHARTS', description: 'चार्ट दाखवा/लपवा' },
      { pattern: /मदत|आदेश|मी काय बोलू शकतो/i, action: 'SHOW_HELP', description: 'आवाज आदेश दाखवा' },
      { pattern: /खरेदीतून बचत|शॉपिंग बचत|राउंड अप/i, action: 'SAVINGS_SHOPPING', description: 'खरेदीतून बचत उघडा' },
      { pattern: /माझे व्यवहार|व्यवहार|व्यवहार इतिहास/i, action: 'MY_TRANSACTIONS', description: 'व्यवहार इतिहास पहा' },
      { pattern: /बक्षिसे पहा|माझी बक्षिसे|बक्षिसे/i, action: 'VIEW_REWARDS', description: 'बक्षिसे आणि गुण पहा' },
    ],
    hi: [
      { pattern: /पैसे जोड़ें|जमा करें|पैसे बचाएं/i, action: 'ADD_MONEY', description: 'बचत में पैसे जोड़ें' },
      { pattern: /लक्ष्य बनाएं|लक्ष्य सेट करें|नया लक्ष्य/i, action: 'CREATE_GOAL', description: 'बचत लक्ष्य बनाएं' },
      { pattern: /बैलेंस चेक करें|बैलेंस दिखाएं|मेरी बचत/i, action: 'CHECK_BALANCE', description: 'वर्तमान बैलेंस चेक करें' },
      { pattern: /रिवार्ड दिखाएं|मेरे रिवार्ड|पॉइंट्स/i, action: 'SHOW_REWARDS', description: 'रिवार्ड पॉइंट्स दिखाएं' },
      { pattern: /सेटिंग्स खोलें|सेटिंग्स|प्राथमिकताएं/i, action: 'OPEN_SETTINGS', description: 'सेटिंग्स खोलें' },
      { pattern: /डैशबोर्ड|होम|मुख्य/i, action: 'GO_DASHBOARD', description: 'डैशबोर्ड पर जाएं' },
      { pattern: /चार्ट दिखाएं|चार्ट|आंकड़े|ग्राफ/i, action: 'SHOW_CHARTS', description: 'चार्ट दिखाएं/छुपाएं' },
      { pattern: /मदद|कमांड्स|मैं क्या कह सकता हूं/i, action: 'SHOW_HELP', description: 'वॉयस कमांड्स दिखाएं' },
      { pattern: /शॉपिंग से बचत|खरीदारी बचत|राउंड अप/i, action: 'SAVINGS_SHOPPING', description: 'शॉपिंग से बचत खोलें' },
      { pattern: /मेरे लेनदेन|लेनदेन|लेनदेन इतिहास/i, action: 'MY_TRANSACTIONS', description: 'लेनदेन इतिहास देखें' },
      { pattern: /रिवार्ड देखें|मेरे रिवार्ड|रिवार्ड/i, action: 'VIEW_REWARDS', description: 'रिवार्ड और पॉइंट्स देखें' },
    ]
  };

  // Initialize speech recognition and synthesis
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;

    if (SpeechRecognition && SpeechSynthesis) {
      setVoiceState(prev => ({ ...prev, isSupported: true }));
      synthRef.current = SpeechSynthesis;
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = i18n.language === 'mr' ? 'mr-IN' : 
                        i18n.language === 'hi' ? 'hi-IN' :
                        i18n.language === 'es' ? 'es-ES' :
                        i18n.language === 'de' ? 'de-DE' : 'en-US';

      recognition.onstart = () => {
        setVoiceState(prev => ({ ...prev, isListening: true, error: null }));
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setVoiceState(prev => ({ ...prev, transcript }));
      };

      recognition.onend = () => {
        setVoiceState(prev => ({ 
          ...prev, 
          isListening: false, 
          isProcessing: false 
        }));
      };

      recognition.onerror = (event) => {
        setVoiceState(prev => ({ 
          ...prev, 
          isListening: false, 
          isProcessing: false,
          error: event.error 
        }));
      };

      recognitionRef.current = recognition;
    }
  }, [i18n.language]);

  // Start listening for voice commands
  const startListening = useCallback(() => {
    if (recognitionRef.current && !voiceState.isListening) {
      setVoiceState(prev => ({ ...prev, transcript: '', error: null }));
      recognitionRef.current.start();
    }
  }, [voiceState.isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && voiceState.isListening) {
      recognitionRef.current.stop();
    }
  }, [voiceState.isListening]);

  // Process voice commands
  const processCommand = useCallback((transcript: string): string | null => {
    const currentCommands = voiceCommands[i18n.language] || voiceCommands.en;
    
    for (const command of currentCommands) {
      if (command.pattern.test(transcript)) {
        setVoiceState(prev => ({ ...prev, isProcessing: false }));
        return command.action;
      }
    }
    
    setVoiceState(prev => ({ ...prev, isProcessing: false }));
    return null;
  }, [i18n.language]);

  // Speak text using TTS
  const speak = useCallback((text: string, lang?: string) => {
    if (synthRef.current) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang || 
                      (i18n.language === 'mr' ? 'mr-IN' : 
                       i18n.language === 'hi' ? 'hi-IN' :
                       i18n.language === 'es' ? 'es-ES' :
                       i18n.language === 'de' ? 'de-DE' : 'en-US');
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      synthRef.current.speak(utterance);
    }
  }, [i18n.language]);

  // Stop current speech
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, []);

  // Get available voice commands for current language
  const getAvailableCommands = useCallback(() => {
    return voiceCommands[i18n.language] || voiceCommands.en;
  }, [i18n.language]);

  // Effect to process completed transcripts
  useEffect(() => {
    if (voiceState.transcript && !voiceState.isListening && !voiceState.isProcessing) {
      const command = processCommand(voiceState.transcript);
      if (command) {
        // Command will be handled by the consuming component
        console.log('Voice command detected:', command, voiceState.transcript);
      }
    }
  }, [voiceState.transcript, voiceState.isListening, voiceState.isProcessing, processCommand]);

  return {
    voiceState,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    processCommand,
    getAvailableCommands
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}