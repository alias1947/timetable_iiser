import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Course } from '../types';

interface CourseFormProps {
  onAddCourse: (course: Course) => void;
}

function CourseForm({ onAddCourse }: CourseFormProps) {
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [duration, setDuration] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !instructor || !duration) {
      return;
    }

    const course: Course = {
      id: Date.now().toString(),
      name,
      instructor,
      duration: parseInt(duration, 10)
    };

    onAddCourse(course);
    
    // Reset form
    setName('');
    setInstructor('');
    setDuration('1');
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add Course
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Course Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Instructor"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Duration (hours)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              inputProps={{ min: 1, max: 3 }}
              required
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Add Course
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default CourseForm; 