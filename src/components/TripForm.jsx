import React, { useState } from "react";

const TripForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    currentLocation: "",
    pickupLocation: "",
    dropoffLocation: "",
    cycleUsed: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cycleUsed" ? (value ? parseFloat(value) : "") : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.currentLocation || !formData.pickupLocation || !formData.dropoffLocation || !formData.cycleUsed) {
      alert("Please fill in all fields.");
      return;
    }
    onSubmit({
      current_location: formData.currentLocation,
      pickup_location: formData.pickupLocation,
      dropoff_location: formData.dropoffLocation,
      cycle_used: formData.cycleUsed,
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Plan Your Trip</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Current Location</label>
          <input
            type="text"
            name="currentLocation"
            value={formData.currentLocation}
            onChange={handleChange}
            placeholder="e.g., New York, NY"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            placeholder="e.g., Chicago, IL"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Dropoff Location</label>
          <input
            type="text"
            name="dropoffLocation"
            value={formData.dropoffLocation}
            onChange={handleChange}
            placeholder="e.g., Los Angeles, CA"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Current Cycle Used (Hrs)</label>
          <input
            type="number"
            name="cycleUsed"
            value={formData.cycleUsed}
            onChange={handleChange}
            placeholder="e.g., 20"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            step="0.1"
            min="0"
            max="70"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Plan Trip
        </button>
      </form>
    </div>
  );
};

export default TripForm;