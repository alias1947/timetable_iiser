export interface Course {
  id: string;
  name: string;
  instructor: string;
  duration: number;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  capacity: number;
}

export interface TimetableEntry {
  course: Course;
  timeSlot: TimeSlot;
  classroom: ClassRoom;
} 