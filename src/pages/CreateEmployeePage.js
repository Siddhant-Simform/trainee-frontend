import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

// ─── Drag-and-drop image zone ───────────────────────────────────────────────
function ImageUploadZone({ preview, onFileChange, onRemove, inputId }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    setDragOver(e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileChange({ target: { files: [file] } });
  };

  return (
    <div className="form-group">
      <label>Profile Photo <span style={{ color: '#4a5568', fontWeight: 400 }}>(optional)</span></label>
      {preview ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="image-preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <button type="button" className="image-remove-btn" onClick={onRemove} title="Remove">✕</button>
          </div>
          <div>
            <p style={{ color: '#68d391', fontSize: '0.85rem', marginBottom: '8px' }}>✓ Image selected</p>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => document.getElementById(inputId).click()}
            >
              Change Photo
            </button>
            <input id={inputId} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
          </div>
        </div>
      ) : (
        <div
          className={`image-upload-zone${dragOver ? ' dragover' : ''}`}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input type="file" accept="image/*" onChange={onFileChange} />
          <div className="upload-icon">📸</div>
          <p className="upload-text">Drop a photo here or <strong style={{ color: '#61dafb' }}>click to browse</strong></p>
          <p className="upload-hint">JPEG, PNG, GIF, WebP — max 5 MB</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
function CreateEmployeePage() {
  const [formData, setFormData] = useState({ name: '', email: '', position: '', salary: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createdEmployee, setCreatedEmployee] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5 MB'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { setError('Name is required'); return; }
    if (!formData.email.trim()) { setError('Email is required'); return; }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
      if (imageFile) payload.append('profile_image', imageFile);

      const response = await axios.post(`${API_URL}/employees`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setSuccess('✓ Employee created successfully!');
        setCreatedEmployee(response.data.data);
        setFormData({ name: '', email: '', position: '', salary: '' });
        setImageFile(null);
        setImagePreview('');
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to create employee');
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Email already exists. Please use a different email.');
      } else {
        setError(err.response?.data?.message || err.message || 'Error creating employee');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', position: '', salary: '' });
    setImageFile(null);
    setImagePreview('');
    setError('');
    setSuccess('');
    setCreatedEmployee(null);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">
        <span className="page-title-icon">➕</span>
        Add New Employee
      </h2>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">⚠ {error}</div>}

      <div className="section">
        <form onSubmit={handleSubmit}>
          {/* Image upload */}
          <ImageUploadZone
            preview={imagePreview}
            onFileChange={handleFileChange}
            onRemove={handleRemoveImage}
            inputId="photo-change-create"
          />

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                placeholder="Enter employee name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="Enter employee email" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input type="text" id="position" name="position" value={formData.position} onChange={handleChange}
                placeholder="e.g., Developer, Designer, Manager" />
            </div>
            <div className="form-group">
              <label htmlFor="salary">Salary ($)</label>
              <input type="number" id="salary" name="salary" value={formData.salary} onChange={handleChange}
                placeholder="Enter annual salary" min="0" step="0.01" />
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (<><span className="loading-spinner"></span>Creating…</>) : '✓ Create Employee'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={loading}>
              Reset Form
            </button>
          </div>
        </form>
      </div>

      {/* Result card */}
      {createdEmployee && (
        <div className="section">
          <h3 className="section-title">Created Employee</h3>
          <div className="result-card">
            <div className="result-card-avatar">
              {createdEmployee.profile_image
                ? <img src={createdEmployee.profile_image} alt={createdEmployee.name} />
                : <div className="avatar-placeholder-lg">{createdEmployee.name?.charAt(0)?.toUpperCase()}</div>
              }
            </div>
            <div className="result-card-info">
              <h4>{createdEmployee.name}</h4>
              <div className="result-card-meta">
                <span className="result-meta-item">ID: <span>#{createdEmployee.id}</span></span>
                <span className="result-meta-item">Email: <span>{createdEmployee.email}</span></span>
                {createdEmployee.position && <span className="result-meta-item">Role: <span>{createdEmployee.position}</span></span>}
                {createdEmployee.salary && <span className="result-meta-item">Salary: <span>${parseFloat(createdEmployee.salary).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></span>}
              </div>
            </div>
            <span className="badge badge-blue">New</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEmployeePage;
