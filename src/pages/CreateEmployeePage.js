import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

function CreateEmployeePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    salary: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createdEmployee, setCreatedEmployee] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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

      const response = await axios.post(`${API_URL}/employees`, formData);

      if (response.data.success) {
        setSuccess('Employee created successfully!');
        setCreatedEmployee(response.data.data);
        setFormData({
          name: '',
          email: '',
          position: '',
          salary: ''
        });
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to create employee');
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Email already exists. Please use a different email.');
      } else {
        setError(err.response?.data?.message || err.message || 'Error creating employee');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      position: '',
      salary: ''
    });
    setError('');
    setSuccess('');
    setCreatedEmployee(null);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Add New Employee (POST Request)</h2>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="section">
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
              {loading ? 'Creating...' : 'Create Employee'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={loading}
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>

      {createdEmployee && (
        <div className="section">
          <h3 className="section-title">Recently Created Employee</h3>
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
                <td>{createdEmployee.id}</td>
                <td>{createdEmployee.name}</td>
                <td>{createdEmployee.email}</td>
                <td>{createdEmployee.position || 'N/A'}</td>
                <td>${parseFloat(createdEmployee.salary).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CreateEmployeePage;
