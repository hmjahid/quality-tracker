import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import WorkTypeCard from '../components/WorkTypeCard';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import { v4 as uuidv4 } from 'uuid';
import { useSettings } from '../SettingsContext';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
const STORAGE_KEY = 'workTypes';
const MainPage = () => {
    const { mandatorySteps } = useSettings();
    const [workTypes, setWorkTypes] = React.useState([]);
    const [newTitle, setNewTitle] = React.useState('');
    const [initialized, setInitialized] = React.useState(false);
    const theme = useTheme();
    const defaultWorkTypes = Object.keys(mandatorySteps);
    const [selectedDefault, setSelectedDefault] = React.useState(null);
    const [selectedSteps, setSelectedSteps] = React.useState([]);
    React.useEffect(() => {
        (async () => {
            const saved = await window.electronAPI.getStoreValue(STORAGE_KEY);
            setWorkTypes(saved && Array.isArray(saved) ? saved : []);
            setInitialized(true);
        })();
    }, []);
    React.useEffect(() => {
        if (initialized)
            window.electronAPI.setStoreValue(STORAGE_KEY, workTypes);
    }, [workTypes, initialized]);
    const handleAddWorkType = () => {
        if (!newTitle.trim())
            return;
        const stepsArr = selectedSteps.length > 0 ? selectedSteps : (mandatorySteps[newTitle.trim()] || []);
        const steps = stepsArr.map((label, idx) => ({
            id: `${newTitle.trim()}-step-${idx}`,
            label,
            completed: false,
            mandatory: true,
        }));
        setWorkTypes([
            ...workTypes,
            {
                id: uuidv4(),
                title: newTitle.trim(),
                steps,
            },
        ]);
        setNewTitle('');
        setSelectedDefault(null);
        setSelectedSteps([]);
    };
    const handleEditWorkType = (id, title) => {
        setWorkTypes(wt => wt.map(w => w.id === id ? { ...w, title } : w));
    };
    const handleDeleteWorkType = (id) => {
        setWorkTypes(wt => wt.filter(w => w.id !== id));
    };
    const handleStepToggle = (workTypeId, stepId) => {
        setWorkTypes(wt => wt.map(w => w.id === workTypeId ? {
            ...w,
            steps: w.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s),
        } : w));
    };
    const handleStepEdit = (workTypeId, stepId, label) => {
        setWorkTypes(wt => wt.map(w => w.id === workTypeId ? {
            ...w,
            steps: w.steps.map(s => s.id === stepId ? { ...s, label } : s),
        } : w));
    };
    const handleStepDelete = (workTypeId, stepId) => {
        setWorkTypes(wt => wt.map(w => w.id === workTypeId ? {
            ...w,
            steps: w.steps.filter(s => s.id !== stepId),
        } : w));
    };
    const handleAddStep = (workTypeId, label) => {
        setWorkTypes(wt => wt.map(w => w.id === workTypeId ? {
            ...w,
            steps: [
                ...w.steps,
                { id: uuidv4(), label, completed: false, mandatory: false },
            ],
        } : w));
    };
    const handleDeadlineChange = (workTypeId, deadline) => {
        setWorkTypes(wt => wt.map(w => w.id === workTypeId ? { ...w, deadline } : w));
    };
    const handleReorderSteps = (workTypeId, sourceIdx, destIdx) => {
        setWorkTypes(wt => wt.map(w => {
            if (w.id !== workTypeId)
                return w;
            const steps = Array.from(w.steps);
            const [removed] = steps.splice(sourceIdx, 1);
            steps.splice(destIdx, 0, removed);
            return { ...w, steps };
        }));
    };
    if (typeof window.electronAPI === 'undefined') {
        return _jsx(Box, { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", children: _jsx("span", { style: { color: 'red' }, children: "Error: electronAPI is not available. Please run in Electron." }) });
    }
    if (!initialized)
        return _jsx(Box, { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", children: _jsx(CircularProgress, {}) });
    return (_jsxs(Box, { children: [_jsxs(Box, { display: "flex", alignItems: "center", mb: 2, children: [_jsx(Autocomplete, { options: defaultWorkTypes, value: selectedDefault, onChange: (_, value) => {
                            setSelectedDefault(value);
                            if (value) {
                                setNewTitle(value);
                                setSelectedSteps(mandatorySteps[value] || []);
                            }
                            else {
                                setSelectedSteps([]);
                            }
                        }, sx: { width: 220, mr: 1 }, renderInput: (params) => (_jsx(TextField, { ...params, label: "Default Work Type", variant: "outlined", sx: {
                                backgroundColor: theme.palette.background.paper,
                                input: { color: theme.palette.text.primary },
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
                            } })) }), _jsx(TextField, { value: newTitle, onChange: (e) => setNewTitle(e.target.value), placeholder: "Add new work type", size: "small", variant: "outlined", sx: {
                            mr: 1,
                            backgroundColor: theme.palette.background.paper,
                            input: { color: theme.palette.text.primary },
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
                        } }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: handleAddWorkType, children: "Add Work Type" })] }), _jsx(Box, { display: "flex", flexWrap: "wrap", children: workTypes.map(wt => (_jsx(WorkTypeCard, { workType: wt, onEdit: handleEditWorkType, onDelete: handleDeleteWorkType, onStepToggle: handleStepToggle, onStepEdit: handleStepEdit, onStepDelete: handleStepDelete, onAddStep: handleAddStep, onDeadlineChange: handleDeadlineChange, onReorderSteps: handleReorderSteps }, wt.id))) })] }));
};
export default MainPage;
