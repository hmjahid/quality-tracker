import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_MANDATORY_STEPS } from './utils/defaults';

export type MandatoryStepsConfig = Record<string, string[]>;
export interface NotificationSettings {
  enabled: boolean;
  hoursBefore: number;
}
export type FontSize = 'small' | 'medium' | 'large';

declare global {
  interface Window {
    electronAPI: {
      getStoreValue: (key: string) => Promise<any>;
      setStoreValue: (key: string, value: any) => Promise<void>;
    };
  }
}

interface SettingsContextProps {
  mandatorySteps: MandatoryStepsConfig;
  setMandatorySteps: (steps: MandatoryStepsConfig) => void;
  updateStepsForType: (type: string, steps: string[]) => void;
  notification: NotificationSettings;
  setNotification: (settings: NotificationSettings) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const defaultNotification: NotificationSettings = {
  enabled: false,
  hoursBefore: 24,
};
const defaultFontSize: FontSize = 'medium';

const SettingsContext = createContext<SettingsContextProps>({
  mandatorySteps: DEFAULT_MANDATORY_STEPS,
  setMandatorySteps: () => {},
  updateStepsForType: () => {},
  notification: defaultNotification,
  setNotification: () => {},
  fontSize: defaultFontSize,
  setFontSize: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("SettingsProvider mounted");
  const [mandatorySteps, setMandatorySteps] = useState<MandatoryStepsConfig>(DEFAULT_MANDATORY_STEPS);
  const [notification, setNotification] = useState<NotificationSettings>(defaultNotification);
  const [fontSize, setFontSize] = useState<FontSize>(defaultFontSize);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      const ms = await window.electronAPI.getStoreValue('mandatorySteps');
      const notif = await window.electronAPI.getStoreValue('notification');
      const fs = await window.electronAPI.getStoreValue('fontSize');
      setMandatorySteps(ms || DEFAULT_MANDATORY_STEPS);
      setNotification(notif || defaultNotification);
      setFontSize(fs || defaultFontSize);
      setInitialized(true);
    })();
  }, []);

  useEffect(() => {
    if (initialized) window.electronAPI.setStoreValue('mandatorySteps', mandatorySteps);
  }, [mandatorySteps, initialized]);
  useEffect(() => {
    if (initialized) window.electronAPI.setStoreValue('notification', notification);
  }, [notification, initialized]);
  useEffect(() => {
    if (initialized) window.electronAPI.setStoreValue('fontSize', fontSize);
  }, [fontSize, initialized]);

  const updateStepsForType = (type: string, steps: string[]) => {
    setMandatorySteps(prev => ({ ...prev, [type]: steps }));
  };

  if (!initialized) return null;

  return (
    <SettingsContext.Provider value={{ mandatorySteps, setMandatorySteps, updateStepsForType, notification, setNotification, fontSize, setFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
}; 