import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useThemeMode } from '../ThemeContext';
import { useSettings } from '../SettingsContext';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import InputAdornment from '@mui/material/InputAdornment';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
const SettingsPage = () => {
    const { mode, setMode } = useThemeMode();
    const { mandatorySteps, updateStepsForType, notification, setNotification } = useSettings();
    const { setMandatorySteps } = useSettings();
    const [editing, setEditing] = useState({});
    const [newStep, setNewStep] = useState({});
    const [newType, setNewType] = useState('');
    const [editingType, setEditingType] = useState(null);
    const [editingTypeName, setEditingTypeName] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const theme = useTheme();
    // Debug log for context state
    console.log("mandatorySteps in SettingsPage:", mandatorySteps);
    const handleEdit = (type, idx, value) => {
        setEditing(e => ({ ...e, [type]: e[type].map((s, i) => (i === idx ? value : s)) }));
    };
    const handleSave = (type) => {
        updateStepsForType(type, editing[type]);
        setEditing(e => {
            const { [type]: _, ...rest } = e;
            return rest;
        });
    };
    const handleStartEdit = (type) => {
        setEditing(e => ({ ...e, [type]: [...mandatorySteps[type]] }));
    };
    const handleCancelEdit = (type) => {
        setEditing(e => {
            const { [type]: _, ...rest } = e;
            return rest;
        });
    };
    const handleAddStep = (type) => {
        if (!newStep[type]?.trim())
            return;
        setEditing(e => ({ ...e, [type]: [...(e[type] || mandatorySteps[type]), newStep[type].trim()] }));
        setNewStep(n => ({ ...n, [type]: '' }));
    };
    const handleDeleteStep = (type, idx) => {
        setEditing(e => ({ ...e, [type]: e[type].filter((_, i) => i !== idx) }));
    };
    const handleAddType = () => {
        const type = newType.trim();
        if (!type || mandatorySteps[type])
            return;
        updateStepsForType(type, []);
        setNewType('');
        setSnackbarOpen(true);
    };
    const handleEditType = (oldType) => {
        if (!editingTypeName.trim() || mandatorySteps[editingTypeName])
            return;
        const steps = mandatorySteps[oldType];
        const newMandatorySteps = { ...mandatorySteps };
        delete newMandatorySteps[oldType];
        newMandatorySteps[editingTypeName.trim()] = steps;
        setEditingType(null);
        setEditingTypeName('');
        setMandatorySteps(newMandatorySteps);
    };
    const handleDeleteType = (type) => {
        const newMandatorySteps = { ...mandatorySteps };
        delete newMandatorySteps[type];
        setMandatorySteps(newMandatorySteps);
    };
    // Data Export/Import
    const handleExport = async () => {
        const keys = [
            'mandatorySteps',
            'notification',
            'fontSize',
            'workTypes',
            'themeMode',
        ];
        const data = {};
        for (const key of keys) {
            data[key] = await window.electronAPI.getStoreValue(key);
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qualitytracker-backup.json';
        a.click();
        URL.revokeObjectURL(url);
    };
    const handleImport = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const imported = JSON.parse(event.target?.result);
                if (typeof imported === 'object' && imported !== null) {
                    for (const key of Object.keys(imported)) {
                        await window.electronAPI.setStoreValue(key, imported[key]);
                    }
                    window.location.reload();
                }
            }
            catch (err) {
                alert('Invalid backup file.');
            }
        };
        reader.readAsText(file);
    };
    return (_jsxs("div", { children: [_jsx("h2", { children: "Settings" }), _jsxs(FormControl, { component: "fieldset", sx: { mb: 3 }, children: [_jsx(FormLabel, { component: "legend", children: "Theme" }), _jsxs(RadioGroup, { row: true, value: mode, onChange: e => setMode(e.target.value), children: [_jsx(FormControlLabel, { value: "system", control: _jsx(Radio, {}), label: "System Default" }), _jsx(FormControlLabel, { value: "light", control: _jsx(Radio, {}), label: "Light" }), _jsx(FormControlLabel, { value: "dark", control: _jsx(Radio, {}), label: "Dark" })] })] }), _jsx("h3", { children: "Default Work Types" }), _jsxs(Box, { display: "flex", alignItems: "center", mb: 2, children: [_jsx(TextField, { value: newType, onChange: e => setNewType(e.target.value), size: "small", placeholder: "Add new work type name", variant: "outlined", sx: {
                            mr: 1,
                            input: { color: theme.palette.text.primary },
                            backgroundColor: theme.palette.background.paper,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.palette.divider,
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                        } }), _jsx(Button, { variant: "contained", onClick: handleAddType, children: "Add" })] }), _jsx(Box, { display: "flex", flexWrap: "wrap", gap: 2, children: Object.keys(mandatorySteps).map(type => (_jsxs(Card, { sx: { minWidth: 300, maxWidth: 350, mb: 2, background: theme.palette.mode === 'dark' ? '#222' : '#fafafa', border: `2px solid ${theme.palette.primary.main}` }, children: [_jsx(CardHeader, { title: editingType === type ? (_jsxs(Box, { display: "flex", alignItems: "center", children: [_jsx(TextField, { value: editingTypeName, onChange: e => setEditingTypeName(e.target.value), size: "small", variant: "outlined", sx: {
                                            input: { color: theme.palette.text.primary },
                                            backgroundColor: theme.palette.background.paper,
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: theme.palette.divider,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                            },
                                        } }), _jsx(Button, { size: "small", onClick: () => handleEditType(type), sx: { ml: 1 }, children: "Save" }), _jsx(Button, { size: "small", onClick: () => setEditingType(null), sx: { ml: 1 }, children: "Cancel" })] })) : (_jsxs(Box, { display: "flex", alignItems: "center", children: [_jsx("span", { style: { fontWeight: 600, fontSize: 18 }, children: type }), _jsx(IconButton, { size: "small", onClick: () => { setEditingType(type); setEditingTypeName(type); }, children: _jsx(EditIcon, {}) }), _jsx(IconButton, { size: "small", onClick: () => handleDeleteType(type), children: _jsx(DeleteIcon, {}) })] })) }), _jsx(CardContent, { children: editing[type] ? (_jsxs(_Fragment, { children: [_jsx("ul", { style: { paddingLeft: 0, listStyle: 'none' }, children: editing[type].map((step, idx) => (_jsxs("li", { style: { display: 'flex', alignItems: 'center', marginBottom: 4 }, children: [_jsx(TextField, { value: step, onChange: e => handleEdit(type, idx, e.target.value), size: "small", variant: "outlined", sx: {
                                                        mr: 1,
                                                        input: { color: theme.palette.text.primary },
                                                        backgroundColor: theme.palette.background.paper,
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: theme.palette.divider,
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: theme.palette.primary.main,
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: theme.palette.primary.main,
                                                            },
                                                        },
                                                    } }), _jsx(IconButton, { size: "small", onClick: () => handleDeleteStep(type, idx), children: _jsx(DeleteIcon, { fontSize: "small" }) })] }, idx))) }), _jsxs(Box, { display: "flex", alignItems: "center", mb: 1, children: [_jsx(TextField, { value: newStep[type] || '', onChange: e => setNewStep(n => ({ ...n, [type]: e.target.value })), size: "small", placeholder: "Add step", variant: "outlined", sx: {
                                                    mr: 1,
                                                    input: { color: theme.palette.text.primary },
                                                    backgroundColor: theme.palette.background.paper,
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: theme.palette.divider,
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: theme.palette.primary.main,
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: theme.palette.primary.main,
                                                        },
                                                    },
                                                } }), _jsx(IconButton, { onClick: () => handleAddStep(type), children: _jsx(AddIcon, {}) })] }), _jsx(Button, { variant: "contained", size: "small", onClick: () => handleSave(type), sx: { mr: 1 }, children: "Save" }), _jsx(Button, { variant: "outlined", size: "small", onClick: () => handleCancelEdit(type), children: "Cancel" })] })) : (_jsxs(_Fragment, { children: [_jsx("ul", { style: { paddingLeft: 0, listStyle: 'none' }, children: mandatorySteps[type].map((step, idx) => (_jsx("li", { children: step }, idx))) }), _jsx(Button, { variant: "outlined", size: "small", onClick: () => handleStartEdit(type), children: "Edit Steps" })] })) })] }, type))) }), _jsx("h3", { children: "Notification Preferences" }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: notification.enabled, onChange: e => setNotification({ ...notification, enabled: e.target.checked }) }), label: "Enable deadline reminders" }), _jsx(TextField, { type: "number", label: "Remind me before (hours)", value: notification.hoursBefore, onChange: e => setNotification({ ...notification, hoursBefore: Math.max(1, Number(e.target.value)) }), InputProps: { endAdornment: _jsx(InputAdornment, { position: "end", children: "hours" }) }, disabled: !notification.enabled, size: "small", variant: "outlined", sx: { width: 200, ml: 2, backgroundColor: theme.palette.background.paper, input: { color: theme.palette.text.primary } } }), _jsx("h3", { children: "Data Export / Import" }), _jsx(Button, { variant: "outlined", startIcon: _jsx(FileDownloadIcon, {}), onClick: handleExport, sx: { mr: 2 }, children: "Export Data" }), _jsxs(Button, { variant: "outlined", component: "label", startIcon: _jsx(FileUploadIcon, {}), children: ["Import Data", _jsx("input", { type: "file", accept: "application/json", hidden: true, onChange: handleImport })] }), _jsx("p", { children: "Theme, default steps, notifications, and more settings will appear here." }), _jsx(Snackbar, { open: snackbarOpen, autoHideDuration: 2000, onClose: () => setSnackbarOpen(false), message: "Default work type added!" })] }));
};
export default SettingsPage;
