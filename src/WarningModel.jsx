import React from 'react';
import './Modal.css';

export default function WarningModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  const defaultMessage = "تأكد من جميع المعلومات";

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-icon warning-icon">
            <div className="warning-triangle">⚠</div>
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

