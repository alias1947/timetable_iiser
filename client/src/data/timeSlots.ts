export const timeSlots = [
    { start: "09:00", end: "09:55" },
    { start: "10:00", end: "10:55" },
    { start: "11:00", end: "11:55" },
    { start: "12:00", end: "12:55" },
    { start: "13:00", end: "14:00" }, // Lunch break
    { start: "14:00", end: "14:55" },
    { start: "15:00", end: "15:55" },
    { start: "16:00", end: "16:55" },
    { start: "17:00", end: "17:55" },
    { start: "18:00", end: "18:55" }
  ];
  
  // Map to help translate between 12-hour and 24-hour time formats
  export const timeFormatMapping = {
    "09:00": "9:00 am",
    "10:00": "10:00 am",
    "11:00": "11:00 am",
    "12:00": "12:00 pm",
    "14:00": "2:00 pm",
    "15:00": "3:00 pm",
    "16:00": "4:00 pm", 
    "17:00": "5:00 pm",
    "18:00": "6:00 pm"
  };
  
  // Helper function to get the correct time slot for a given course slot
  export function getTimeSlotForCourseSlot(slot: string): string {
    const slotTimeMap: Record<string, string> = {
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
      'M': '14:00-14:55',
      'N': '14:00-14:55',
      'O': '14:00-14:55'
    };
    
    return slotTimeMap[slot] || 'Special';
  }
  
  // Day-slot matrix according to the official document
  export const daySlotMatrix = {
    "Monday": ["A", "C", "D", "G", "H", "I", "J", "K", "N"],
    "Tuesday": ["A", "D", "E", "F", "H", "I", "J", "L", "N"],
    "Wednesday": ["C", "B", "D", "F", "H", "I", "J", "M", "O"],
    "Thursday": ["A", "B", "E", "F", "G", "K", "L", "M", "O"],
    "Friday": ["C", "B", "E", "G", "K", "N", "L", "M", "O"],
    "Saturday": [] // For tutorials and special sessions
  };