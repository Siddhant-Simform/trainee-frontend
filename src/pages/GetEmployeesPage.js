import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api';

function GetEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await axios.get(`${API_BASE_URL}/employees`);
      
      if (response.data.success) {
        setEmployees(response.data.data);
        setSuccess('Employees loaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to fetch employees');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching employees');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">View All Employees (GET Request)</h2>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="btn-group">
        <button className="btn btn-primary" onClick={fetchEmployees} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Employees'}
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading employees...</div>
      ) : employees.length > 0 ? (
        <div>
          <p style={{ marginBottom: '15px', color: '#666' }}>
            Total Employees: <strong>{employees.length}</strong>
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.position || 'N/A'}</td>
                  <td>${parseFloat(employee.salary).toFixed(2)}</td>
                  <td>{new Date(employee.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">
          No employees found. Use the "Add Employee" page to create one.
        </div>
      )}
    </div>
  );
}

export default GetEmployeesPage;
