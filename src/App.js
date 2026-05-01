import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import GetEmployeesPage from './pages/GetEmployeesPage';
import CreateEmployeePage from './pages/CreateEmployeePage';
import UpdateEmployeePage from './pages/UpdateEmployeePage';

const navItems = [
  { to: '/',       label: '👥 View Employees',   key: '/'       },
  { to: '/create', label: '➕ Add Employee',      key: '/create' },
  { to: '/update', label: '✏️ Update Employee',  key: '/update' },
];

function NavLinks() {
  const location = useLocation();
  return (
    <div className="nav-links">
      {navItems.map(({ to, label, key }) => (
        <Link
          key={key}
          to={to}
          className={location.pathname === key ? 'active' : ''}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-inner">
            <h1>⚡ Employee Management System</h1>
            <NavLinks />
          </div>
        </nav>
        <div className="container">
          <Routes>
            <Route path="/"       element={<GetEmployeesPage />} />
            <Route path="/create" element={<CreateEmployeePage />} />
            <Route path="/update" element={<UpdateEmployeePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
