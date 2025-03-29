import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Chip,
  Grid
} from '@mui/material';
import { Course, TimeSlot, ClassRoom, TimetableEntry } from './types/index';
import { courses, slotRules, classrooms } from './data/courses';
import { timeSlots, timeFormatMapping } from './data/timeSlots';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper function to get the letter slots for a specific time and day
function getLetterSlotsForTimeAndDay(time: string, day: string): string[] {
  // Based on the PDF document's slot schedule
  if (day === "Monday") {
    if (time === "09:00") return ["A", "C"];
    if (time === "10:00") return ["D"];
    if (time === "11:00") return ["G", "H"];
    if (time === "12:00") return ["I", "J", "K"];
    if (time === "14:00") return ["N"];
  } 
  else if (day === "Tuesday") {
    if (time === "09:00") return ["A"];
    if (time === "10:00") return ["D", "E"];
    if (time === "11:00") return ["F", "H"];
    if (time === "12:00") return ["I", "J", "L"];
    if (time === "14:00") return ["N"];
  } 
  else if (day === "Wednesday") {
    if (time === "09:00") return ["C"];
    if (time === "10:00") return ["B", "D"];
    if (time === "11:00") return ["F", "H"];
    if (time === "12:00") return ["I", "J"];
    if (time === "14:00") return ["M", "O"];
  } 
  else if (day === "Thursday") {
    if (time === "09:00") return ["A"];
    if (time === "10:00") return ["B", "E"];
    if (time === "11:00") return ["F", "G"];
    if (time === "12:00") return ["K", "L"];
    if (time === "14:00") return ["M", "O"];
  } 
  else if (day === "Friday") {
    if (time === "09:00") return ["C"];
    if (time === "10:00") return ["B", "E"];
    if (time === "11:00") return ["G"];
    if (time === "12:00") return ["K", "L"];
    if (time === "14:00") return ["N", "M", "O"];
  }
  
  return [];
}

function App() {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCourseToggle = (course: Course) => {
    setSelectedCourses(prev => {
      const isSelected = prev.find(c => c.id === course.id);
      if (isSelected) {
        return prev.filter(c => c.id !== course.id);
      } else {
        // Check for slot conflicts
        const courseSlots = course.slots;
        const conflictingCourses = prev.filter(c => {
          // Check regular slot conflicts
          const hasSlotConflict = c.slots.some(slot => courseSlots.includes(slot));
          
          // Check time conflicts for labs
          const hasLabConflict = course.labs && c.labs && course.labs.some(lab1 => 
            c.labs!.some(lab2 => 
              lab1.day === lab2.day && 
              lab1.time.split(' - ')[0] === lab2.time.split(' - ')[0]
            )
          );
          
          // Check time conflicts for tutorials
          const hasTutorialConflict = course.tutorials && c.tutorials && course.tutorials.some(tut1 => 
            c.tutorials!.some(tut2 => 
              tut1.day === tut2.day && 
              tut1.time.split(' - ')[0] === tut2.time.split(' - ')[0]
            )
          );
          
          return hasSlotConflict || hasLabConflict || hasTutorialConflict;
        });
        
        if (conflictingCourses.length > 0) {
          const conflictDetails = conflictingCourses.map(c => {
            const conflicts: string[] = [];
            if (c.slots.some(slot => courseSlots.includes(slot))) {
              conflicts.push(`Slot ${c.slots.join(', ')}`);
            }
            if (c.labs && course.labs) {
              conflicts.push('Lab timings');
            }
            if (c.tutorials && course.tutorials) {
              conflicts.push('Tutorial timings');
            }
            return `${c.id} (${conflicts.join(', ')})`;
          }).join(', ');
          
          setError(`Cannot select ${course.id} due to conflicts with: ${conflictDetails}`);
          return prev;
        }
        
        return [...prev, course];
      }
    });
    setError(null);
  };

  const generateTimetable = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Log the request data for debugging
      console.log('Sending request with:', {
        courses: selectedCourses,
        slots: timeSlots,
        classrooms,
        rules: slotRules
      });

      const response = await fetch('http://localhost:5000/api/generate-timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courses: selectedCourses,
          slots: timeSlots,
          classrooms: [
            { id: 'L1', name: 'Lecture Hall 1', capacity: 100 },
            { id: 'L2', name: 'Lecture Hall 2', capacity: 100 },
            { id: 'L3', name: 'Lecture Hall 3', capacity: 100 }
          ],
          rules: {
            maxCoursesPerSlot: 1,
            slotTiming: {
              morning: "09:00-12:55",
              afternoon: "02:00-06:55",
              lunchBreak: "01:00-02:00"
            },
            constraints: [
              "No faculty can teach two courses in the same slot",
              "No student can take two courses in the same slot",
              "Each slot consists of three 1-hour sessions",
              "Slots are fixed and do not change every semester"
            ]
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate timetable');
      }

      const data = await response.json();
      console.log('Received timetable:', data);
      setTimetable(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const input = document.getElementById('timetable');
    if (input) {
      // First get the dimensions of the table
      const inputWidth = input.scrollWidth;
      const inputHeight = input.scrollHeight;

      // Calculate the aspect ratio
      const aspectRatio = inputHeight / inputWidth;

      // Set up html2canvas options for better quality
      const canvas = await html2canvas(input, {
        width: inputWidth,
        height: inputHeight
      });

      // Create PDF in landscape with custom size
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [inputWidth * 0.75, inputWidth * 0.75 * aspectRatio]
      });

      // Add the image to fill the page
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        pdf.internal.pageSize.getHeight()
      );

      pdf.save('timetable.pdf');
    }
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        height: '100vh', 
        py: 1, 
        px: { xs: 1, sm: 1.5 },
        fontSize: '75%' // Base font size reduction
      }}
    >
      <Box sx={{ 
        textAlign: 'center', 
        mb: 1.5,
        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
        color: 'white',
        py: 0.75,
        borderRadius: 0.75,
        boxShadow: 1
      }}>
        <Typography variant="h6" component="h1" sx={{ mb: 0.25, fontWeight: 'bold', fontSize: '1.1rem' }}>
          IISERB Timetable Generator
        </Typography>
        <Typography sx={{ fontSize: '0.75rem' }}>
          Select your courses and generate a conflict-free timetable
        </Typography>
      </Box>

      <Grid container spacing={1.5} sx={{ height: 'calc(100vh - 90px)' }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ 
            p: 1, 
            height: '100%',
            background: '#f8f9fa',
            boxShadow: 1
          }}>
            <Typography sx={{ color: '#1976d2', fontWeight: 'bold', mb: 0.75, fontSize: '0.9rem' }}>
              Available Courses
            </Typography>
            <List sx={{ 
              height: 'calc(100% - 30px)', 
              overflow: 'auto',
              '& .MuiListItem-root': {
                py: 0.25,
                minHeight: '40px'
              }
            }}>
              {courses.map((course) => (
                <ListItem
                  key={course.id}
                  sx={{
                    mb: 0.25,
                    borderRadius: 0.75,
                    bgcolor: 'white',
                    '&:hover': {
                      bgcolor: '#f5f5f5'
                    }
                  }}
                >
                  <Checkbox
                    edge="start"
                    checked={selectedCourses.some(c => c.id === course.id)}
                    onChange={() => handleCourseToggle(course)}
                    sx={{ 
                      p: 0.25,
                      '& .MuiSvgIcon-root': {
                        fontSize: '1rem'
                      }
                    }}
                  />
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.25 }}>
                        <Typography sx={{ mr: 0.5, fontSize: '0.75rem' }}>
                          {course.id} - {course.name}
                        </Typography>
                        {course.slots.map(slot => (
                          <Chip
                            key={slot}
                            label={`Slot ${slot}`}
                            size="small"
                            color="primary"
                            sx={{ 
                              height: 14,
                              fontSize: '0.6rem',
                              '& .MuiChip-label': {
                                px: 0.5
                              }
                            }}
                          />
                        ))}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.25 }}>
                        {course.labs && (
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', display: 'block' }}>
                            Labs: {course.labs.map(lab => `${lab.day} ${lab.time}`).join(', ')}
                          </Typography>
                        )}
                        {course.tutorials && (
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', display: 'block' }}>
                            Tutorials: {course.tutorials.map(tut => `${tut.day} ${tut.time}`).join(', ')}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9} sx={{ height: '100%' }}>
          <Box sx={{ mb: 0.75 }}>
            <Button
              variant="contained"
              onClick={generateTimetable}
              disabled={selectedCourses.length === 0 || loading}
              size="small"
              sx={{
                py: 0.25,
                px: 1.5,
                borderRadius: 0.75,
                textTransform: 'none',
                fontSize: '0.75rem'
              }}
              startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
            >
              {loading ? 'Generating...' : 'Generate Timetable'}
            </Button>
            {timetable.length > 0 && (
              <Button
                variant="outlined"
                onClick={downloadPDF}
                size="small"
                sx={{
                  ml: 1,
                  py: 0.25,
                  px: 1.5,
                  borderRadius: 0.75,
                  textTransform: 'none',
                  fontSize: '0.75rem'
                }}
              >
                Download PDF
              </Button>
            )}
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 0.75,
                py: 0,
                borderRadius: 0.75,
                fontSize: '0.75rem',
                '& .MuiAlert-message': {
                  padding: '2px 0'
                },
                '& .MuiAlert-icon': {
                  fontSize: '1rem',
                  marginRight: 1
                }
              }}
            >
              {error}
            </Alert>
          )}

          {timetable.length > 0 && (
            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: 1,
                borderRadius: 0.75,
                height: 'calc(100% - 36px)',
                '& .MuiTableCell-root': {
                  padding: '3px 6px',
                  fontSize: '0.7rem',
                  lineHeight: 1.1
                }
              }}
              id="timetable"
            >
              <Table size="small" sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 'bold',
                        backgroundColor: '#1976d2',
                        width: '60px'
                      }}
                    >
                      Time
                    </TableCell>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <TableCell 
                        key={day} 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 'bold',
                          backgroundColor: '#1976d2'
                        }}
                      >
                        {day}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timeSlots.map((slot) => (
                    <TableRow 
                      key={slot.start}
                      sx={{
                        '&:nth-of-type(odd)': {
                          bgcolor: '#f8f9fa'
                        },
                        height: '30px'
                      }}
                    >
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {`${slot.start}-${slot.end}`}
                      </TableCell>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
                        const letterSlots = getLetterSlotsForTimeAndDay(slot.start, day);
                        const entries = timetable.filter(e => 
                          e.day === day && (
                            (e.type === 'lecture' && letterSlots.includes(e.slot)) ||
                            (e.type !== 'lecture' && e.time && e.time.toLowerCase().includes(
                              timeFormatMapping[slot.start] || slot.start
                            ))
                          )
                        );
                        
                        return (
                          <TableCell 
                            key={day}
                            sx={{
                              p: 0.25,
                              bgcolor: entries.length > 0 ? 'rgba(25, 118, 210, 0.04)' : 'inherit'
                            }}
                          >
                            {entries.map(entry => (
                              <Box 
                                key={entry.course.id + entry.type} 
                                sx={{ 
                                  p: 0.25,
                                  mb: 0.25,
                                  borderRadius: 0.5,
                                  border: '1px solid',
                                  borderColor: 'primary.light',
                                  bgcolor: 'white',
                                  fontSize: '0.65rem'
                                }}
                              >
                                <Typography sx={{ fontWeight: 'medium', color: 'primary.main', display: 'block', lineHeight: 1.1, fontSize: '0.65rem' }}>
                                  {entry.course.id} - {entry.course.name}
                                  {entry.course.notes && ` (${entry.course.notes})`}
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', display: 'block', lineHeight: 1, fontSize: '0.6rem' }}>
                                  {entry.type === 'lecture' ? `Slot ${entry.slot}` : 
                                   entry.type === 'lab' ? 'Lab Session' : 'Tutorial'}
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', display: 'block', lineHeight: 1, fontSize: '0.6rem' }}>
                                  {entry.course.location || entry.classroom.name}
                                  {entry.time && entry.type !== 'lecture' && ` (${entry.time})`}
                                </Typography>
                              </Box>
                            ))}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default App; 