import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateTimetable } from './timetableGenerator';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API endpoint to generate timetable
app.post('/api/generate-timetable', async (req, res) => {
  try {
    const { courses, slots, classrooms, rules } = req.body;
    const timetable = await generateTimetable(courses, slots, classrooms, rules);
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate timetable' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 