// apiService.js - Service for communicating with the .NET Core backend

const API_BASE_URL = 'http://localhost:5209/api';//new port 

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making HTTP requests
  async makeRequest(url, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle empty responses (like DELETE operations)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all donors
  async getDonors() {
    const url = `${this.baseURL}/Donor`;
    return await this.makeRequest(url);
  }

  // Get a single donor by ID
  async getDonor(id) {
    const url = `${this.baseURL}/Donor/${id}`;
    return await this.makeRequest(url);
  }

  // Create a new donor
  async createDonor(donorData) {
    // Map form data to backend model
    const donorPayload = {
      fullName: donorData.name,
      phone: donorData.phone,
      birthDate: donorData.birthDate,
      age: this.calculateAge(donorData.birthDate),
      gender: donorData.gender === 'homme' ? 'Male' : 'Female',
      address: donorData.address,
      generatedId: donorData.personalId,
      numberDonation: parseInt(donorData.bloodDonation) || 0
    };

    const url = `${this.baseURL}/Donor`;
    return await this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(donorPayload)
    });
  }

  // Update an existing donor
  async updateDonor(id, donorData) {
    // Map form data to backend model
    const donorPayload = {
      idDonor: id,
      fullName: donorData.name,
      phone: donorData.phone,
      birthDate: donorData.birthDate,
      age: this.calculateAge(donorData.birthDate),
      gender: donorData.gender === 'homme' ? 'Male' : 'Female',
      address: donorData.address,
      generatedId: donorData.personalId,
      numberDonation: parseInt(donorData.bloodDonation) || 0
    };

    const url = `${this.baseURL}/Donor/${id}`;
    return await this.makeRequest(url, {
      method: 'PUT',
      body: JSON.stringify(donorPayload)
    });
  }

  // Delete a donor
  async deleteDonor(id) {
    const url = `${this.baseURL}/Donor/${id}`;
    return await this.makeRequest(url, {
      method: 'DELETE'
    });
  }

  // Helper method to calculate age
  calculateAge(birthDate) {
    if (!birthDate) return 0;
    
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= 0 ? age : 0;
  }

  // Format donor data for display
  formatDonorForDisplay(donor) {
    return {
      ...donor,
      formattedBirthDate: new Date(donor.birthDate).toLocaleDateString('fr-FR'),
      genderText: donor.gender === 'Male' ? 'Homme' : 'Femme'
    };
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;