import React, { useState } from 'react';
import { useThemeMode, ThemeMode } from '../ThemeContext';
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

const SettingsPage: React.FC = () => {
  const { mode, setMode } = useThemeMode();
  const { mandatorySteps, updateStepsForType, notification, setNotification } = useSettings();
  const { setMandatorySteps } = useSettings();
  const [editing, setEditing] = useState<{ [type: string]: string[] }>({});
  const [newStep, setNewStep] = useState<{ [type: string]: string }>({});
  const [newType, setNewType] = useState('');
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editingTypeName, setEditingTypeName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();

  // Debug log for context state
  console.log("mandatorySteps in SettingsPage:", mandatorySteps);

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
    const data: Record<string, any> = {};
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
    <div style={{width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h2>Settings</h2>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel component="legend">Theme</FormLabel>
        <RadioGroup
          row
          value={mode}
          onChange={e => setMode(e.target.value as ThemeMode)}
        >
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
          size="small"
          placeholder="Add new default work type name"
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
        <Button variant="contained" onClick={handleAddType}>Add</Button>
      </Box>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {Object.keys(mandatorySteps).map(type => (
          <Card key={type} sx={{ minWidth: 300, maxWidth: 350, mb: 2, background: theme.palette.mode === 'dark' ? '#222' : '#fafafa', border: `2px solid ${theme.palette.primary.main}` }}>
            <CardHeader
              title={editingType === type ? (
                <Box display="flex" alignItems="center">
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
              ) : (
                <Box display="flex" alignItems="center">
                  <span style={{ fontWeight: 600, fontSize: 18 }}>{type}</span>
                  <IconButton size="small" onClick={() => { setEditingType(type); setEditingTypeName(type); }}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDeleteType(type)}><DeleteIcon /></IconButton>
                </Box>
              )}
            />
            <CardContent>
              {editing[type] ? (
                <>
                  <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                    {editing[type].map((step, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
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
                    ))}
                  </ul>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TextField
                      value={newStep[type] || ''}
                      onChange={e => setNewStep(n => ({ ...n, [type]: e.target.value }))}
                      size="small"
                      placeholder="Add step"
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
                    <IconButton onClick={() => handleAddStep(type)}><AddIcon /></IconButton>
                  </Box>
                  <Button variant="contained" size="small" onClick={() => handleSave(type)} sx={{ mr: 1 }}>Save</Button>
                  <Button variant="outlined" size="small" onClick={() => handleCancelEdit(type)}>Cancel</Button>
                </>
              ) : (
                <>
                  <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                    {mandatorySteps[type].map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                  <Button variant="outlined" size="small" onClick={() => handleStartEdit(type)}>Edit Steps</Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
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
    </div>
  );
};

export default SettingsPage; 