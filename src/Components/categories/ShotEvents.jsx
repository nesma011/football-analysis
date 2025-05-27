import React, { useState, useEffect } from 'react';
import TechniqueModal from '../TechniqueModal';
import LocationModal from '../LocationModal';
import GoalLocation from '../GoalLocation';
import PlayerModal from '../PlayerModal';
import ResultModal from '../ResultModal';
import ExtraInfoModal from '../ExtraInfoModal';

const shotEvents = [
  { type: 'Shot', text: 'Shot', shortcut: 'D', color: 'bg-red-500' },
];

const ShotEvents = ({ videoRef, setIsPlaying, events, setEvents, finalizeEvent }) => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showTechniqueModal, setShowTechniqueModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showGoalLocationModal, setShowGoalLocationModal] = useState(false);
  const [showExtraInfoModal, setShowExtraInfoModal] = useState(false);
  const [locationType, setLocationType] = useState(null);
  const [pendingShotEvent, setPendingShotEvent] = useState(null);

  const handleStartEvent = (eventType) => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    const existingPendingShot = events.find(
      (event) =>
        event.type === eventType &&
        event.player &&
        event.startLocation &&
        event.technique &&
        event.result &&
        ['Saved', 'Goal', 'Penalty Saved', 'Offtarget', 'Post'].includes(event.result) &&
        !event.endLocation
    );

    if (existingPendingShot) {
      // Resume the pending shot event to capture endLocation
      setCurrentEvent(existingPendingShot);
      setPendingShotEvent(existingPendingShot);
      setLocationType('end');
      setShowGoalLocationModal(true);
    } else {
      // Start a new shot event
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
    setLocationType('start');
    setShowLocationModal(true);
  };

  const handleLocationSelect = async (x, y) => {
    if (locationType === 'start') {
      try {
        await videoRef.current.pause();
        setIsPlaying(false);
        setCurrentEvent({ ...currentEvent, startLocation: { x, y } });
        setShowLocationModal(false);
        setShowTechniqueModal(true);
      } catch (error) {
        console.error('Error pausing video:', error);
      }
    }
  };

  const handleTechniqueSelect = (technique) => {
    setCurrentEvent({ ...currentEvent, technique });
    setShowTechniqueModal(false);
    setShowExtraInfoModal(true);
  };

  const handleExtraInfoSelect = ({ extraInfo, bodyPart, saveTechnique }) => {
    setCurrentEvent({
      ...currentEvent,
      extraInfo: extraInfo || currentEvent.technique || '-',
      bodyPart: bodyPart || '-',
      saveTechnique: saveTechnique || '-',
    });
    setShowExtraInfoModal(false);
    setShowResultModal(true);
  };

  const handleResultSelect = (result) => {
    const updatedEvent = { ...currentEvent, result };
    setCurrentEvent(updatedEvent);
    setShowResultModal(false);

    if (['Saved', 'Goal', 'Penalty Saved', 'Offtarget', 'Post'].includes(result)) {
      // Add to events as a pending shot event to capture endLocation later
      const tempEvent = {
        ...updatedEvent,
        id: Date.now() + Math.floor(Math.random() * 1000),
      };
      const updatedEvents = [...events, tempEvent];
      setEvents(updatedEvents);
      localStorage.setItem('footballEvents', JSON.stringify(updatedEvents));
      setPendingShotEvent(tempEvent);
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      // For 'Blocked', finalize the event directly
      const duration =
        updatedEvent.endTime && updatedEvent.videoTimestamp
          ? (updatedEvent.endTime - updatedEvent.videoTimestamp) * 1000 / 1000
          : 0;
      updatedEvent.duration = duration;
      finalizeEvent(updatedEvent);
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleGoalLocationSelect = (x, y) => {
    const updatedEvent = {
      ...currentEvent,
      endLocation: { x, y },
      endTime: videoRef.current.currentTime || Date.now() / 1000,
    };
    setCurrentEvent(updatedEvent);
    setShowGoalLocationModal(false);

    // Remove the pending event from events and finalize
    const updatedEvents = events.filter((event) => event.id !== currentEvent.id);
    setEvents(updatedEvents);
    localStorage.setItem('footballEvents', JSON.stringify(updatedEvents));

    const duration =
      updatedEvent.endTime && updatedEvent.videoTimestamp
        ? (updatedEvent.endTime - updatedEvent.videoTimestamp) * 1000 / 1000
        : 0;
    updatedEvent.duration = duration;
    finalizeEvent(updatedEvent);
    setPendingShotEvent(null);
    videoRef.current.play();
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const keyActions = {
        'd': () => handleStartEvent('Shot'),
      };

      if (
        keyActions[e.key.toLowerCase()] &&
        !showPlayerModal &&
        !showTechniqueModal &&
        !showResultModal &&
        !showLocationModal &&
        !showGoalLocationModal &&
        !showExtraInfoModal
      ) {
        e.preventDefault();
        keyActions[e.key.toLowerCase()]();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [
    showPlayerModal,
    showTechniqueModal,
    showResultModal,
    showLocationModal,
    showGoalLocationModal,
    showExtraInfoModal,
  ]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Shot Events</h3>
      <div className="grid grid-cols-1 gap-2">
        {shotEvents.map((event) => (
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
          outcomes={['Saved', 'Goal', 'Penalty Saved', 'Offtarget', 'Blocked', 'Post']}
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
      {showGoalLocationModal && (
        <GoalLocation
          onSelect={handleGoalLocationSelect}
          onClose={() => setShowGoalLocationModal(false)}
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

export default ShotEvents;