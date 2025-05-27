import React, { useState } from 'react';
import PlayerModal from '../PlayerModal';
import LocationModal from '../LocationModal';
import ResultModal from '../ResultModal';
import ExtraInfoModal from '../ExtraInfoModal';

const possessionDribblingEvents = [
  { type: 'Dribble', text: 'Dribble', shortcut: 'T', color: 'bg-green-500' },
  { type: 'Dispossessed', text: 'Dispossessed', shortcut: 'S', color: 'bg-green-600' },
  { type: 'Miss control', text: 'Miss control', shortcut: '5', color: 'bg-green-700' },
  { type: 'Ball Recovery', text: 'Ball Recovery', shortcut: 'R', color: 'bg-green-800' },
  { type: 'Press', text: 'Press', shortcut: 'G', color: 'bg-green-900' },
];

const PossessionDribblingEvents = ({ videoRef, setIsPlaying, events, setEvents, finalizeEvent }) => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showExtraInfoModal, setShowExtraInfoModal] = useState(false);
  const [locationType, setLocationType] = useState(null);

  const handleStartEvent = (eventType) => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setCurrentEvent({
      type: eventType,
      videoTimestamp: videoRef.current?.currentTime || 0,
    });
    setShowPlayerModal(true);
  };

  const handlePlayerSelect = (playerName) => {
    setCurrentEvent({ ...currentEvent, player: playerName });
    setShowPlayerModal(false);
    setLocationType('start');
    setShowLocationModal(true);
  };

  const handleLocationSelect = async (x, y) => {
    setCurrentEvent({ ...currentEvent, startLocation: { x, y }, endLocation: { x, y } });
    setShowLocationModal(false);
    if (currentEvent.type === 'Dribble') {
      setShowResultModal(true);
    } else {
      finalizeEvent({ ...currentEvent, startLocation: { x, y } });
    }
  };

  const handleResultSelect = (result) => {
    setCurrentEvent({ ...currentEvent, result });
    setShowResultModal(false);
    setShowExtraInfoModal(true);
  };

  const handleExtraInfoSelect = ({ extraInfo, passType, bodyPart, saveTechnique }) => {
    const updatedEvent = {
      ...currentEvent,
      extraInfo: extraInfo || '-',
      passType: passType || '-',
      bodyPart: bodyPart || '-',
      saveTechnique: saveTechnique || '-',
      endTime: currentEvent.endTime || Date.now() / 1000,
    };
    updatedEvent.duration =
      updatedEvent.endTime && updatedEvent.videoTimestamp
        ? (updatedEvent.endTime - updatedEvent.videoTimestamp) * 1000 / 1000
        : 0;
    setCurrentEvent(updatedEvent);
    setShowExtraInfoModal(false);
    finalizeEvent(updatedEvent);
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Possession & Dribbling</h3>
      <div className="grid grid-cols-3 gap-2">
        {possessionDribblingEvents.map((event) => (
          <button
            key={event.type}
            data-type={event.type}
            onClick={() => handleStartEvent(event.type)}
            className={`${event.color} text-white text-sm py-1 px-2 rounded-lg hover:opacity-80 transition-opacity w-full text-center flex items-center justify-center gap-1`}
          >
            <span>{event.text}</span>
            {event.shortcut && (
              <span className="text-xs text-white px-1 rounded">({event.shortcut})</span>
            )}
          </button>
        ))}
      </div>
      {showPlayerModal && (
        <PlayerModal
          onConfirm={handlePlayerSelect}
          onClose={() => setShowPlayerModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
      {showLocationModal && (
        <LocationModal
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
      {showResultModal && (
        <ResultModal
          eventType={currentEvent?.type}
          currentEvent={currentEvent}
          onConfirm={handleResultSelect}
          onClose={() => setShowResultModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
      {showExtraInfoModal && (
        <ExtraInfoModal
          eventType={currentEvent?.type}
          onConfirm={handleExtraInfoSelect}
          onClose={() => setShowExtraInfoModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
    </div>
  );
};

export default PossessionDribblingEvents;