import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_MANDATORY_STEPS } from './utils/defaults';
const defaultNotification = {
    enabled: false,
    hoursBefore: 24,
};
const defaultFontSize = 'medium';
const SettingsContext = createContext({
    mandatorySteps: DEFAULT_MANDATORY_STEPS,
    setMandatorySteps: () => { },
    updateStepsForType: () => { },
    notification: defaultNotification,
    setNotification: () => { },
    fontSize: defaultFontSize,
    setFontSize: () => { },
});
export const useSettings = () => useContext(SettingsContext);
export const SettingsProvider = ({ children }) => {
    console.log("SettingsProvider mounted");
    const [mandatorySteps, setMandatorySteps] = useState(DEFAULT_MANDATORY_STEPS);
    const [notification, setNotification] = useState(defaultNotification);
    const [fontSize, setFontSize] = useState(defaultFontSize);
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
        if (initialized)
            window.electronAPI.setStoreValue('mandatorySteps', mandatorySteps);
    }, [mandatorySteps, initialized]);
    useEffect(() => {
        if (initialized)
            window.electronAPI.setStoreValue('notification', notification);
    }, [notification, initialized]);
    useEffect(() => {
        if (initialized)
            window.electronAPI.setStoreValue('fontSize', fontSize);
    }, [fontSize, initialized]);
    const updateStepsForType = (type, steps) => {
        setMandatorySteps(prev => ({ ...prev, [type]: steps }));
    };
    if (!initialized)
        return null;
    return (_jsx(SettingsContext.Provider, { value: { mandatorySteps, setMandatorySteps, updateStepsForType, notification, setNotification, fontSize, setFontSize }, children: children }));
};
