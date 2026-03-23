import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function UpdateEmployeePage() {
  const [employeeId, setEmployeeId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    salary: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [updatedEmployee, setUpdatedEmployee] = useState(null);

  const handleIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFetchEmployee = async () => {
    if (!employeeId.trim()) {
      setError('Please enter an employee ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await axios.get(`${API_BASE_URL}/employees`);
      const employee = response.data.data.find(emp => emp.id === parseInt(employeeId));

      if (employee) {
        setFormData({
          name: employee.name,
          email: employee.email,
          position: employee.position || '',
          salary: employee.salary || ''
        });
        setShowForm(true);
        setSuccess('Employee found! You can now update the information.');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Employee not found with this ID');
        setShowForm(false);
      }
    } catch (err) {
      setError(err.message || 'Error fetching employee');
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId.trim()) {
      setError('Employee ID is required');
      return;
    }
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await axios.put(
        `${API_BASE_URL}/employees/${employeeId}`,
        formData
      );

      if (response.data.success) {
        setSuccess('Employee updated successfully!');
        setUpdatedEmployee(response.data.data);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to update employee');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error updating employee');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmployeeId('');
    setFormData({
      name: '',
      email: '',
      position: '',
      salary: ''
    });
    setError('');
    setSuccess('');
    setShowForm(false);
    setUpdatedEmployee(null);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Update Employee (PUT Request)</h2>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="section">
        <h3 className="section-title">Step 1: Find Employee</h3>
        <div className="inline-form">
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID *</label>
            <input
              type="number"
              id="employeeId"
              value={employeeId}
              onChange={handleIdChange}
              placeholder="Enter employee ID to update"
              min="1"
            />
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handleFetchEmployee}
            disabled={loading || !employeeId}
          >
            {loading ? 'Loading...' : 'Find Employee'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="section">
          <h3 className="section-title">Step 2: Update Employee Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter employee email"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g., Developer, Designer, Manager"
                />
              </div>

              <div className="form-group">
                <label htmlFor="salary">Salary ($)</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Enter annual salary"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="btn-group">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Employee'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {updatedEmployee && (
        <div className="section">
          <h3 className="section-title">Updated Employee Information</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{updatedEmployee.id}</td>
                <td>{updatedEmployee.name}</td>
                <td>{updatedEmployee.email}</td>
                <td>{updatedEmployee.position || 'N/A'}</td>
                <td>${parseFloat(updatedEmployee.salary).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UpdateEmployeePage;
