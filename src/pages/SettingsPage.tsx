import React, { useState } from 'react';
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
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const CARD_ORDER_KEY = 'workTypeOrder';
const getStepOrderKey = (type: string) => `stepOrder_${type}`;

const SettingsPage = () => {
    const { mode, setMode } = useThemeMode();
    const { mandatorySteps, updateStepsForType, notification, setNotification } = useSettings();
    const { setMandatorySteps } = useSettings();
    const [editing, setEditing] = useState<{ [type: string]: string[] }>({});
    const [newStep, setNewStep] = useState<{ [type: string]: string }>({});
    const [newType, setNewType] = useState('');
    const [editingType, setEditingType] = useState<string | null>(null);
    const [editingTypeName, setEditingTypeName] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [stepAddedSnackbar, setStepAddedSnackbar] = useState(false);
    const theme = useTheme();

    // Card order state
    const [workTypeOrder, setWorkTypeOrder] = useState<string[]>([]);
    // Remove stepOrders from state and logic

    // Load card order on mount or when mandatorySteps changes
    React.useEffect(() => {
        (async () => {
            // Card order
            const savedOrder = await window.electronAPI.getStoreValue(CARD_ORDER_KEY);
            if (savedOrder && Array.isArray(savedOrder)) {
                setWorkTypeOrder(savedOrder);
            } else {
                setWorkTypeOrder(Object.keys(mandatorySteps));
            }
        })();
    }, [mandatorySteps]);

    // Save card order
    const saveCardOrder = (order: string[]) => {
        setWorkTypeOrder(order);
        window.electronAPI.setStoreValue(CARD_ORDER_KEY, order);
    };

    // Save step order for a type
    const saveStepOrder = (type: string, order: number[]) => {
        // This function is no longer needed as stepOrders state is removed
        // setStepOrders(prev => ({ ...prev, [type]: order }));
        window.electronAPI.setStoreValue(getStepOrderKey(type), order);
    };

    // Track which type is being edited for step drag
    const [stepDragType, setStepDragType] = useState<string | null>(null);

    // Unified drag end handler
    const handleDragEnd = (result: DropResult) => {
        const { source, destination, type } = result;
        if (!destination || source.index === destination.index) return;
        if (result.type === 'CARD') {
            setWorkTypeOrder(prev => {
                const arr = Array.from(prev);
                const [removed] = arr.splice(source.index, 1);
                arr.splice(destination.index, 0, removed);
                saveCardOrder(arr);
                return arr;
            });
        } else if (result.type && result.type.startsWith('STEP-')) {
            const stepType = result.type.replace('STEP-', '');
            setEditing(e => {
                const arr = Array.from(e[stepType] || mandatorySteps[stepType]);
                const [removed] = arr.splice(source.index, 1);
                arr.splice(destination.index, 0, removed);
                return { ...e, [stepType]: arr };
            });
        }
    };

    const handleEdit = (type: string, idx: number, value: string) => {
        setEditing(e => ({ ...e, [type]: e[type].map((s, i) => (i === idx ? value : s)) }));
    };

    const handleSave = (type: string) => {
        updateStepsForType(type, editing[type]);
        setEditing(e => {
            const { [type]: _, ...rest } = e;
            return rest;
        });
    };

    const handleStartEdit = (type: string) => {
        setEditing(e => ({ ...e, [type]: [...mandatorySteps[type]] }));
    };

    const handleCancelEdit = (type: string) => {
        setEditing(e => {
            const { [type]: _, ...rest } = e;
            return rest;
        });
    };

    const handleAddStep = (type: string) => {
        if (!newStep[type]?.trim()) return;
        setEditing(e => ({ ...e, [type]: [...(e[type] || mandatorySteps[type]), newStep[type].trim()] }));
        setNewStep(n => ({ ...n, [type]: '' }));
        setStepAddedSnackbar(true);
    };

    const handleDeleteStep = (type: string, idx: number) => {
        setEditing(e => ({ ...e, [type]: e[type].filter((_, i) => i !== idx) }));
    };

    const handleAddType = () => {
        const type = newType.trim();
        if (!type || mandatorySteps[type]) return;
        updateStepsForType(type, []);
        setNewType('');
        setSnackbarOpen(true);
    };
    const handleEditType = (oldType: string) => {
        if (!editingTypeName.trim() || mandatorySteps[editingTypeName]) return;
        const steps = mandatorySteps[oldType];
        const newMandatorySteps = { ...mandatorySteps };
        delete newMandatorySteps[oldType];
        newMandatorySteps[editingTypeName.trim()] = steps;
        setEditingType(null);
        setEditingTypeName('');
        setMandatorySteps(newMandatorySteps);
    };
    const handleDeleteType = (type: string) => {
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
        const data: { [key: string]: any } = {};
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
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const imported = JSON.parse(event.target?.result as string);
                if (typeof imported === 'object' && imported !== null) {
                    for (const key of Object.keys(imported)) {
                        await window.electronAPI.setStoreValue(key, imported[key]);
                    }
                    window.location.reload();
                }
            } catch (err) {
                alert('Invalid backup file.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <h2>Settings</h2>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">Theme</FormLabel>
                <RadioGroup row value={mode} onChange={e => setMode(e.target.value as any)}>
                    <FormControlLabel value="system" control={<Radio />} label="System Default" />
                    <FormControlLabel value="light" control={<Radio />} label="Light" />
                    <FormControlLabel value="dark" control={<Radio />} label="Dark" />
                </RadioGroup>
            </FormControl>
            <h3>Default Work Types</h3>
            <Box display="flex" alignItems="center" mb={2}>
                <TextField
                    value={newType}
                    onChange={e => setNewType(e.target.value)}
                    placeholder="Add new work type"
                    size="small"
                    variant="outlined"
                    sx={{
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
                    }}
                />
                <Button variant="contained" onClick={handleAddType}>Add</Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={2}>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="workTypeCards" direction="horizontal" type="CARD">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start', minHeight: 350 }}>
                                {workTypeOrder.map((type, idx) => (
                                    <Draggable key={type} draggableId={type} index={idx}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    opacity: snapshot.isDragging ? 0.7 : 1,
                                                    minWidth: 300,
                                                    maxWidth: 350,
                                                    marginBottom: 16,
                                                }}
                                            >
                                                <Card sx={{ minWidth: 300, maxWidth: 350, mb: 2, background: theme.palette.mode === 'dark' ? '#222' : '#fafafa', border: `2px solid ${theme.palette.primary.main}` }}>
                                                    <CardHeader
                                                        title={editingType === type ? (
                                                            <Box display="flex" alignItems="center" {...provided.dragHandleProps}>
                                                                <TextField
                                                                    value={editingTypeName}
                                                                    onChange={e => setEditingTypeName(e.target.value)}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{
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
                                                                    }}
                                                                />
                                                                <Button size="small" onClick={() => handleEditType(type)} sx={{ ml: 1 }}>Save</Button>
                                                                <Button size="small" onClick={() => setEditingType(null)} sx={{ ml: 1 }}>Cancel</Button>
                                                            </Box>
                                                        ) :
                                                            <Box display="flex" alignItems="center" {...provided.dragHandleProps}>
                                                                <span style={{ fontWeight: 700, fontSize: 24 }}>{type}</span>
                                                                <IconButton size="small" onClick={() => { setEditingType(type); setEditingTypeName(type); }}><EditIcon /></IconButton>
                                                                <IconButton size="small" onClick={() => handleDeleteType(type)}><DeleteIcon /></IconButton>
                                                            </Box>
                                                        }
                                                    />
                                                    <CardContent>
                                                        {editing[type] ? (
                                                            <Droppable droppableId={`steps-${type}`} type={`STEP-${type}`}>
                                                                {(provided) => (
                                                                    <ul ref={provided.innerRef} {...provided.droppableProps} style={{ paddingLeft: 20, listStyle: 'disc', minHeight: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                                                        {(editing[type] || mandatorySteps[type]).map((step, idx) => (
                                                                            <Draggable key={`${type}-step-${idx}`} draggableId={`${type}-step-${idx}`} index={idx}>
                                                                                {(provided, snapshot) => (
                                                                                    <li
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            marginBottom: 18,
                                                                                            background: snapshot.isDragging ? '#e3f2fd' : theme.palette.mode === 'dark' ? '#23272f' : '#f5f7fa',
                                                                                            borderRadius: 8,
                                                                                            boxShadow: snapshot.isDragging ? '0 2px 8px rgba(25, 118, 210, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                                                                                            padding: '12px 18px',
                                                                                            fontSize: 22,
                                                                                            transition: 'background 0.2s, box-shadow 0.2s',
                                                                                            ...provided.draggableProps.style,
                                                                                        }}
                                                                                        onMouseEnter={e => (e.currentTarget.style.background = '#e3f2fd')}
                                                                                        onMouseLeave={e => (e.currentTarget.style.background = snapshot.isDragging ? '#e3f2fd' : theme.palette.mode === 'dark' ? '#23272f' : '#f5f7fa')}
                                                                                    >
                                                                                        <span {...provided.dragHandleProps} style={{ cursor: 'grab', marginRight: 8, display: 'flex', alignItems: 'center', color: '#1976d2', background: '#e3f2fd', borderRadius: 4, padding: 2 }}>
                                                                                            <DragIndicatorIcon fontSize="small" />
                                                                                        </span>
                                                                                        <TextField
                                                                                            value={step}
                                                                                            onChange={e => handleEdit(type, idx, e.target.value)}
                                                                                            size="small"
                                                                                            variant="outlined"
                                                                                            sx={{
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
                                                                                            }}
                                                                                        />
                                                                                        <IconButton size="small" onClick={() => handleDeleteStep(type, idx)}><DeleteIcon fontSize="small" /></IconButton>
                                                                                    </li>
                                                                                )}
                                                                            </Draggable>
                                                                        ))}
                                                                        {provided.placeholder}
                                                                    </ul>
                                                                )}
                                                            </Droppable>
                                                        ) : (
                                                            <ul style={{ paddingLeft: 20, listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: 14 }}>
                                                                {mandatorySteps[type].map((step, idx) => (
                                                                    <li key={idx} style={{ fontSize: 22 }}>{step}</li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                        {editing[type] && (
                                                            <Box display="flex" alignItems="center" mb={1}>
                                                                <TextField
                                                                    value={newStep[type] || ''}
                                                                    onChange={e => setNewStep(n => ({ ...n, [type]: e.target.value }))}
                                                                    size="small"
                                                                    placeholder="Add step"
                                                                    variant="outlined"
                                                                    autoFocus
                                                                    onKeyDown={e => { if (e.key === 'Enter') handleAddStep(type); }}
                                                                    sx={{
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
                                                                    }}
                                                                />
                                                                <IconButton onClick={() => handleAddStep(type)} disabled={!newStep[type]?.trim()}><AddIcon /></IconButton>
                                                            </Box>
                                                        )}
                                                        {editing[type] && (
                                                            <>
                                                                <Button variant="contained" size="small" onClick={() => handleSave(type)} sx={{ mr: 1 }}>Save</Button>
                                                                <Button variant="outlined" size="small" onClick={() => handleCancelEdit(type)}>Cancel</Button>
                                                            </>
                                                        )}
                                                        {!editing[type] && (
                                                            <Button variant="outlined" size="small" onClick={() => handleStartEdit(type)}>Edit Steps</Button>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Box>
            <h3>Notification Preferences</h3>
            <FormControlLabel
                control={<Switch checked={notification.enabled} onChange={e => setNotification({ ...notification, enabled: e.target.checked })} />}
                label="Enable deadline reminders"
            />
            <TextField
                type="number"
                label="Remind me before (hours)"
                value={notification.hoursBefore}
                onChange={e => setNotification({ ...notification, hoursBefore: Math.max(1, Number(e.target.value)) })}
                InputProps={{ endAdornment: <InputAdornment position="end">hours</InputAdornment> }}
                disabled={!notification.enabled}
                size="small"
                variant="outlined"
                sx={{ width: 200, ml: 2, backgroundColor: theme.palette.background.paper, input: { color: theme.palette.text.primary } }}
            />
            <h3>Data Export / Import</h3>
            <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport} sx={{ mr: 2 }}>
                Export Data
            </Button>
            <Button variant="outlined" component="label" startIcon={<FileUploadIcon />}>
                Import Data
                <input type="file" accept="application/json" hidden onChange={handleImport} />
            </Button>
            <p>Theme, default steps, notifications, and more settings will appear here.</p>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                message="Default work type added!"
            />
            <Snackbar
                open={stepAddedSnackbar}
                autoHideDuration={1200}
                onClose={() => setStepAddedSnackbar(false)}
                message="Step added!"
            />
        </div>
    );
};

export default SettingsPage; 