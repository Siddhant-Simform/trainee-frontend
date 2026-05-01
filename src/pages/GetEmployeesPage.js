import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
function DeleteModal({ employee, onConfirm, onCancel, loading }) {
  if (!employee) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal">
        <div className="modal-icon">🗑️</div>
        <h3>Delete Employee?</h3>
        <p>You are about to permanently delete</p>
        <p><strong className="modal-employee-name">{employee.name}</strong></p>
        <p style={{ marginTop: '6px', fontSize: '0.8rem' }}>ID #{employee.id} · {employee.email}</p>
        <p style={{ marginTop: '10px', color: '#fc8181', fontSize: '0.82rem' }}>
          This action cannot be undone. The employee record and profile photo will be permanently removed.
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <><span className="loading-spinner"></span>Deleting…</> : '🗑 Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function GetEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true); setError(''); setSuccess('');
      const response = await axios.get(`${API_URL}/employees`);
      if (response.data.success) {
        setEmployees(response.data.data);
        setSuccess(`✓ ${response.data.data.length} employee${response.data.data.length !== 1 ? 's' : ''} loaded`);
        setTimeout(() => setSuccess(''), 3000);
      } else { setError('Failed to fetch employees'); }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching employees');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await axios.delete(`${API_URL}/employees/${deleteTarget.id}`);
      setEmployees(prev => prev.filter(e => e.id !== deleteTarget.id));
      setSuccess(`✓ ${deleteTarget.name} has been deleted.`);
      setTimeout(() => setSuccess(''), 4000);
      setDeleteTarget(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete employee');
      setDeleteTarget(null);
    } finally { setDeleteLoading(false); }
  };

  const formatSalary = (salary) => {
    const n = parseFloat(salary);
    return isNaN(n) ? 'N/A' : '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="page-container">
      <h2 className="page-title"><span className="page-title-icon">👥</span>Employees</h2>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">⚠ {error}</div>}

      <div className="stats-bar">
        <span className="stats-count">
          Total: <strong>{employees.length}</strong> employee{employees.length !== 1 ? 's' : ''}
        </span>
        <button className="btn btn-primary" onClick={fetchEmployees} disabled={loading}>
          {loading ? <><span className="loading-spinner"></span>Loading…</> : '↻ Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="loading"><span className="loading-spinner"></span>Loading employees…</div>
      ) : employees.length > 0 ? (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th className="avatar-cell"></th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td className="avatar-cell">
                    {emp.profile_image
                      ? <img src={emp.profile_image} alt={emp.name} className="avatar" />
                      : <div className="avatar-placeholder">{emp.name?.charAt(0)?.toUpperCase()}</div>
                    }
                  </td>
                  <td><span className="badge badge-blue">#{emp.id}</span></td>
                  <td style={{ fontWeight: 600, color: '#e2e8f0' }}>{emp.name}</td>
                  <td style={{ color: '#94a3b8' }}>{emp.email}</td>
                  <td>{emp.position || <span style={{ color: '#4a5568' }}>—</span>}</td>
                  <td style={{ fontFamily: 'monospace', color: '#68d391' }}>{formatSalary(emp.salary)}</td>
                  <td style={{ color: '#718096', fontSize: '0.85rem' }}>{formatDate(emp.created_at)}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-icon"
                      title={`Delete ${emp.name}`}
                      onClick={() => setDeleteTarget(emp)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">
          <div className="no-data-icon">📭</div>
          <p>No employees found.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Use the <strong>Add Employee</strong> page to create one.</p>
        </div>
      )}

      <DeleteModal
        employee={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </div>
  );
}

export default GetEmployeesPage;
