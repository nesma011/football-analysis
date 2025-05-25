import React from "react";

const EventTable = ({ events, onEventClick, setEvents }) => {
  const formatTimestamp = (timestamp) => {
    if (timestamp === undefined || timestamp === null) return "00:00:00";
    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor((timestamp % 3600) / 60);
    const seconds = Math.floor(timestamp % 60);
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatDuration = (duration) => {
    if (duration === undefined || duration === null) return "00:00.0";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const tenths = Math.floor((duration % 1) * 10);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${tenths}`;
  };

  const handleDelete = (id) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('footballEvents', JSON.stringify(updatedEvents));
  };

  const handleDeleteAll = () => {
    setEvents([]);
    localStorage.setItem('footballEvents', JSON.stringify([]));
  };

  return (
    <div className="w-full mt-4">
      <div className="flex justify-end mb-2">
        <button onClick={handleDeleteAll} className="p-2 bg-red-500 text-white rounded">Delete All</button>
      </div>
      <div className="overflow-x-auto max-h-96 overflow-y-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full table-auto text-sm text-gray-700">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-800">
            <tr>
              {[
                'ID',
                'Timestamp',
                'Duration',
                'Event Type',
                'Player',
                'Player Receiver',
                'Player Out',
                'Player In',
                'Team',
                'Start X',
                'Start Y',
                'End X',
                'End Y',
                'Type',
                'Outcome',
                'Extra Info',
                'Pass Type',
                'Body Part',
                'Save Technique',
                'Delete'
              ].map((heading, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-left font-semibold border-b border-gray-300 sticky top-0 bg-gradient-to-r from-blue-100 to-blue-200 z-10"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr
                key={event.id}
                onClick={() => onEventClick(event)}
                className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-200"
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{formatTimestamp(event.videoTimestamp)}</td>
                <td className="px-4 py-2">{formatDuration(event.duration)}</td>
                <td className="px-4 py-2">{event.type || '-'}</td>
                <td className="px-4 py-2">{event.player || '-'}</td>
                <td className="px-4 py-2">{['Ground Pass', 'Low Pass', 'High Pass'].includes(event.type) ? (event.playerReceiver || '-') : '-'}</td>
                <td className="px-4 py-2">{event.type === 'Sub' ? (event.playerReceiver || '-') : '-'}</td>
                <td className="px-4 py-2">{event.type === 'Sub' ? (event.playerIn || '-') : '-'}</td>
                <td className="px-4 py-2">{event.team || '-'}</td>
                <td className="px-4 py-2">{event.startLocation?.x || '-'}</td>
                <td className="px-4 py-2">{event.startLocation?.y || '-'}</td>
                <td className="px-4 py-2">{event.endLocation?.x || '-'}</td>
                <td className="px-4 py-2">{event.endLocation?.y || '-'}</td>
                <td className="px-4 py-2">{event.technique || '-'}</td>
                <td className="px-4 py-2">{event.result || '-'}</td>
                <td className="px-4 py-2">{event.extraInfo !== undefined && event.extraInfo !== null ? event.extraInfo : '-'}</td>
                <td className="px-4 py-2">{event.passType !== undefined && event.passType !== null ? event.passType : '-'}</td>
                <td className="px-4 py-2">{event.bodyPart !== undefined && event.bodyPart !== null ? event.bodyPart : '-'}</td>
                <td className="px-4 py-2">{event.saveTechnique !== undefined && event.saveTechnique !== null ? event.saveTechnique : '-'}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleDelete(event.id)} className="text-red-500">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventTable;