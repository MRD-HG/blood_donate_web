import React, { useState } from "react";
import './App.css';
import amjadLogo from '../src/assets/Amjad.png';
import apiService from './apiService';
import SuccessModal from './SuccessModel';
import WarningModal from './WarningModel';

export default function DonorRegistrationForm({ onRegistrationSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    phone: '',
    gender: '',
    address: '',
    personalId: '',
    bloodDonation: ''
  });

  const [age, setAge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'birthDate') {
      if (value) {
        const birthDate = new Date(value);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        
        setAge(calculatedAge >= 0 ? calculatedAge : '');
      } else {
        setAge('');
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage('Le nom est requis');
      return false;
    }
    if (!formData.birthDate) {
      setErrorMessage('La date de naissance est requise');
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Le numéro de téléphone est requis');
      return false;
    }
    if (!formData.gender) {
      setErrorMessage('Le genre est requis');
      return false;
    }
    if (!formData.address.trim()) {
      setErrorMessage('L\'adresse est requise');
      return false;
    }
    if (age < 18 || age > 65) {
      setErrorMessage('L\'âge doit être entre 18 et 65 ans');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowWarningModal(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await apiService.createDonor(formData);
      console.log('Donor created successfully:', result);
      
      // Reset form
      setFormData({
        name: '',
        birthDate: '',
        phone: '',
        gender: '',
        address: '',
        personalId: '',
        bloodDonation: ''
      });
      setAge('');
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Notify parent component if callback provided
      if (onRegistrationSuccess) {
        onRegistrationSuccess(result);
      }
      
    } catch (error) {
      console.error('Error creating donor:', error);
      setErrorMessage('Erreur lors de l\'enregistrement: ' + error.message);
      setShowWarningModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  const handleWarningModalClose = () => {
    setShowWarningModal(false);
    setErrorMessage('');
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <div className="header">
          <div className="logo-container">
            <img
              src={amjadLogo}
              alt="Amjad Association Logo"
              className="logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          </div>
          <h1 className="form-title">استمارة تسجيل المتبرع</h1>
        </div>

        <form onSubmit={handleSubmit} className="volunteer-form">
          <div className="form-group">
            <label htmlFor="name">Nom et prénom</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Entrez votre nom complet"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-grow">
              <label htmlFor="birthDate">Date de Naissance</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="form-input"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="age-display-container">
              <div className="age-display">
                {age !== '' ? `${age} ans` : "Âge: -"}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Numéro de Téléphone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              placeholder="06 00 ** ** ** 00"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Genre</label>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="homme"
                  name="gender"
                  value="homme"
                  checked={formData.gender === 'homme'}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="homme">Homme</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="femme"
                  name="gender"
                  value="femme"
                  checked={formData.gender === 'femme'}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="femme">Femme</label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Adresse</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-textarea"
              rows="4"
              placeholder="Entrez votre adresse complète"
              required
              disabled={isSubmitting}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="personalId">ID Personnelle</label>
            <input
              type="text"
              id="personalId"
              name="personalId"
              value={formData.personalId}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Numéro d'identification"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bloodDonation">
              Combien de fois avez-vous donné votre sang avec notre association ?
            </label>
            <input
              type="number"
              id="bloodDonation"
              name="bloodDonation"
              value={formData.bloodDonation}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Nombre de dons"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            <span className="plus-icon">+</span>
            <span>{isSubmitting ? 'Enregistrement...' : 'تسجيل'}</span>
          </button>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onConfirm={handleSuccessModalClose}
        onCancel={handleSuccessModalClose}
      />

      {/* Warning Modal */}
      <WarningModal
        isOpen={showWarningModal}
        message={errorMessage}
        onConfirm={handleWarningModalClose}
        onCancel={handleWarningModalClose}
      />
    </div>
  );
}

