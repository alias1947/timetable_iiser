export interface Course {
  id: string;
  name: string;
  slots: string[];
  labs?: {
    day: string;
    time: string;
  }[];
  tutorials?: {
    day: string;
    time: string;
  }[];
  location?: string;
  notes?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  capacity: number;
}

export interface TimetableEntry {
  course: Course;
  slot: string;
  classroom: ClassRoom;
  day: string;
  type: 'lecture' | 'lab' | 'tutorial';
  time?: string;
}

export interface SlotRules {
  maxCoursesPerSlot: number;
  slotTiming: {
    morning: string;
    afternoon: string;
    lunchBreak: string;
  };
  constraints: string[];
} 