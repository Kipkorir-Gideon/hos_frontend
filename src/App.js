import React, { useState } from 'react';
import  { MapContainer, TileLayer, Polyline, Maker, Popup } from 'react-leaflet';
import axios from 'axios';
import LogSheet from './LogSheet';
import 'leaflet/dist/leaflet.css';


function App() {
    const [formData, setFormData] = useState({
        currentLocation: '',
        pickupLocation: '',
        dropoffLocation: '',
        currentCycleHours: 0,
    });
    const [route, setRoute] = useState(null);
    const [logs, setLogs] = useState([]);
    const [stops, setStops] = useState([]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:8000/api/trips/', formData);
        const tripId = response.data.id;
        const routeResponse = await axios.post('http://localhost:8000/api/calculate-route/', { trip_id: tripId });
        setRoute(routeResponse.data.route);
        setLogs(routeResponse.data.logs);
        setStops(routeResponse.data.stops);
    };

    const parseCoordinates = (coordString) => {
        const [lng, lat] = coordString.split(',').map(Number);
        return [lng, lat];
    }


    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-4xl font-bold text-center text-gray-800 mb-8'>HOS Trip Planner</h1>

                <form onSubmit={handleSubmit} className='bg-white shadow-lg rounded-lg p-6 mb-8'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                        <input
                            name='currentLocation'
                            placeholder='Current Location (lng, lat)'
                            onChange={handleChange}
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <input
                            name='pickupLocation'
                            placeholder='Pickup Location (lng, lat)'
                            onChange={handleChange}
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <input
                            name='dropoffLocation'
                            placeholder='Dropoff Location (lng, lat)'
                            onChange={handleChange}
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <input
                            name='currentCycleHours'
                            type='number'
                            placeholder='Current Cycle Hours'
                            onChange={handleChange}
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <button type='submit' className='mt-4 w-full md:w-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300'>
                        Plan Trip
                    </button>
                </form>


                {route && (
                    <div className='bg-white shadow-lg rounded-lg p-4 mb-8'>
                        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>Route Map</h2>
                        <MapContainer
                            center={[route[0][1], route[0][1]]}
                            zoom={5}
                            style={{ height: '400px', width: '100%' }}
                        >
                            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                            <Polyline positions={route.map((coord) => [coord[1], coord[0]])} color='blue' />
                            {stops.map((stop, index) => (
                                stop.location !== 'TBD' && (
                                    <Maker key={index} position={parseCoordinates(stop.location)}>
                                        <Popup>
                                            <strong>{stop.type.toUpperCase()}</strong>
                                            <br />
                                            Duration: {stop.duration} hours
                                        </Popup>
                                    </Maker>
                                )
                            ))}
                        </MapContainer>
                    </div>
                )}

                {logs.length > 0 && (
                    <div className='bg-white shadow-lg rounded-lg p-6'>
                        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>ELD Logs</h2>
                        <div className='space-y-6'>
                            {logs.map((log, index) => (
                                <LogSheet key={index} log={log} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;