interface Course {
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
  
  interface TimeSlot {
    start: string;
    end: string;
  }
  
  interface ClassRoom {
    id: string;
    name: string;
    capacity: number;
  }
  
  interface TimetableEntry {
    course: Course;
    slot: string;
    classroom: ClassRoom;
    day: string;
    type?: string;
    time?: string;
  }
  
  interface SlotRules {
    maxCoursesPerSlot: number;
    slotTiming: {
      morning: string;
      afternoon: string;
      lunchBreak: string;
    };
    constraints: string[];
  }
  
  type SlotKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'X';
  
  // Updated slot schedule based on the official timetable document
  const SLOT_SCHEDULE: Record<SlotKey, string[]> = {
    'A': ['Monday', 'Tuesday', 'Thursday'],
    'B': ['Wednesday', 'Thursday', 'Friday'],
    'C': ['Monday', 'Wednesday', 'Friday'],
    'D': ['Monday', 'Tuesday', 'Wednesday'],
    'E': ['Tuesday', 'Thursday', 'Friday'],
    'F': ['Tuesday', 'Wednesday', 'Thursday'],
    'G': ['Monday', 'Thursday', 'Friday'],
    'H': ['Monday', 'Tuesday', 'Wednesday'],
    'I': ['Monday', 'Tuesday', 'Wednesday'],
    'J': ['Monday', 'Tuesday', 'Wednesday'],
    'K': ['Monday', 'Thursday', 'Friday'],
    'L': ['Tuesday', 'Thursday', 'Friday'],
    'M': ['Wednesday', 'Thursday', 'Friday'],
    'N': ['Monday', 'Tuesday', 'Friday'],
    'O': ['Wednesday', 'Thursday', 'Friday'],
    'X': [] // X slot has special timings defined separately
  };
  
  // Map slots to their respective time periods based on the official document
  const SLOT_TIME_MAPPING: Record<string, string> = {
    'A': '09:00-09:55',
    'B': '10:00-10:55',
    'C': '09:00-09:55',
    'D': '10:00-10:55',
    'E': '10:00-10:55',
    'F': '11:00-11:55',
    'G': '11:00-11:55',
    'H': '11:00-11:55',
    'I': '12:00-12:55',
    'J': '12:00-12:55',
    'K': '12:00-12:55',
    'L': '12:00-12:55',
    'M': '02:00-02:55',
    'N': '02:00-02:55',
    'O': '02:00-02:55',
    'X': 'Special' // X slot has special timings
  };
  
  // Special timing courses from the document
  const SPECIAL_TIMING_COURSES: Record<string, { days: string[], time: string }> = {
    'MTH 422/523/630': { 
      days: ['Monday', 'Tuesday', 'Friday'], 
      time: 'Mon 05-06 PM, Tue 03-04 PM, Fri 04-05 PM'
    },
    'MTH 516/616': { 
      days: ['Tuesday', 'Thursday', 'Friday'], 
      time: 'Tue 05-06 PM, Thu 04-05 PM, Fri 02-03 PM'
    },
    'ECO 102': { 
      days: ['Monday', 'Tuesday', 'Wednesday'], 
      time: 'Mon, Wed 03 PM-04 PM, Tue 04 PM -05 PM'
    },
    // Add other special timing courses here...
  };
  
  export async function generateTimetable(
    courses: Course[],
    slots: TimeSlot[],
    classrooms: ClassRoom[],
    rules: SlotRules
  ): Promise<TimetableEntry[]> {
    const timetable: TimetableEntry[] = [];
    console.log('Input data:', {
      courses: JSON.stringify(courses),
      slots: JSON.stringify(slots),
      classrooms: JSON.stringify(classrooms),
      rules: JSON.stringify(rules)
    });
  
    if (!courses || courses.length === 0) {
      console.error('No courses provided');
      return timetable;
    }
  
    // For each course, assign it to its predefined slots on specific days
    for (const course of courses) {
      console.log(`Processing course: ${course.name} with slots:`, course.slots);
      
      if (!course.slots || course.slots.length === 0) {
        console.error(`No slots defined for course: ${course.name}`);
        continue;
      }
  
      // Check if this is a special timing course
      const specialTiming = SPECIAL_TIMING_COURSES[course.id];
      
      // Handle regular lecture slots
      for (const slot of course.slots) {
        let daysForSlot: string[] = [];
        
        if (specialTiming) {
          daysForSlot = specialTiming.days;
        } else if (slot === 'X') {
          console.log(`Course ${course.id} is in X slot, checking special timings`);
          const xSlotTiming = SPECIAL_TIMING_COURSES[course.id];
          daysForSlot = xSlotTiming ? xSlotTiming.days : [];
        } else {
          daysForSlot = SLOT_SCHEDULE[slot as SlotKey] || [];
        }
        
        console.log(`Slot ${slot} maps to days:`, daysForSlot);
        
        if (!daysForSlot || daysForSlot.length === 0) {
          console.error(`No schedule found for slot ${slot} of course ${course.id}`);
          continue;
        }
  
        for (const day of daysForSlot) {
          // Get the time for this slot
          const timeForSlot = SLOT_TIME_MAPPING[slot] || '';
          if (!timeForSlot || timeForSlot === 'Special') continue;
  
          // Check if there's already a course at this time on this day
          const [startTime] = timeForSlot.split('-');
          const hasTimeConflict = timetable.some(entry => {
            if (entry.day !== day || entry.type !== 'lecture') return false;
            const [existingStartTime] = (SLOT_TIME_MAPPING[entry.slot] || '').split('-');
            return existingStartTime === startTime;
          });
  
          if (hasTimeConflict) {
            console.error(`Time conflict detected for ${course.id} on ${day} at ${startTime}`);
            continue;
          }
  
          // Find an available classroom for this slot and day
          let classroomToUse: ClassRoom | undefined;
          
          // If the course has a specific location, use that
          if (course.location) {
            classroomToUse = classrooms.find(cr => cr.id === course.location);
          }
          
          // Otherwise find an available classroom
          if (!classroomToUse) {
            classroomToUse = classrooms.find(classroom => 
              !timetable.some(entry => 
                entry.slot === slot && 
                entry.day === day && 
                entry.classroom.id === classroom.id
              )
            );
          }
  
          if (!classroomToUse) {
            console.error(`No available classroom for course ${course.id} in slot ${slot} on ${day}`);
            continue;
          }
  
          timetable.push({
            course,
            slot,
            day,
            classroom: classroomToUse,
            type: 'lecture',
            time: timeForSlot
          });
        }
      }
  
      // Handle labs if present
      if (course.labs) {
        for (const lab of course.labs) {
          const availableClassroom = classrooms.find(classroom => 
            !timetable.some(entry => 
              entry.day === lab.day && 
              entry.type === 'lab' && 
              entry.classroom.id === classroom.id
            )
          );
  
          if (!availableClassroom) {
            console.error(`No available classroom for lab of course ${course.id} on ${lab.day}`);
            continue;
          }
  
          timetable.push({
            course,
            slot: 'LAB',
            day: lab.day,
            classroom: availableClassroom,
            type: 'lab',
            time: lab.time
          });
        }
      }
  
      // Handle tutorials if present
      if (course.tutorials) {
        for (const tutorial of course.tutorials) {
          const availableClassroom = classrooms.find(classroom => 
            !timetable.some(entry => 
              entry.day === tutorial.day && 
              entry.type === 'tutorial' && 
              entry.classroom.id === classroom.id
            )
          );
  
          if (!availableClassroom) {
            console.error(`No available classroom for tutorial of course ${course.id} on ${tutorial.day}`);
            continue;
          }
  
          timetable.push({
            course,
            slot: 'TUT',
            day: tutorial.day,
            classroom: availableClassroom,
            type: 'tutorial',
            time: tutorial.time
          });
        }
      }
    }
  
    console.log('Generated timetable:', timetable);
    return timetable;
  }