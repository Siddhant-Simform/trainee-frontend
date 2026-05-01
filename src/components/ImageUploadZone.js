import React, { useState } from 'react';

function App() { return null; }

// =====================
// Image Upload Zone Component
// =====================
export function ImageUploadZone({ imagePreview, onFileChange, onRemove, label = "Profile Photo" }) {
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
      <label>{label}</label>
      {imagePreview ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
            <button
              type="button"
              className="image-remove-btn"
              onClick={onRemove}
              title="Remove image"
            >✕</button>
          </div>
          <div>
            <p style={{ color: '#68d391', fontSize: '0.85rem', marginBottom: '6px' }}>✓ Image selected</p>
            <button type="button" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => document.getElementById('photo-input-create').click()}>
              Change Photo
            </button>
            <input id="photo-input-create" type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
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
          <p className="upload-text">Drop an image here or <strong style={{ color: '#61dafb' }}>click to browse</strong></p>
          <p className="upload-hint">JPEG, PNG, GIF, WebP — max 5 MB</p>
        </div>
      )}
    </div>
  );
}

export default App;
