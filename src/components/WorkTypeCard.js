import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTheme } from '@mui/material/styles';
const StepLabel = styled('span')(({ mandatory, theme }) => ({
    fontWeight: mandatory ? 'bold' : 'normal',
    color: mandatory ? theme.palette.primary.main : 'inherit',
    marginLeft: 8,
}));
const WorkTypeCard = ({ workType, onEdit, onDelete, onStepToggle, onStepEdit, onStepDelete, onAddStep, onDeadlineChange, onReorderSteps, }) => {
    const [editingTitle, setEditingTitle] = React.useState(false);
    const [title, setTitle] = React.useState(workType.title);
    const [newStep, setNewStep] = React.useState('');
    const [editingStepId, setEditingStepId] = React.useState(null);
    const [editingStepLabel, setEditingStepLabel] = React.useState('');
    const theme = useTheme();
    const completed = workType.steps.filter((s) => s.completed).length;
    const total = workType.steps.length;
    const progress = total ? (completed / total) * 100 : 0;
    const allMandatoryComplete = workType.steps.filter(s => s.mandatory).every(s => s.completed);
    const handleDragEnd = (result) => {
        if (!result.destination)
            return;
        if (result.source.index === result.destination.index)
            return;
        onReorderSteps(workType.id, result.source.index, result.destination.index);
    };
    return (_jsxs(Card, { sx: { minWidth: 350, maxWidth: 400, m: 2, position: 'relative', border: allMandatoryComplete ? '2px solid green' : '2px solid orange' }, children: [_jsx(CardHeader, { title: editingTitle ? (_jsx(TextField, { value: title, onChange: e => setTitle(e.target.value), onBlur: () => { setEditingTitle(false); onEdit(workType.id, title); }, onKeyDown: e => { if (e.key === 'Enter') {
                        setEditingTitle(false);
                        onEdit(workType.id, title);
                    } }, size: "small", autoFocus: true, variant: "outlined", sx: {
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
                    } })) : (_jsx("span", { onClick: () => setEditingTitle(true), style: { cursor: 'pointer', display: 'block', paddingBottom: 16, fontSize: 28, fontWeight: 700 }, children: workType.title })), subheader: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }, children: [
            _jsxs("label", { style: { fontSize: 18, color: theme.palette.text.secondary, fontWeight: 600 }, children: ["Task Start Date:", _jsx(TextField, { type: "date", size: "medium", value: workType.startDate || '', onChange: e => onEdit(workType.id, 'startDate', e.target.value), InputLabelProps: { shrink: true }, variant: "outlined", sx: {
                        ml: 1,
                        fontSize: 16,
                        input: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 600 },
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
                    } })] }),
            _jsxs("label", { style: { fontSize: 18, color: theme.palette.text.secondary, fontWeight: 600 }, children: ["Deadline:", _jsx(TextField, { type: "date", size: "medium", value: workType.deadline || '', onChange: e => onDeadlineChange(workType.id, e.target.value), InputLabelProps: { shrink: true }, variant: "outlined", sx: {
                        ml: 1,
                        fontSize: 16,
                        input: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 600 },
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
                    } })] })
        ] }), action: _jsx(IconButton, { onClick: () => onDelete(workType.id), children: _jsx(DeleteIcon, {}) }) }), _jsxs(CardContent, { children: [_jsx(LinearProgress, { variant: "determinate", value: progress, sx: { mb: 2 } }), _jsx(Typography, { variant: "body2", color: allMandatoryComplete ? 'green' : 'orange', children: allMandatoryComplete ? 'All mandatory steps complete' : 'Mandatory steps incomplete' }), _jsx(DragDropContext, { onDragEnd: handleDragEnd, children: _jsx(Droppable, { droppableId: `droppable-${workType.id}`, children: (provided) => (_jsxs("ul", { ref: provided.innerRef, ...provided.droppableProps, style: { paddingLeft: 0, listStyle: 'none' }, children: [workType.steps.map((step, idx) => (_jsx(Draggable, { draggableId: step.id, index: idx, children: (provided, snapshot) => (_jsxs("li", { ref: provided.innerRef, ...provided.draggableProps, ...provided.dragHandleProps, style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginBottom: 4,
                                                background: snapshot.isDragging ? '#f0f0f0' : undefined,
                                                ...provided.draggableProps.style,
                                            }, children: [_jsx(Checkbox, { checked: step.completed, onChange: () => onStepToggle(workType.id, step.id), color: step.mandatory ? 'primary' : 'default' }), editingStepId === step.id ? (_jsx(TextField, { value: editingStepLabel, onChange: e => setEditingStepLabel(e.target.value), onBlur: () => { onStepEdit(workType.id, step.id, editingStepLabel); setEditingStepId(null); }, onKeyDown: e => { if (e.key === 'Enter') {
                                                        onStepEdit(workType.id, step.id, editingStepLabel);
                                                        setEditingStepId(null);
                                                    } }, size: "small", autoFocus: true, variant: "outlined", sx: {
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
                                                    } })) : (_jsx(StepLabel, { mandatory: step.mandatory, onClick: () => { setEditingStepId(step.id); setEditingStepLabel(step.label); }, style: { cursor: 'pointer' }, children: step.label })), _jsx(IconButton, { size: "small", onClick: () => onStepDelete(workType.id, step.id), children: _jsx(DeleteIcon, { fontSize: "small" }) })] })) }, step.id))), provided.placeholder] })) }) }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', marginTop: 8 }, children: [_jsx(TextField, { value: newStep, onChange: e => setNewStep(e.target.value), size: "small", placeholder: "Add step", onKeyDown: e => { if (e.key === 'Enter' && newStep.trim()) {
                                    onAddStep(workType.id, newStep.trim());
                                    setNewStep('');
                                } }, variant: "outlined", sx: {
                                    flex: 1,
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
                                } }), _jsx(IconButton, { onClick: () => { if (newStep.trim()) {
                                    onAddStep(workType.id, newStep.trim());
                                    setNewStep('');
                                } }, children: _jsx(AddIcon, {}) })] })] })] }));
};
export default WorkTypeCard;
