import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import axios from "axios";
import LogSheet from "./LogSheet";
import "leaflet/dist/leaflet.css";

const MapUpdater = ({ center, route }) => {
  const map = useMap();
  useEffect(() => {
    if (route.length > 0) {
      map.invalidateSize();
      map.fitBounds(route.map((coord) => [coord[1]]));
    }
  }, [map, route]);
  return null;
};

function App() {
  const [formData, setFormData] = useState({
    currentLocation: "",
    pickupLocation: "",
    dropoffLocation: "",
    currentCycleHours: 0,
  });
  const [errors, setErrors] = useState({});
  const [route, setRoute] = useState(null);
  const [logs, setLogs] = useState([]);
  const [stops, setStops] = useState([]);
  const defaultCenter = [39.8283, -98.5795];

  const validateForm = () => {
    const newErrors = {};
    const coordRegex = /^-?\d+(\.\d+)?, ?-?\d+(\.\d+)?$/;
    if (!coordRegex.test(formData.currentLocation))
      newErrors.currentLocation = "Invalid coordinates (lng,lat)";
    if (!coordRegex.test(formData.pickupLocation))
      newErrors.pickupLocation = "Invalid coordinates (lng,lat)";
    if (!coordRegex.test(formData.dropoffLocation))
      newErrors.dropoffLocation = "Invalid coordinates (lng,lat)";
    if (formData.currentCycleHours < 0 || formData.currentCycleHours > 70)
      newErrors.currentCycleHours = "Must be 0-70";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/trips/",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const tripId = response.data.id;
      console.log("Trip created with ID:", tripId);
      const routeResponse = await axios.post(
        "http://localhost:8000/api/calculate-route/",
        { tripId },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Route response:", routeResponse.data);
      setRoute(routeResponse.data.route || []);
      setLogs(routeResponse.data.logs || []);
      setStops(routeResponse.data.stops || []);
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
    }
  };

  const parseCoordinates = (coordString) => {
    if (
      !coordString ||
      typeof coordString !== "string" ||
      coordString === "TBD"
    ) {
      return defaultCenter;
    }
    const [lng, lat] = coordString.split(",").map(Number);
    return isNaN(lng) || isNaN(lat) ? defaultCenter : [lat, lng];
  };

  useEffect(() => {
    console.log("Route:", route);
    console.log("Stops:", stops);
  }, [route, stops]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          HOS Trip Planner
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["currentLocation", "pickupLocation", "dropoffLocation"].map(
              (field) => (
                <div key={field}>
                  <input
                    name={field}
                    placeholder={`${field
                      .replace(/([A-Z])/g, " $1")
                      .toUpperCase()} (lng,lat)`}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors[field] ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                  )}
                </div>
              )
            )}
            <div>
              <input
                name="currentCycleHours"
                type="number"
                placeholder="Current Cycle Hours"
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.currentCycleHours
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.currentCycleHours && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currentCycleHours}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full md:w-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Plan Trip
          </button>
        </form>

        {route.length > 0 && stops.length > 0 ? (
          <div className="bg-white shadow-lg rounded-lg p-4 mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Route Map
            </h2>
            <MapContainer
              center={parseCoordinates(stops[0]?.location)}
              zoom={5}
              style={{ height: "400px", width: "100%" }}
            >
              <MapUpdater
                center={parseCoordinates(stops[0]?.location)}
                route={route}
              />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Polyline
                positions={route.map((coord) => [coord[1], coord[0]])}
                color="blue"
              />
              {stops.map(
                (stop, index) =>
                  stop.location &&
                  stop.location !== "TBD" && (
                    <Marker
                      key={index}
                      position={parseCoordinates(stop.location)}
                    >
                      <Popup>
                        <strong>{stop.type.toUpperCase()}</strong>
                        <br />
                        Time: {new Date(stop.time).toLocaleString()}
                        <br />
                        Duration: {stop.duration} hr
                      </Popup>
                    </Marker>
                  )
              )}
            </MapContainer>
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            Submit a trip to view the route map.
          </p>
        )}

        {logs.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              ELD Logs
            </h2>
            <div className="space-y-6">
              {logs.map((log, index) => (
                <LogSheet key={index} log={log} stops={stops} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
