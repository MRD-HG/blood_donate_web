import React from 'react';
import './Modal.css';

export default function DeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-icon delete-icon">
            <div className="delete-trash">🗑️</div>
          </div>
          
          <h3 className="modal-title">تأكد من حذف المعلومات</h3>
          
          <div className="modal-buttons">
            <button 
              onClick={onConfirm}
              className="modal-btn confirm-btn"
            >
              نعم
            </button>
            <button 
              onClick={onCancel}
              className="modal-btn cancel-btn"
            >
              لا
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

