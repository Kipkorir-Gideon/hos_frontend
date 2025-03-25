// DutyTimeline.js
import React from "react";

const DutyTimeline = ({ dutyStatuses, date }) => {
  console.log("DutyTimeline props:", { dutyStatuses, date });

  const timeToMinutes = (time) => {
    if (!time || typeof time !== "string") {
      console.error("Invalid time value:", time);
      return 0;
    }
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const totalMinutes = 24 * 60;

  const statusColors = {
    "Off Duty": "bg-blue-200 border-blue-400",
    "Sleeper Berth": "bg-green-200 border-green-400",
    "Driving": "bg-red-200 border-red-400",
    "On Duty (Not Driving)": "bg-yellow-200 border-yellow-400",
  };

  if (!dutyStatuses || !Array.isArray(dutyStatuses)) {
    console.error("Invalid dutyStatuses:", dutyStatuses);
    return null;
  }

  const blockHeight = 40;
  const actualBlockHeight = 32;
  const blockMargin = 8;
  const headerHeight = 48;
  const minHeight = Math.max(256, dutyStatuses.length * blockHeight + headerHeight + 40);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Duty Status Timeline - {date}</h2>
      <div className="mb-4 flex flex-wrap gap-4">
        {Object.entries(statusColors).map(([status, colorClass]) => (
          <div key={status} className="flex items-center">
            <div className={`w-4 h-4 mr-2 ${colorClass.split(" ")[0]}`}></div>
            <span className="text-sm text-gray-600">{status}</span>
          </div>
        ))}
      </div>
      <div
        className="relative w-full overflow-x-auto overflow-y-auto custom-scrollbar"
        style={{ height: `${minHeight}px` }}
      >
        <div
          className="relative"
          style={{ minWidth: "100%", paddingTop: `${headerHeight}px`, paddingBottom: "20px" }}
        >
          <div className="sticky top-0 w-full h-1 bg-gray-300 z-10">
            {Array.from({ length: 24 }, (_, hour) => (
              <div
                key={hour}
                className="absolute w-0.5 h-2 bg-gray-400"
                style={{ left: `${(hour / 24) * 100}%`, top: "100%" }}
              />
            ))}
          </div>
          <div className="sticky top-0 w-full flex justify-between text-xs text-gray-600 bg-white z-10 pt-2">
            {["Midnight", "6:00", "Noon", "18:00", "24:00"].map((time, index) => (
              <div key={index} className="text-center" style={{ width: "20%" }}>
                {time}
              </div>
            ))}
          </div>
          {dutyStatuses.map((entry, index) => {
            if (!entry.startTime || !entry.endTime) {
              console.error(`Invalid entry at index ${index}:`, entry);
              return null;
            }
            const startMinutes = timeToMinutes(entry.startTime);
            const endMinutes = timeToMinutes(entry.endTime);
            const width = ((endMinutes - startMinutes) / totalMinutes) * 100;
            const left = (startMinutes / totalMinutes) * 100;

            return (
              <div
                key={index}
                className={`absolute border rounded-lg flex items-center justify-center text-xs font-medium shadow-md ${statusColors[entry.status] || "bg-gray-200 border-gray-400"} hover:z-20 hover:shadow-lg hover:scale-105 transition-all`}
                style={{
                  width: `${Math.max(width, 5)}%`,
                  left: `${left}%`,
                  top: `${index * blockHeight}px`,
                  height: `${actualBlockHeight}px`,
                  marginBottom: `${blockMargin}px`,
                }}
              >
                <span className="px-2 truncate hover:whitespace-normal hover:overflow-visible" title={`${entry.status} (${entry.startTime} - ${entry.endTime})`}>
                  {entry.status} ({entry.startTime} - {entry.endTime})
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Remarks</h3>
        {dutyStatuses.map((entry, index) => (
          entry.remarks && entry.startTime && (
            <p key={index} className="text-sm text-gray-600">
              {entry.startTime}: {entry.remarks}
            </p>
          )
        ))}
      </div>
    </div>
  );
};

export default DutyTimeline;