import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '../../services/dataService';
import toast from 'react-hot-toast';

export default function FileUploader({ onUpload, currentUrl, label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setProgress(30);
    try {
      const res = await uploadImage(file);
      setProgress(100);
      onUpload(res.data.url);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed. Please try again.');
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  }, [currentUrl, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] }, maxFiles: 1,
  });

  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: 8 }}>{label}</label>}
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`} style={{ position: 'relative' }}>
        <input {...getInputProps()} />
        {preview ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <img src={preview} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
            <span style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
              {uploading ? 'Uploading...' : 'Click or drag to replace'}
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--color-on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-outline)' }}>cloud_upload</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{isDragActive ? 'Drop here!' : 'Drag & drop or click to upload'}</span>
            <span style={{ fontSize: 12, color: 'var(--color-outline)' }}>JPG, PNG, WEBP up to 10MB</span>
          </div>
        )}
        {uploading && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'var(--color-outline-variant)', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))', transition: 'width 0.3s ease', borderRadius: 'inherit' }} />
          </div>
        )}
      </div>
    </div>
  );
}
