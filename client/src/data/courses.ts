export interface CourseData {
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

export const courses: CourseData[] = [
  // Chemistry Courses
  {
    id: "CHE 204",
    name: "Chemistry",
    slots: ["A"]
  },
  {
    id: "CHM 402/602",
    name: "Chemistry Advanced",
    slots: ["A"]
  },
  {
    id: "CHM 112",
    name: "Chemistry Lab",
    slots: ["B"],
    labs: [
      { day: "Tuesday", time: "2:00 PM - 5:00 PM" },
      { day: "Wednesday", time: "2:00 PM - 5:00 PM" },
      { day: "Monday", time: "3:00 PM - 6:00 PM" }
    ]
  },
  // Physics Courses
  {
    id: "PHY 202",
    name: "Physics",
    slots: ["C"]
  },
  {
    id: "PHY 314",
    name: "Advanced Physics",
    slots: ["C"]
  },
  // Mathematics Courses
  {
    id: "MTH 101",
    name: "Mathematics",
    slots: ["E"],
    tutorials: [
      { day: "Saturday", time: "10:00 AM - 10:55 AM" }
    ]
  },
  {
    id: "MTH 434",
    name: "Advanced Mathematics",
    slots: ["J"],
    tutorials: [
      { day: "Saturday", time: "11:00 AM - 1:00 PM" }
    ],
    location: "L3",
    notes: "NKN"
  },
  // Biology Courses
  {
    id: "BIO 202",
    name: "Biology",
    slots: ["A"],
    labs: [
      { day: "Tuesday", time: "2:00 PM - 5:00 PM" }
    ]
  },
  // Economics Courses
  {
    id: "ECO 202/352",
    name: "Economics",
    slots: ["H"]
  },
  {
    id: "ECO 102",
    name: "Economics Introduction",
    slots: ["X"]
  },
  {
    id: "CHM 302",
    name: "Chemistry Special",
    slots: ["X"]
  },
  {
    id: "ECS 301",
    name: "Computer Science",
    slots: ["A"]
  }
];

// Slot Timings based on the PDF
export const slotTimings = {
  "A": [
    { day: "Monday", time: "09:00-09:55" },
    { day: "Tuesday", time: "09:00-09:55" },
    { day: "Thursday", time: "09:00-09:55" }
  ],
  "B": [
    { day: "Wednesday", time: "09:00-09:55" },
    { day: "Thursday", time: "09:00-09:55" },
    { day: "Friday", time: "09:00-09:55" }
  ],
  "C": [
    { day: "Monday", time: "11:00-11:55" },
    { day: "Wednesday", time: "11:00-11:55" },
    { day: "Friday", time: "11:00-11:55" }
  ],
  "D": [
    { day: "Monday", time: "12:00-12:55" },
    { day: "Tuesday", time: "12:00-12:55" },
    { day: "Wednesday", time: "12:00-12:55" }
  ],
  "E": [
    { day: "Tuesday", time: "10:00-10:55" },
    { day: "Thursday", time: "10:00-10:55" },
    { day: "Friday", time: "10:00-10:55" }
  ],
  "F": [
    { day: "Tuesday", time: "11:00-11:55" },
    { day: "Thursday", time: "11:00-11:55" },
    { day: "Friday", time: "11:00-11:55" }
  ],
  "G": [
    { day: "Monday", time: "10:00-10:55" },
    { day: "Thursday", time: "10:00-10:55" },
    { day: "Friday", time: "10:00-10:55" }
  ],
  "H": [
    { day: "Monday", time: "12:00-12:55" },
    { day: "Tuesday", time: "12:00-12:55" },
    { day: "Wednesday", time: "12:00-12:55" }
  ],
  "I": [
    { day: "Monday", time: "14:00-14:55" },
    { day: "Tuesday", time: "14:00-14:55" },
    { day: "Wednesday", time: "14:00-14:55" }
  ],
  "J": [
    { day: "Monday", time: "15:00-15:55" },
    { day: "Tuesday", time: "15:00-15:55" },
    { day: "Wednesday", time: "15:00-15:55" }
  ],
  "K": [
    { day: "Monday", time: "16:00-16:55" },
    { day: "Thursday", time: "16:00-16:55" },
    { day: "Friday", time: "16:00-16:55" }
  ],
  "L": [
    { day: "Tuesday", time: "16:00-16:55" },
    { day: "Thursday", time: "16:00-16:55" },
    { day: "Friday", time: "16:00-16:55" }
  ],
  "M": [
    { day: "Wednesday", time: "16:00-16:55" },
    { day: "Thursday", time: "16:00-16:55" },
    { day: "Friday", time: "16:00-16:55" }
  ],
  "N": [
    { day: "Monday", time: "17:00-17:55" },
    { day: "Tuesday", time: "17:00-17:55" },
    { day: "Friday", time: "17:00-17:55" }
  ],
  "O": [
    { day: "Wednesday", time: "17:00-17:55" },
    { day: "Thursday", time: "17:00-17:55" },
    { day: "Friday", time: "17:00-17:55" }
  ],
  "X": [
    // Special slot timing varies by course
    // Refer to the bottom of the PDF for X slot timing
  ]
};

// Slot System Rules
export const slotRules = {
  maxCoursesPerSlot: 1,
  slotTiming: {
    morning: "09:00-12:55",
    afternoon: "14:00-17:55",
    lunchBreak: "13:00-14:00"
  },
  constraints: [
    "No faculty can teach two courses in the same slot",
    "No student can take two courses in the same slot",
    "Each slot consists of three 1-hour sessions",
    "Slots are fixed and do not change every semester"
  ]
};

// Available Classrooms
export const classrooms = [
  { id: "L1", name: "Lecture Hall 1", capacity: 100 },
  { id: "L2", name: "Lecture Hall 2", capacity: 100 },
  { id: "L3", name: "Lecture Hall 3", capacity: 100 },
  { id: "L4", name: "Lecture Hall 4", capacity: 100 },
  { id: "L5", name: "Lecture Hall 5", capacity: 100 },
  { id: "AB1-108", name: "AB1-108", capacity: 80 },
  { id: "AB1-308", name: "AB1-308", capacity: 80 }
];

// Labs information
export const labVenues = [
  { id: "Ensemble", name: "Ensemble (LHC)", courses: ["CHM 114", "CHE 206", "CHE 316"] },
  { id: "Infinity", name: "Infinity (AB1)", courses: ["CHM 206", "ECS 330"] },
  { id: "Element", name: "Element (AB2)", courses: ["PHY 210", "PHY 406"] },
  { id: "Cell", name: "Cell (AB3)", courses: ["BIO 206", "BIO 308"] }
];

// Function to get available classrooms for a course
export function getAvailableClassrooms(courseId: string): string[] {
  const defaultClassrooms = classrooms.map(c => c.id);
  const labCourse = labVenues.find(lab => lab.courses.includes(courseId));
  
  if (labCourse) {
    return [labCourse.id];
  }
  
  return defaultClassrooms;
}

// Function to check for slot conflicts
export function hasSlotConflict(selectedCourses: string[]): boolean {
  const slotUsage: Record<string, string[]> = {};
  
  for (const courseId of selectedCourses) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      for (const slot of course.slots) {
        if (!slotUsage[slot]) {
          slotUsage[slot] = [];
        }
        slotUsage[slot].push(courseId);
      }
    }
  }
  
  // Check if any slot has more than one course
  for (const slot in slotUsage) {
    if (slotUsage[slot].length > 1) {
      return true;
    }
  }
  
  return false;
}

// Function to generate timetable
export function generateTimetable(selectedCourseIds: string[]) {
  if (hasSlotConflict(selectedCourseIds)) {
    return { error: "Slot conflict detected. Please select different courses." };
  }
  
  const timetable: Record<string, Record<string, any[]>> = {
    "Monday": {},
    "Tuesday": {},
    "Wednesday": {},
    "Thursday": {},
    "Friday": {},
    "Saturday": {}
  };
  
  // Initialize time slots
  const timeSlots = [
    "09:00-09:55", "10:00-10:55", "11:00-11:55", "12:00-12:55",
    "14:00-14:55", "15:00-15:55", "16:00-16:55", "17:00-17:55", "18:00-18:55"
  ];
  
  timeSlots.forEach(time => {
    Object.keys(timetable).forEach(day => {
      timetable[day][time] = [];
    });
  });
  
  // Fill timetable with selected courses
  selectedCourseIds.forEach(courseId => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    // Add lectures
    course.slots.forEach(slot => {
      const slotTimes = slotTimings[slot] || [];
      slotTimes.forEach(({ day, time }) => {
        if (timetable[day] && timetable[day][time]) {
          timetable[day][time].push({
            courseId: course.id,
            name: course.name,
            slot: slot,
            location: getRandomClassroom(course.id),
            type: "Lecture"
          });
        }
      });
    });
    
    // Add labs
    if (course.labs) {
      course.labs.forEach(lab => {
        const [startTime, endTime] = convertLabTimeToSlots(lab.time);
        if (timetable[lab.day]) {
          for (let time of getTimeSlotsBetween(startTime, endTime)) {
            if (timetable[lab.day][time]) {
              timetable[lab.day][time].push({
                courseId: course.id,
                name: course.name,
                type: "Lab Session",
                location: "L4",
                time: lab.time
              });
            }
          }
        }
      });
    }
    
    // Add tutorials
    if (course.tutorials) {
      course.tutorials.forEach(tutorial => {
        const [startTime, endTime] = convertLabTimeToSlots(tutorial.time);
        if (timetable[tutorial.day]) {
          for (let time of getTimeSlotsBetween(startTime, endTime)) {
            if (timetable[tutorial.day][time]) {
              timetable[tutorial.day][time].push({
                courseId: course.id,
                name: course.name,
                type: "Tutorial",
                location: course.location || "L3",
                time: tutorial.time,
                notes: course.notes
              });
            }
          }
        }
      });
    }
  });
  
  return timetable;
}

// Helper function to get time slots between start and end
function getTimeSlotsBetween(start: string, end: string): string[] {
  const slots = [
    "09:00-09:55", "10:00-10:55", "11:00-11:55", "12:00-12:55",
    "14:00-14:55", "15:00-15:55", "16:00-16:55", "17:00-17:55", "18:00-18:55"
  ];
  
  const startIdx = slots.findIndex(slot => slot.startsWith(start));
  const endIdx = slots.findIndex(slot => slot.endsWith(end));
  
  if (startIdx === -1 || endIdx === -1) return [];
  
  return slots.slice(startIdx, endIdx + 1);
}

// Helper function to convert lab time to standard slots
function convertLabTimeToSlots(labTime: string): [string, string] {
  const [startTime, endTime] = labTime.split(" - ");
  
  // Convert to 24-hour format
  const convertTo24Hour = (time: string): string => {
    let [hours, minutes] = time.split(":");
    const period = minutes.includes("PM") ? "PM" : "AM";
    minutes = minutes.replace(" AM", "").replace(" PM", "");
    
    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }
    
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  };
  
  return [convertTo24Hour(startTime), convertTo24Hour(endTime)];
}

// Helper function to get a random classroom
function getRandomClassroom(courseId: string): string {
  const availableRooms = getAvailableClassrooms(courseId);
  return availableRooms[Math.floor(Math.random() * availableRooms.length)];
}