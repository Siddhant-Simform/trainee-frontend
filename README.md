# Sid Trainee Frontend - Employee Management 

A React-based frontend application for managing employees, consuming the backend API.

## Features

- **View Employees (GET)**: Fetch and display all employees from the database
- **Add Employee (POST)**: Create new employees via a form
- **Update Employee (PUT)**: Modify existing employee information

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`

3. **Make sure Backend is Running**
   - The backend should be running on `http://localhost:5000`
   - Update the `API_BASE_URL` in each page component if using a different URL

## Project Structure

```
src/
├── index.js           # React entry point
├── index.css          # Global styles
├── App.js             # Main component with routing
├── App.css            # App styles
└── pages/
    ├── GetEmployeesPage.js      # View employees (GET)
    ├── CreateEmployeePage.js    # Add employees (POST)
    └── UpdateEmployeePage.js    # Update employees (PUT)
```

## Available Pages

### 1. View Employees (GET)
- Browse all employees in a table format
- Refresh the employee list
- Displays ID, Name, Email, Position, Salary, and Creation Date

### 2. Add Employee (POST)
- Fill out form to create a new employee
- Required fields: Name, Email
- Optional fields: Position, Salary
- Displays the newly created employee after successful submission

### 3. Update Employee (PUT)
- Enter the Employee ID to find the employee
- Update any employee information
- Required fields: Name, Email
- Optional fields: Position, Salary

## Building for Production

```bash
npm run build
```

This creates a production build in the `build` folder.

## Technologies Used

- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling

## Notes

- Ensure the backend server is running before using the frontend
- The backend should have CORS enabled to allow requests from React frontend
- API Base URL is set to `http://localhost:5000/api` by default
