import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/axios';
import { repairs } from '../data/services';

const ScheduleRepair = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    repairType: '',
    description: '',
    date: '',
    time: '',
  });
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if a repair type was passed in the location state
  useEffect(() => {
    if (location.state) {
      const newFormData = { ...formData };
      
      if (location.state.repairType) {
        newFormData.repairType = location.state.repairType;
      }
      
      if (location.state.description) {
        newFormData.description = location.state.description;
      }
      
      setFormData(newFormData);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add console log to debug the data being sent
      console.log('Submitting repair booking with data:', formData);
      
      const response = await api.post('/repairs/schedule', formData);
      console.log('Repair booking response:', response.data);
      
      setSubmitStatus({ type: 'success', message: response.data.message });
      setShowModal(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        contact: '',
        address: '',
        repairType: '',
        description: '',
        date: '',
        time: '',
      });
    } catch (error) {
      console.error('Error scheduling repair:', error);
      
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.message || 'An error occurred while scheduling the repair. Please try again.'
      });
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date formatted for the date input min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Schedule a Repair</h1>
      
      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className={`text-center ${submitStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              <div className="text-xl font-semibold mb-4">
                {submitStatus.type === 'success' ? 'Success!' : 'Error'}
              </div>
              <p className="mb-6">{submitStatus.message}</p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Repair Type</label>
          <select
            name="repairType"
            value={formData.repairType}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="">Select a repair type</option>
            {repairs.map((repair) => (
              <option key={repair.id} value={repair.category}>
                {repair.category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Please describe the issue you're experiencing..."
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={today}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="">Select a time slot</option>
            <option value="9:00 AM - 12:00 PM">Morning (9:00 AM - 12:00 PM)</option>
            <option value="12:00 PM - 3:00 PM">Early Afternoon (12:00 PM - 3:00 PM)</option>
            <option value="3:00 PM - 6:00 PM">Late Afternoon (3:00 PM - 6:00 PM)</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors mt-4 disabled:opacity-50"
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Repair'}
        </button>
      </form>
    </div>
  );
};

export default ScheduleRepair;