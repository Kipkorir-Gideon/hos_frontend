// App.js
import React, { useState } from "react";
import axios from "axios";
import TripForm from "./components/TripForm";
import RouteMap from "./components/RouteMap";
import DutyTimeline from "./components/DutyTimeline";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [tripState, setTripState] = useState({
    tripData: null,
    stops: [],
    routeCoordinates: [],
    startCoords: null,
    pickupCoords: null,
    stopCoords: [],
    endCoords: null,
    totalDrivingTime: null,
    totalOnDutyTime: null,
    remainingCycle: null,
    loading: false,
    error: null,
  });

  const planTrip = async (formData) => {
    setTripState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/plan-trip/`, formData);
      console.log("Backend response:", response.data);
      setTripState({
        tripData: response.data.trip || {},
        stops: response.data.stops || [],
        routeCoordinates: response.data.routeCoordinates || [],
        startCoords: response.data.startCoords || null,
        pickupCoords: response.data.pickupCoords || null,
        stopCoords: response.data.stopCoords || [],
        endCoords: response.data.endCoords || null,
        totalDrivingTime: response.data.totalDrivingTime || null,
        totalOnDutyTime: response.data.totalOnDutyTime || null,
        remainingCycle: response.data.remainingCycle || null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error planning trip:", error);
      setTripState((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.error || "Failed to plan trip.",
      }));
    }
  };

  const { tripData, stops, routeCoordinates, startCoords, pickupCoords, stopCoords, endCoords, totalDrivingTime, totalOnDutyTime, remainingCycle, loading, error } = tripState;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">ELD Trip Planner</h1>
        <TripForm onSubmit={planTrip} />
        {error && (
          <div className="text-center py-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-600">Planning your trip...</p>
          </div>
        )}
        {tripData && !loading && !error && (
          <>
            <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Trip Summary</h2>
              <p className="text-gray-700">
                <strong>Total Driving Time:</strong>{" "}
                {totalDrivingTime !== null ? `${totalDrivingTime.toFixed(2)} hours` : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Total On-Duty Time:</strong>{" "}
                {totalOnDutyTime !== null ? `${totalOnDutyTime.toFixed(2)} hours` : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Remaining Cycle:</strong>{" "}
                {remainingCycle !== null ? `${remainingCycle.toFixed(2)} hours` : "N/A"}
              </p>
            </div>

            <RouteMap
              start={tripData.currentLocation || "Unknown"}
              pickup={tripData.pickupLocation || "Unknown"}
              dropoff={tripData.dropoffLocation || "Unknown"}
              stops={stops}
              routeCoordinates={routeCoordinates}
              startCoords={startCoords}
              pickupCoords={pickupCoords}
              stopCoords={stopCoords}
              endCoords={endCoords}
            />

            {tripData.dutyStatuses && tripData.dutyStatuses.length > 0 ? (
              Object.entries(
                tripData.dutyStatuses.reduce((acc, status) => {
                  const date = status.date;
                  if (!acc[date]) acc[date] = [];
                  acc[date].push(status);
                  return acc;
                }, {})
              ).map(([date, statuses]) => (
                <DutyTimeline key={date} dutyStatuses={statuses} date={date} />
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600">No duty statuses available for this trip.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;