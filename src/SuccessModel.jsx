import React from 'react';
import './Modal.css';

export default function SuccessModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  const defaultMessage = "تم التسجيل بنجاح";

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-icon success-icon">
            <div className="checkmark">✓</div>
          </div>
          
          <h3 className="modal-title">{message || defaultMessage}</h3>
          
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