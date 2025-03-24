import React, { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";

const LogSheet = ({ log, stops }) => {
  const logRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const captureLog = async () => {
      const canvas = await html2canvas(logRef.current);
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `log_${log.date}.png`;
      link.click();
    };
    captureLog();
  }, [log]);

  const relevantStops = stops.filter((stop) => stop.time.startsWith(log.date));

  const timeline = [];
  let currentHour = 0;
  while (currentHour < 24) {
    if (currentHour < log.drivingHours) {
      timeline.push({ hour: currentHour, status: "driving" });
      currentHour += 1;
    } else if (currentHour < log.onDutyHours) {
      timeline.push({ hour: currentHour, status: "on-duty" });
      currentHour += 1;
    } else if (currentHour < log.onDutyHours + log.offDutyHours) {
      timeline.push({ hour: currentHour, status: "off-duty" });
      currentHour += 1;
    } else {
      timeline.push({ hour: currentHour, status: "sleeper" });
      currentHour += 1;
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
      <div ref={logRef}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Date: {log.date}</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>
        <div className="grid grid-cols-24 gap-1 mt-2">
          {timeline.map((entry, index) => (
            <div
              key={index}
              className={`h-8 text-center text-xs font-medium text-white rounded ${
                entry.status === "driving"
                  ? "bg-red-500"
                  : entry.status === "on-duty"
                  ? "bg-yellow-500"
                  : entry.status === "off-duty"
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            >
              {entry.hour}:00
            </div>
          ))}
        </div>
        {isExpanded && (
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Driving Hours:</strong> {log.drivingHours.toFixed(2)} hr</p>
            <p><strong>On-Duty Hours:</strong> {log.onDutyHours.toFixed(2)} hr</p>
            <p><strong>Off-Duty Hours:</strong> {log.offDutyHours.toFixed(2)} hr</p>
            <p className="font-semibold mt-2">Stops:</p>
            <ul className="list-disc pl-5">
              {relevantStops.map((stop, index) => (
                <li key={index}>
                  {stop.type.charAt(0).toUpperCase() + stop.type.slice(1)} at {stop.location} (
                  {stop.duration} hr) - {new Date(stop.time).toLocaleTimeString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogSheet;