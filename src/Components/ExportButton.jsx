import React from "react";

const ExportButton = ({ events }) => {
  const formatTimestamp = (timestamp) => {
    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor((timestamp % 3600) / 60);
    const seconds = Math.floor(timestamp % 60);
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleExportCSV = () => {
    const csvHeaders = [
      "Index",
      "Timestamp",
      "Event Type",
      "Player",
      "Start X",
      "Start Y",
      "End X",
      "End Y",
      "Type",
      "Outcome",
      "Player Receiver",
      "Extra Info",
      "Pass Type",
      "Body Part",
      "Save Technique"
    ];

    const csvContent = [
      csvHeaders.join(","),
      ...events.map((event, index) => {
        const row = [
          index + 1,
          `"${formatTimestamp(event.videoTimestamp)}"`,
          event.type || "-",
          event.player || "-",
          event.startLocation?.x || "-",
          event.startLocation?.y || "-",
          event.endLocation?.x || "-",
          event.endLocation?.y || "-",
          event.technique || "-",
          event.result || "-",
          event.playerReceiver || "-",
          event.extraInfo !== undefined && event.extraInfo !== null ? `"${event.extraInfo}"` : "-",
          event.passType || "-",
          event.bodyPart || "-",
          event.saveTechnique || "-"
        ];
        return row.join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "events_analysis.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4 flex justify-end">
      <button
        onClick={handleExportCSV}
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md z-50"
      >
        Download file CSV
      </button>
    </div>
  );
};

export default ExportButton;