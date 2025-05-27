import React, { useState, useEffect } from 'react';
import TechniqueModal from '../TechniqueModal';
import LocationModal from '../LocationModal';
import PlayerModal from '../PlayerModal';
import ResultModal from '../ResultModal';
import PlayerReceiverModal from '../PlayerReceiverModal';
import ExtraInfoModal from '../ExtraInfoModal';

const passEvents = [
  { type: 'Ground Pass', text: 'Ground Pass', shortcut: 'W', color: 'bg-blue-500' },
  { type: 'High Pass', text: 'High Pass', shortcut: 'Q', color: 'bg-blue-600' },
  { type: 'Low Pass', text: 'Low Pass', shortcut: 'E', color: 'bg-blue-700' },
];

const PassEvents = ({ videoRef, setIsPlaying, events, setEvents, finalizeEvent }) => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showTechniqueModal, setShowTechniqueModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPlayerReceiverModal, setShowPlayerReceiverModal] = useState(false);
  const [showExtraInfoModal, setShowExtraInfoModal] = useState(false);
  const [locationType, setLocationType] = useState(null);
  const [pendingPassEvent, setPendingPassEvent] = useState(null);

  const handleStartEvent = (eventType) => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    const existingPendingPass = events.find(
      (event) =>
        event.type === eventType &&
        event.player &&
        event.startLocation &&
        event.technique &&
        !event.endLocation &&
        !event.result
    );

    if (existingPendingPass) {
      // Resume the pending pass event
      setCurrentEvent(existingPendingPass);
      setPendingPassEvent(existingPendingPass);
      setLocationType('end');
      setShowLocationModal(true);
    } else {
      // Start a new pass event
      setCurrentEvent({
        type: eventType,
        videoTimestamp: videoRef.current?.currentTime || 0,
      });
      setShowPlayerModal(true);
    }
  };

  const handlePlayerSelect = (playerName) => {
    setCurrentEvent({ ...currentEvent, player: playerName });
    setShowPlayerModal(false);
    setShowTechniqueModal(true);
  };

  const handleTechniqueSelect = (technique) => {
    setCurrentEvent({ ...currentEvent, technique });
    setShowTechniqueModal(false);
    setLocationType('start');
    setShowLocationModal(true);
  };

  const handleLocationSelect = async (x, y) => {
    if (locationType === 'start') {
      try {
        await videoRef.current.pause();
        setIsPlaying(false);
        const tempEvent = {
          ...currentEvent,
          id: Date.now() + Math.floor(Math.random() * 1000),
          startLocation: { x, y },
          bodyPart: '-',
          extraInfo: currentEvent.technique || '-',
          passType: currentEvent.technique || '-',
          playerReceiver: '-',
          result: null,
          endLocation: null,
        };
        const updatedEvents = [...events, tempEvent];
        setEvents(updatedEvents);
        localStorage.setItem('footballEvents', JSON.stringify(updatedEvents));
        setPendingPassEvent(tempEvent);
        setCurrentEvent(tempEvent);
        setShowLocationModal(false);
        videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error pausing video:', error);
      }
    } else if (locationType === 'end') {
      setCurrentEvent({
        ...currentEvent,
        endLocation: { x, y },
        endTime: videoRef.current.currentTime || Date.now() / 1000,
      });
      setShowLocationModal(false);
      setShowResultModal(true);
    }
  };

  const handleResultSelect = (result) => {
    setCurrentEvent({ ...currentEvent, result });
    setShowResultModal(false);
    if (result === 'Complete') {
      setShowPlayerReceiverModal(true);
    } else {
      setShowExtraInfoModal(true);
    }
  };

  const handlePlayerReceiverSelect = (playerReceiver) => {
    setCurrentEvent({ ...currentEvent, playerReceiver });
    setShowPlayerReceiverModal(false);
    setShowExtraInfoModal(true);
  };

  const handleExtraInfoSelect = ({ extraInfo, passType, bodyPart, saveTechnique }) => {
    const updatedEvent = {
      ...currentEvent,
      extraInfo: extraInfo || currentEvent.technique || '-',
      passType: passType || currentEvent.passType || '-',
      bodyPart: bodyPart || '-',
      saveTechnique: saveTechnique || '-',
      endTime: currentEvent.endTime || Date.now() / 1000,
    };
    const duration =
      updatedEvent.endTime && updatedEvent.videoTimestamp
        ? (updatedEvent.endTime - updatedEvent.videoTimestamp) * 1000 / 1000
        : 0;
    updatedEvent.duration = duration;
    setCurrentEvent(updatedEvent);
    setShowExtraInfoModal(false);
    finalizeEvent(updatedEvent);
    setPendingPassEvent(null);
    videoRef.current.play();
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const keyActions = {
        'w': () => handleStartEvent('Ground Pass'),
        'q': () => handleStartEvent('High Pass'),
        'e': () => handleStartEvent('Low Pass'),
      };

      if (keyActions[e.key.toLowerCase()] && !showPlayerModal && !showTechniqueModal && !showResultModal && !showLocationModal && !showPlayerReceiverModal && !showExtraInfoModal) {
        e.preventDefault();
        keyActions[e.key.toLowerCase()]();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showPlayerModal, showTechniqueModal, showResultModal, showLocationModal, showPlayerReceiverModal, showExtraInfoModal]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Pass Events</h3>
      <div className="grid grid-cols-3 gap-2">
        {passEvents.map((event) => (
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
      {showTechniqueModal && (
        <TechniqueModal
          eventType={currentEvent?.type}
          onConfirm={handleTechniqueSelect}
          onClose={() => setShowTechniqueModal(false)}
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
      {showLocationModal && (
        <LocationModal
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
      {showPlayerReceiverModal && (
        <PlayerReceiverModal
          onConfirm={handlePlayerReceiverSelect}
          onClose={() => setShowPlayerReceiverModal(false)}
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

export default PassEvents;