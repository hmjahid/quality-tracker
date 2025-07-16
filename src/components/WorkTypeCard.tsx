import React from 'react';
import { WorkType, Step } from '../types';
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
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useTheme } from '@mui/material/styles';

const StepLabel = styled('span')<{ mandatory: boolean }>(({ mandatory, theme }) => ({
  fontWeight: mandatory ? 'bold' : 'normal',
  color: mandatory ? theme.palette.primary.main : 'inherit',
  marginLeft: 8,
}));

interface WorkTypeCardProps {
  workType: WorkType;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onStepToggle: (workTypeId: string, stepId: string) => void;
  onStepEdit: (workTypeId: string, stepId: string, label: string) => void;
  onStepDelete: (workTypeId: string, stepId: string) => void;
  onAddStep: (workTypeId: string, label: string) => void;
  onDeadlineChange: (workTypeId: string, deadline: string) => void;
  onReorderSteps: (workTypeId: string, sourceIdx: number, destIdx: number) => void;
}

const WorkTypeCard: React.FC<WorkTypeCardProps> = ({
  workType,
  onEdit,
  onDelete,
  onStepToggle,
  onStepEdit,
  onStepDelete,
  onAddStep,
  onDeadlineChange,
  onReorderSteps,
}) => {
  const [editingTitle, setEditingTitle] = React.useState(false);
  const [title, setTitle] = React.useState(workType.title);
  const [newStep, setNewStep] = React.useState('');
  const [editingStepId, setEditingStepId] = React.useState<string | null>(null);
  const [editingStepLabel, setEditingStepLabel] = React.useState('');
  const theme = useTheme();

  const completed = workType.steps.filter((s) => s.completed).length;
  const total = workType.steps.length;
  const progress = total ? (completed / total) * 100 : 0;
  const allMandatoryComplete = workType.steps.filter(s => s.mandatory).every(s => s.completed);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    onReorderSteps(workType.id, result.source.index, result.destination.index);
  };

  return (
    <Card sx={{ minWidth: 350, maxWidth: 400, m: 2, position: 'relative', border: allMandatoryComplete ? '2px solid green' : '2px solid orange' }}>
      <CardHeader
        title={editingTitle ? (
          <TextField
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => { setEditingTitle(false); onEdit(workType.id, title); }}
            onKeyDown={e => { if (e.key === 'Enter') { setEditingTitle(false); onEdit(workType.id, title); } }}
            size="small"
            autoFocus
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
        ) : (
          <span onClick={() => setEditingTitle(true)} style={{ cursor: 'pointer' }}>{workType.title}</span>
        )}
        subheader={
          <TextField
            type="date"
            size="small"
            value={workType.deadline || ''}
            onChange={e => onDeadlineChange(workType.id, e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            sx={{
              mt: 1,
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
        }
        action={
          <IconButton onClick={() => onDelete(workType.id)}><DeleteIcon /></IconButton>
        }
      />
      <CardContent>
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
        <Typography variant="body2" color={allMandatoryComplete ? 'green' : 'orange'}>
          {allMandatoryComplete ? 'All mandatory steps complete' : 'Mandatory steps incomplete'}
        </Typography>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={`droppable-${workType.id}`}>
            {(provided) => (
              <ul ref={provided.innerRef} {...provided.droppableProps} style={{ paddingLeft: 0, listStyle: 'none' }}>
                {workType.steps.map((step, idx) => (
                  <Draggable key={step.id} draggableId={step.id} index={idx}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: 4,
                          background: snapshot.isDragging ? '#f0f0f0' : undefined,
                          ...provided.draggableProps.style,
                        }}
                      >
                        <Checkbox
                          checked={step.completed}
                          onChange={() => onStepToggle(workType.id, step.id)}
                          color={step.mandatory ? 'primary' : 'default'}
                        />
                        {editingStepId === step.id ? (
                          <TextField
                            value={editingStepLabel}
                            onChange={e => setEditingStepLabel(e.target.value)}
                            onBlur={() => { onStepEdit(workType.id, step.id, editingStepLabel); setEditingStepId(null); }}
                            onKeyDown={e => { if (e.key === 'Enter') { onStepEdit(workType.id, step.id, editingStepLabel); setEditingStepId(null); } }}
                            size="small"
                            autoFocus
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
                        ) : (
                          <StepLabel mandatory={step.mandatory} onClick={() => { setEditingStepId(step.id); setEditingStepLabel(step.label); }} style={{ cursor: 'pointer' }}>
                            {step.label}
                          </StepLabel>
                        )}
                        <IconButton size="small" onClick={() => onStepDelete(workType.id, step.id)}><DeleteIcon fontSize="small" /></IconButton>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
          <TextField
            value={newStep}
            onChange={e => setNewStep(e.target.value)}
            size="small"
            placeholder="Add step"
            onKeyDown={e => { if (e.key === 'Enter' && newStep.trim()) { onAddStep(workType.id, newStep.trim()); setNewStep(''); } }}
            variant="outlined"
            sx={{
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
            }}
          />
          <IconButton onClick={() => { if (newStep.trim()) { onAddStep(workType.id, newStep.trim()); setNewStep(''); } }}><AddIcon /></IconButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkTypeCard; 