# IISERB Timetable Generator

A web application for generating conflict-free timetables for IISER Bhopal courses. The application allows users to select courses and automatically generates a timetable that avoids scheduling conflicts, taking into account lectures, labs, and tutorials.

## Features

- Interactive course selection interface
- Automatic conflict detection
- Support for lectures, labs, and tutorials
- PDF export functionality
- Responsive design that works on all devices

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
  https://github.com/alias1947/timetable_iiser
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

## Running the Application

1. Start the backend server (from the root directory):
   ```bash
   npm run dev
   ```
   The backend will run on http://localhost:5000

2. In a new terminal, start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```
   The frontend will run on http://localhost:5173

3. Open your browser and navigate to http://localhost:5173

## Usage

1. Select the courses you want to include in your timetable from the list on the left
2. Click the "Generate Timetable" button
3. View your generated timetable
4. Use the "Download PDF" button to save your timetable as a PDF file

## Project Structure

```
timetable-generator/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── data/         # Course and timeslot data
│   │   ├── types/        # TypeScript type definitions
│   │   └── App.tsx       # Main application component
├── src/                   # Backend Express server
│   ├── server.ts         # Express server setup
│   └── timetableGenerator.ts  # Timetable generation logic
├── package.json          # Backend dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- IISER Bhopal for the course and timetable structure
- Material-UI for the component library
- React and Express.js communities 
