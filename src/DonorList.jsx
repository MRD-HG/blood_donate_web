import React, { useState, useEffect } from 'react';
import apiService from './apiService';
import DeleteModal from './DeleteModel';
import SuccessModal from './SuccessModel';
import WarningModal from './WarningModel';
import './DonorList.css';

export default function DonorList({ refreshTrigger }) {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load donors from API
  const loadDonors = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDonors();
      setDonors(response || []);
      setError('');
    } catch (err) {
      console.error('Error loading donors:', err);
      setError('Erreur lors du chargement des données');
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  // Load donors on component mount and when refreshTrigger changes
  useEffect(() => {
    loadDonors();
  }, [refreshTrigger]);

  // Handle view donor details
  const handleView = (donor) => {
    const formattedDonor = apiService.formatDonorForDisplay(donor);
    alert(`Détails du donneur:
    
Nom: ${formattedDonor.fullName}
Téléphone: ${formattedDonor.phone}
Date de naissance: ${formattedDonor.formattedBirthDate}
Âge: ${formattedDonor.age} ans
Genre: ${formattedDonor.genderText}
Adresse: ${formattedDonor.address}
ID: ${formattedDonor.generatedId || 'Non spécifié'}
Nombre de dons: ${formattedDonor.numberDonation}`);
  };

  // Handle edit donor (placeholder for now)
  const handleEdit = (donor) => {
    alert(`Fonction d'édition pour ${donor.fullName} sera implémentée prochainement.`);
  };

  // Handle delete donor
  const handleDelete = (donor) => {
    setSelectedDonor(donor);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedDonor) return;

    try {
      await apiService.deleteDonor(selectedDonor.idDonor);
      setShowDeleteModal(false);
      setSelectedDonor(null);
      setSuccessMessage('Donneur supprimé avec succès');
      setShowSuccessModal(true);
      // Reload the list
      loadDonors();
    } catch (error) {
      console.error('Error deleting donor:', error);
      setShowDeleteModal(false);
      setSelectedDonor(null);
      setErrorMessage('Erreur lors de la suppression: ' + error.message);
      setShowWarningModal(true);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedDonor(null);
  };

  // Handle modal closes
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSuccessMessage('');
  };

  const handleWarningModalClose = () => {
    setShowWarningModal(false);
    setErrorMessage('');
  };

  if (loading) {
    return (
      <div className="donor-list-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="donor-list-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadDonors} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-list-container">
      <div className="donor-list-header">
        <h2 className="donor-list-title">لائحة المتبرعين</h2>
        <p className="donor-count">Total: {donors.length} donneurs</p>
        <button onClick={loadDonors} className="refresh-btn">
          Actualiser
        </button>
      </div>

      {donors.length === 0 ? (
        <div className="empty-state">
          <p>Aucun donneur enregistré</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="donors-table">
            <thead>
              <tr>
                <th>ID Personnelle</th>
                <th>Nom et Prénom</th>
                <th>Téléphone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor) => (
                <tr key={donor.idDonor}>
                  <td>{donor.generatedId || `DN${donor.idDonor}`}</td>
                  <td>{donor.fullName}</td>
                  <td>{donor.phone}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleView(donor)}
                        className="action-btn view-btn"
                        title="Voir les détails"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleEdit(donor)}
                        className="action-btn edit-btn"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(donor)}
                        className="action-btn delete-btn"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        message={successMessage}
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

