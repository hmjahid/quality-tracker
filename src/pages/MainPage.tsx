import React from 'react';
import { WorkType, Step } from '../types';
import WorkTypeCard from '../components/WorkTypeCard';
import { createDefaultSteps } from '../utils/defaults';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import { v4 as uuidv4 } from 'uuid';
import { useSettings } from '../SettingsContext';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

declare global {
  interface Window {
    electronAPI: {
      getStoreValue: (key: string) => Promise<any>;
      setStoreValue: (key: string, value: any) => Promise<void>;
    };
  }
}

const STORAGE_KEY = 'workTypes';

const MainPage: React.FC = () => {
  const { mandatorySteps } = useSettings();
  const [workTypes, setWorkTypes] = React.useState<WorkType[]>([]);
  const [newTitle, setNewTitle] = React.useState('');
  const [initialized, setInitialized] = React.useState(false);
  const theme = useTheme();

  const defaultWorkTypes = Object.keys(mandatorySteps);
  const [selectedDefault, setSelectedDefault] = React.useState<string | null>(null);
  const [selectedSteps, setSelectedSteps] = React.useState<string[]>([]);

  React.useEffect(() => {
    (async () => {
      const saved = await window.electronAPI.getStoreValue(STORAGE_KEY);
      setWorkTypes(saved && Array.isArray(saved) ? saved : []);
      setInitialized(true);
    })();
  }, []);

  React.useEffect(() => {
    if (initialized) window.electronAPI.setStoreValue(STORAGE_KEY, workTypes);
  }, [workTypes, initialized]);

  const handleAddWorkType = () => {
    if (!newTitle.trim()) return;
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

  const handleEditWorkType = (id: string, title: string) => {
    setWorkTypes(wt => wt.map(w => w.id === id ? { ...w, title } : w));
  };

  const handleDeleteWorkType = (id: string) => {
    setWorkTypes(wt => wt.filter(w => w.id !== id));
  };

  const handleStepToggle = (workTypeId: string, stepId: string) => {
    setWorkTypes(wt => wt.map(w => w.id === workTypeId ? {
      ...w,
      steps: w.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s),
    } : w));
  };

  const handleStepEdit = (workTypeId: string, stepId: string, label: string) => {
    setWorkTypes(wt => wt.map(w => w.id === workTypeId ? {
      ...w,
      steps: w.steps.map(s => s.id === stepId ? { ...s, label } : s),
    } : w));
  };

  const handleStepDelete = (workTypeId: string, stepId: string) => {
    setWorkTypes(wt => wt.map(w => w.id === workTypeId ? {
      ...w,
      steps: w.steps.filter(s => s.id !== stepId),
    } : w));
  };

  const handleAddStep = (workTypeId: string, label: string) => {
    setWorkTypes(wt => wt.map(w => w.id === workTypeId ? {
      ...w,
      steps: [
        ...w.steps,
        { id: uuidv4(), label, completed: false, mandatory: false },
      ],
    } : w));
  };

  const handleDeadlineChange = (workTypeId: string, deadline: string) => {
    setWorkTypes(wt => wt.map(w => w.id === workTypeId ? { ...w, deadline } : w));
  };

  const handleReorderSteps = (workTypeId: string, sourceIdx: number, destIdx: number) => {
    setWorkTypes(wt => wt.map(w => {
      if (w.id !== workTypeId) return w;
      const steps = Array.from(w.steps);
      const [removed] = steps.splice(sourceIdx, 1);
      steps.splice(destIdx, 0, removed);
      return { ...w, steps };
    }));
  };

  const handleCardDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    setWorkTypes(prev => {
      const arr = Array.from(prev);
      const [removed] = arr.splice(source.index, 1);
      arr.splice(destination.index, 0, removed);
      return arr;
    });
  };

  if (typeof window.electronAPI === 'undefined') {
    return <Box display="flex" alignItems="center" justifyContent="center" height="100vh"><span style={{color: 'red'}}>Error: electronAPI is not available. Please run in Electron.</span></Box>;
  }
  if (!initialized) return <Box display="flex" alignItems="center" justifyContent="center" height="100vh"><CircularProgress /></Box>;

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <Autocomplete
          options={defaultWorkTypes}
          value={selectedDefault}
          onChange={(_, value) => {
            setSelectedDefault(value);
            if (value) {
              setNewTitle(value);
              setSelectedSteps(mandatorySteps[value] || []);
            } else {
              setSelectedSteps([]);
            }
          }}
          sx={{ width: 220, mr: 1 }}
          renderInput={(params) => (
            <TextField {...params} label="Default Work Type" variant="outlined" sx={{
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
            }} />
          )}
        />
        <TextField
          value={newTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddWorkType}>
          Add Work Type
        </Button>
      </Box>
      <DragDropContext onDragEnd={handleCardDragEnd}>
        <Droppable droppableId="workTypeCards" direction="horizontal">
          {(provided) => (
            <Box display="flex" flexWrap="wrap" ref={provided.innerRef} {...provided.droppableProps}>
              {workTypes.map((wt, idx) => (
                <Draggable key={wt.id} draggableId={wt.id} index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.7 : 1,
                      }}
                    >
                      <WorkTypeCard
                        workType={wt}
                        onEdit={handleEditWorkType}
                        onDelete={handleDeleteWorkType}
                        onStepToggle={handleStepToggle}
                        onStepEdit={handleStepEdit}
                        onStepDelete={handleStepDelete}
                        onAddStep={handleAddStep}
                        onDeadlineChange={handleDeadlineChange}
                        onReorderSteps={handleReorderSteps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default MainPage; 