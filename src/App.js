import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GetEmployeesPage from './pages/GetEmployeesPage';
import CreateEmployeePage from './pages/CreateEmployeePage';
import UpdateEmployeePage from './pages/UpdateEmployeePage';

function App() {
  const [currentPage, setCurrentPage] = useState('get');

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>Employee Management System By Siddhant Rathod</h1>
          <div className="nav-links">
            <Link 
              to="/" 
              className={currentPage === 'get' ? 'active' : ''}
              onClick={() => handleNavigation('get')}
            >
              View Employees (GET)
            </Link>
            <Link 
              to="/create" 
              className={currentPage === 'create' ? 'active' : ''}
              onClick={() => handleNavigation('create')}
            >
              Add Employee (POST)
            </Link>
            <Link 
              to="/update" 
              className={currentPage === 'update' ? 'active' : ''}
              onClick={() => handleNavigation('update')}
            >
              Update Employee (PUT)
            </Link>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<GetEmployeesPage />} />
            <Route path="/create" element={<CreateEmployeePage />} />
            <Route path="/update" element={<UpdateEmployeePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
