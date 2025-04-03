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
      <h2 className="text-xl text-center font-bold mb-4 text-gray-800">Plan Your Trip</h2>
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Location</label>
            <input
              type="text"
              name="currentLocation"
              value={formData.currentLocation}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="e.g., New York, NY"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="e.g., Chicago, IL"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dropoff Location</label>
            <input
              type="text"
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="e.g., Los Angeles, CA"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Cycle Used (hours)</label>
            <input
              type="number"
              name="cycleUsed"
              value={formData.cycleUsed}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="e.g., 20"
              step="0.1"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Plan Trip
        </button>
      </form>
    </div>
  );
};

export default TripForm;