import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

function ImageUploadZone({ preview, onFileChange, onRemove, inputId }) {
  const [dragOver, setDragOver] = useState(false);
  const handleDrag = (e) => { e.preventDefault(); setDragOver(e.type === 'dragover'); };
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileChange({ target: { files: [file] } });
  };
  return (
    <div className="form-group">
      <label>New Profile Photo <span style={{ color: '#4a5568', fontWeight: 400 }}>(leave empty to keep existing)</span></label>
      {preview ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="image-preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <button type="button" className="image-remove-btn" onClick={onRemove} title="Remove">✕</button>
          </div>
          <div>
            <p style={{ color: '#68d391', fontSize: '0.85rem', marginBottom: '8px' }}>✓ New image selected</p>
            <button type="button" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => document.getElementById(inputId).click()}>Change Photo</button>
            <input id={inputId} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
          </div>
        </div>
      ) : (
        <div className={`image-upload-zone${dragOver ? ' dragover' : ''}`}
          onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}>
          <input type="file" accept="image/*" onChange={onFileChange} />
          <div className="upload-icon">📸</div>
          <p className="upload-text">Drop a new photo here or <strong style={{ color: '#61dafb' }}>click to browse</strong></p>
          <p className="upload-hint">JPEG, PNG, GIF, WebP — max 5 MB</p>
        </div>
      )}
    </div>
  );
}

function UpdateEmployeePage() {
  const [employeeId, setEmployeeId] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', position: '', salary: '' });
  const [currentImage, setCurrentImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteImgLoading, setDeleteImgLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [updatedEmployee, setUpdatedEmployee] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFetchEmployee = async () => {
    if (!employeeId.trim()) { setError('Please enter an employee ID'); return; }
    try {
      setLoading(true); setError(''); setSuccess(''); setUpdatedEmployee(null);
      const response = await axios.get(`${API_URL}/employees/${employeeId}`);
      if (response.data.success) {
        const emp = response.data.data;
        setFormData({ name: emp.name, email: emp.email, position: emp.position || '', salary: emp.salary || '' });
        setCurrentImage(emp.profile_image || null);
        setNewImageFile(null); setNewImagePreview('');
        setShowForm(true);
        setSuccess('✓ Employee found! You can now update the information.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.status === 404 ? 'Employee not found with this ID' : (err.message || 'Error fetching employee'));
      setShowForm(false);
    } finally { setLoading(false); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5 MB'); return; }
    setNewImageFile(file); setNewImagePreview(URL.createObjectURL(file)); setError('');
  };

  const handleDeleteCurrentImage = async () => {
    if (!window.confirm('Remove the current profile photo?')) return;
    try {
      setDeleteImgLoading(true);
      await axios.delete(`${API_URL}/employees/${employeeId}/image`);
      setCurrentImage(null);
      setSuccess('✓ Profile photo removed.'); setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Failed to remove image'); } finally { setDeleteImgLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { setError('Name is required'); return; }
    if (!formData.email.trim()) { setError('Email is required'); return; }
    try {
      setLoading(true); setError(''); setSuccess('');
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
      if (newImageFile) payload.append('profile_image', newImageFile);
      const response = await axios.put(`${API_URL}/employees/${employeeId}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setSuccess('✓ Employee updated successfully!');
        setUpdatedEmployee(response.data.data);
        setCurrentImage(response.data.data.profile_image || null);
        setNewImageFile(null); setNewImagePreview('');
        setTimeout(() => setSuccess(''), 5000);
      } else { setError('Failed to update employee'); }
    } catch (err) { setError(err.response?.data?.message || err.message || 'Error updating employee'); }
    finally { setLoading(false); }
  };

  const handleReset = () => {
    setEmployeeId(''); setFormData({ name: '', email: '', position: '', salary: '' });
    setCurrentImage(null); setNewImageFile(null); setNewImagePreview('');
    setError(''); setSuccess(''); setShowForm(false); setUpdatedEmployee(null);
  };

  return (
    <div className="page-container">
      <h2 className="page-title"><span className="page-title-icon">✏️</span>Update Employee</h2>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">⚠ {error}</div>}

      <div className="section">
        <h3 className="section-title">Step 1 — Find Employee</h3>
        <div className="inline-form">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="employeeId">Employee ID *</label>
            <input type="number" id="employeeId" value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter employee ID to update" min="1"
              onKeyDown={(e) => e.key === 'Enter' && handleFetchEmployee()} />
          </div>
          <button className="btn btn-primary" onClick={handleFetchEmployee} disabled={loading || !employeeId}>
            {loading && !showForm ? <><span className="loading-spinner"></span>Searching…</> : '🔍 Find Employee'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="section">
          <h3 className="section-title">Step 2 — Update Information</h3>
          <form onSubmit={handleSubmit}>
            {currentImage && !newImageFile && (
              <div className="current-image-section">
                <img src={currentImage} alt="Current profile" className="image-preview-large" />
                <div className="current-image-info">
                  <p>Current profile photo</p>
                  <div className="btn-group">
                    <button type="button" className="btn btn-warning" style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      onClick={() => document.getElementById('replace-photo-input').click()}>🔄 Replace</button>
                    <input id="replace-photo-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                    <button type="button" className="btn btn-danger" style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      onClick={handleDeleteCurrentImage} disabled={deleteImgLoading}>
                      {deleteImgLoading ? '…' : '🗑 Delete Photo'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!currentImage && (
              <ImageUploadZone preview={newImagePreview} onFileChange={handleFileChange}
                onRemove={() => { setNewImageFile(null); setNewImagePreview(''); }} inputId="photo-change-update" />
            )}
            {currentImage && newImageFile && (
              <div className="form-group">
                <label>Replacing with new photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="image-preview-container">
                    <img src={newImagePreview} alt="New preview" className="image-preview" />
                    <button type="button" className="image-remove-btn"
                      onClick={() => { setNewImageFile(null); setNewImagePreview(''); }} title="Cancel replace">✕</button>
                  </div>
                  <p style={{ color: '#68d391', fontSize: '0.85rem' }}>✓ New image will replace current on save</p>
                </div>
              </div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter employee name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter employee email" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input type="text" id="position" name="position" value={formData.position} onChange={handleChange} placeholder="e.g., Developer, Designer, Manager" />
              </div>
              <div className="form-group">
                <label htmlFor="salary">Salary ($)</label>
                <input type="number" id="salary" name="salary" value={formData.salary} onChange={handleChange} placeholder="Enter annual salary" min="0" step="0.01" />
              </div>
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="loading-spinner"></span>Updating…</> : '✓ Save Changes'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={loading}>Reset</button>
            </div>
          </form>
        </div>
      )}

      {updatedEmployee && (
        <div className="section">
          <h3 className="section-title">Updated Employee</h3>
          <div className="result-card">
            <div className="result-card-avatar">
              {updatedEmployee.profile_image
                ? <img src={updatedEmployee.profile_image} alt={updatedEmployee.name} />
                : <div className="avatar-placeholder-lg">{updatedEmployee.name?.charAt(0)?.toUpperCase()}</div>
              }
            </div>
            <div className="result-card-info">
              <h4>{updatedEmployee.name}</h4>
              <div className="result-card-meta">
                <span className="result-meta-item">ID: <span>#{updatedEmployee.id}</span></span>
                <span className="result-meta-item">Email: <span>{updatedEmployee.email}</span></span>
                {updatedEmployee.position && <span className="result-meta-item">Role: <span>{updatedEmployee.position}</span></span>}
                {updatedEmployee.salary && <span className="result-meta-item">Salary: <span>${parseFloat(updatedEmployee.salary).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></span>}
              </div>
            </div>
            <span className="badge badge-blue">Updated</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateEmployeePage;
