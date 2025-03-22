import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';


const LogSheet = ({ log, stops }) => {
    const logRef = useRef(null);

    useEffect(() => {
        const captureLog = async () => {
            const canvas = await html2canvas(logRef.current);
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `log_${log.date}.png`;
            link.click();
        };
        captureLog();
    }, [log]);

    // Filter stops relevant to this log
    const relevantStops = stops.filter((stop) => 
        log.stops.some((logStop) => logStop.type === stop.type && logStop.location === stop.location)
    );

    return (
        <div ref={logRef} className='border border-gray-300 rounded-lg p-4 bg-white shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Date: {log.date}</h3>
            <div className='grid grid-cols-12 gap-1 mb-4'>
                {Array.from({ length: 24 }).map((_, hour) => {
                    let status = 'off-duty';
                    if (hour < log.driving_hours) status = 'driving';
                    else if (hour < log.on_duty_hours) status = 'on-duty';
                    else if (hour < log.on_duty_hours + log.off_duty_hours) status = 'off-duty';
                    return (
                        <dev
                        key={hour}
                        className={`h-8 text-center text-xs font-medium text-white rounded ${
                            status === 'driving'
                            ? 'bg-red-500'
                            : status === 'on-duty'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                    >
                        {hour}:00
                    </dev>
                    );
                })}
            </div>
            <div className='text-sm text-gray-600'>
                <p className='font-semibold mb-1'>Stops:</p>
                <ul className='list-disc pl-5'>
                    {relevantStops.map((stop, index) => (
                        <li key={index}>
                            {stop.type.charAt(0).toUpperCase() + stop.type.slice(1)} at {stop.location} (
                                {stop.duration} hours
                            )
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


export default LogSheet;