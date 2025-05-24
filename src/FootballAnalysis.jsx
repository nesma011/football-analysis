import React, { useState, useRef, useEffect } from 'react';
import EventCategories from './Components/EventCategories';
import PlayerModal from './Components/PlayerModal';
import ResultModal from './Components/ResultModal';
import LocationModal from './Components/LocationModal';
import ExtraInfoModal from './Components/ExtraInfoModal'; 
import PlayerReceiverModal from './Components/PlayerReceiverModal'; 
import Navbar from './Components/Navbar';
import ExportButton from './Components/ExportButton';
import BodyPartModal from './Components/BodyPartModal';
import EventTable from './Components/EventTable';
import TechniqueModal from './components/TechniqueModal';
import GoalkeeperModal from './components/GoalkeeperModal';

const FootballAnalysis = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showTechniqueModal, setShowTechniqueModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showExtraInfoModal, setShowExtraInfoModal] = useState(false);
  const [showPlayerReceiverModal, setShowPlayerReceiverModal] = useState(false);
  const [showBodyPartModal, setShowBodyPartModal] = useState(false);
  const [locationType, setLocationType] = useState(null);
  const videoRef = useRef(null);
  const [showGoalkeeperModal, setShowGoalkeeperModal] = useState(false);
  const [selectingReceiver, setSelectingReceiver] = useState(false);
  const [pendingPassEvent, setPendingPassEvent] = useState(null);

  const handleNewVideoUpload = (newVideoURL) => {
    if (videoSrc) {
      URL.revokeObjectURL(videoSrc);
      localStorage.removeItem('currentVideo');
    }
    setVideoSrc(newVideoURL);
    localStorage.setItem('currentVideo', newVideoURL);
  };

  useEffect(() => {
    const savedVideo = localStorage.getItem('currentVideo');
    if (savedVideo) {
      setVideoSrc(savedVideo);
    }
    const savedEvents = localStorage.getItem('footballEvents');
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map(event => {
        const timestamp = event.videoTimestamp !== undefined ? event.videoTimestamp : (event.startTime ? (new Date(event.startTime).getTime() / 1000) : 0);
        const endTime = event.endTime ? event.endTime : (event.videoTimestamp || 0);
        const duration = event.endTime && event.startTime ? (endTime - timestamp) * 1000 : 0;
        return {
          ...event,
          id: event.id || Date.now() + Math.random(),
          videoTimestamp: timestamp,
          endTime: endTime,
          duration: duration / 1000, 
          extraInfo: event.extraInfo !== undefined && event.extraInfo !== null ? event.extraInfo : '-',
          passType: event.passType !== undefined && event.passType !== null ? event.passType : '-',
          bodyPart: event.bodyPart !== undefined && event.bodyPart !== null ? event.bodyPart : '-',
          saveTechnique: event.saveTechnique !== undefined && event.saveTechnique !== null ? event.saveTechnique : '-',
          playerReceiver: event.playerReceiver !== undefined && event.playerReceiver !== null ? event.playerReceiver : '-'
        };
      });
      console.log('Loaded Events from localStorage:', parsedEvents);
      setEvents(parsedEvents);
    }
  }, []);

  const openVideo = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const newVideoURL = URL.createObjectURL(file);
        handleNewVideoUpload(newVideoURL);
      }
    };
    input.click();
  };

  const togglePlay = async () => {
    try {
      if (!isPlaying) {
        await videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error controlling video:', error);
    }
  };

  const startEvent = (eventType) => {
    const passEvents = ['Ground Pass', 'Low Pass', 'High Pass'];
    const isPassEvent = passEvents.includes(eventType);

    // إيقاف الفيديو لما يتم اختيار event بالـ hotkey
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    const existingPendingPass = events.find(event => 
      event.type === eventType && 
      event.player && 
      event.startLocation && 
      event.bodyPart && 
      !event.endLocation && 
      !event.result
    );

    if (isPassEvent && existingPendingPass) {
      setCurrentEvent(existingPendingPass);
      setPendingPassEvent(existingPendingPass);
      setShowResultModal(true);
    } else {
      setCurrentEvent({ 
        type: eventType,
        videoTimestamp: videoRef.current?.currentTime || 0
      });
      setShowPlayerModal(true);
    }
  };

  const handlePlayerSelect = (playerName) => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    if (selectingReceiver) {
      setCurrentEvent({ ...currentEvent, playerReceiver: playerName });
      setShowPlayerModal(false);
      setSelectingReceiver(false);
      setShowExtraInfoModal(true);
    } else {
      setCurrentEvent({ ...currentEvent, player: playerName });
      setShowPlayerModal(false);

      if (currentEvent.type === 'Goalkeeper') {
        setShowGoalkeeperModal(true);
      } else if (['Ground Pass', 'Shot'].includes(currentEvent.type)) {
        setShowTechniqueModal(true);
      } else {
        setLocationType('start');
        setShowLocationModal(true);
      }
    }
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
        setCurrentEvent({ ...currentEvent, startLocation: { x, y } });
        const passEvents = ['Ground Pass', 'Low Pass', 'High Pass'];
        if (passEvents.includes(currentEvent.type)) {
          setShowLocationModal(false);
          setShowBodyPartModal(true);
        } else if (['Foul Won', 'Dispossessed', 'Duel', 'Goalkeeper', 'Interception'].includes(currentEvent.type)) {
          setCurrentEvent({ ...currentEvent, startLocation: { x, y }, endLocation: { x, y } });
          setShowLocationModal(false);
          setShowBodyPartModal(true);
        } else {
          setLocationType('end');
          setShowLocationModal(true);
          videoRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error pausing video:', error);
      }
    } else if (locationType === 'end') {
      setCurrentEvent({ ...currentEvent, endLocation: { x, y }, endTime: videoRef.current.currentTime || Date.now() / 1000 });
      setShowLocationModal(false);
      if (pendingPassEvent) {
        const passEvents = ['Ground Pass', 'Low Pass', 'High Pass'];
        if (currentEvent.result === 'Complete' && passEvents.includes(currentEvent.type)) {
          setSelectingReceiver(true);
          setShowPlayerModal(true);
        } else {
          setShowExtraInfoModal(true);
        }
      } else {
        setShowBodyPartModal(true);
      }
    }
  };

  const handleBodyPartSelect = (bodyPart) => {
    setCurrentEvent({ ...currentEvent, bodyPart });
    setShowBodyPartModal(false);
    const passEvents = ['Ground Pass', 'Low Pass', 'High Pass'];
    if (passEvents.includes(currentEvent.type)) {
      const tempEvent = {
        ...currentEvent,
        id: Date.now() + Math.floor(Math.random() * 1000),
        bodyPart,
        extraInfo: currentEvent.technique || '-',
        passType: currentEvent.technique || '-',
        playerReceiver: '-',
        result: null,
        endLocation: null
      };
      const updatedEvents = [...events, tempEvent];
      setEvents(updatedEvents);
      localStorage.setItem('footballEvents', JSON.stringify(updatedEvents));
      setCurrentEvent(null);
      videoRef.current.play();
      setIsPlaying(true);
    } else if (['Foul Won', 'Dispossessed', 'Duel', 'Goalkeeper', 'Interception'].includes(currentEvent.type)) {
      setShowExtraInfoModal(true);
    } else {
      setShowResultModal(true);
    }
  };

  const handleEventClick = (event) => {
    if (!events.length) return;
    const videoTime = event.videoTimestamp;
    if (videoRef.current) {
      videoRef.current.currentTime = videoTime;
      videoRef.current.pause();
      setIsPlaying(false);
    }
    const passEvents = ['Ground Pass', 'Low Pass', 'High Pass'];
    if (passEvents.includes(event.type) && !event.endLocation && !event.result) {
      setCurrentEvent(event);
      setPendingPassEvent(event);
      setShowResultModal(true);
    }
  };

  const handleResultSelect = (result) => {
    setCurrentEvent({ ...currentEvent, result });
    setShowResultModal(false);
    const passEvents = ['Ground Pass', 'Low Pass', 'High Pass'];
    if (passEvents.includes(currentEvent.type)) {
      if (pendingPassEvent) {
        setLocationType('end');
        setShowLocationModal(true);
      } else {
        const updatedEvents = events.filter(event => event.id !== currentEvent.id);
        setEvents(updatedEvents);
        localStorage.setItem('footballEvents', JSON.stringify(updatedEvents));
        if (result === 'Complete') {
          setSelectingReceiver(true);
          setShowPlayerModal(true);
        } else {
          setShowExtraInfoModal(true);
        }
      }
    } else {
      if (result === 'Complete' && passEvents.includes(currentEvent.type)) {
        setSelectingReceiver(true);
        setShowPlayerModal(true);
      } else {
        setShowExtraInfoModal(true);
      }
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
      extraInfo: extraInfo || currentEvent.technique,
      passType,
      bodyPart: bodyPart || currentEvent.bodyPart,
      saveTechnique,
      endTime: currentEvent.endTime || (Date.now() / 1000) 
    };
    const duration = updatedEvent.endTime && updatedEvent.videoTimestamp 
      ? (updatedEvent.endTime - updatedEvent.videoTimestamp) * 1000 
      : 0;
    updatedEvent.duration = duration / 1000; 
    setCurrentEvent(updatedEvent);
    setShowExtraInfoModal(false);
    finalizeEvent(updatedEvent);
    videoRef.current.play();
    setIsPlaying(true);
  };

  const finalizeEvent = (updatedEvent = currentEvent) => {
    const eventId = updatedEvent.id || (Date.now() + Math.floor(Math.random() * 1000));
    const endTime = updatedEvent.endTime || (Date.now() / 1000);
    const duration = updatedEvent.endTime && updatedEvent.videoTimestamp 
      ? (endTime - updatedEvent.videoTimestamp) * 1000 
      : 0;
    const completedEvent = {
      ...updatedEvent,
      id: eventId,
      endTime: endTime,
      duration: duration / 1000,
      videoTimestamp: updatedEvent.videoTimestamp || 0,
      extraInfo: updatedEvent.extraInfo !== undefined && updatedEvent.extraInfo !== null ? updatedEvent.extraInfo : '-',
      passType: updatedEvent.passType !== undefined && updatedEvent.passType !== null ? updatedEvent.passType : '-',
      bodyPart: updatedEvent.bodyPart !== undefined && updatedEvent.bodyPart !== null ? updatedEvent.bodyPart : '-',
      saveTechnique: updatedEvent.saveTechnique !== undefined && updatedEvent.saveTechnique !== null ? updatedEvent.saveTechnique : '-',
      playerReceiver: updatedEvent.playerReceiver !== undefined && updatedEvent.playerReceiver !== null ? updatedEvent.playerReceiver : '-'
    };
    const updatedEvents = events.filter(event => event.id !== completedEvent.id);
    updatedEvents.push(completedEvent);
    setEvents(updatedEvents);
    localStorage.setItem('footballEvents', JSON.stringify(updatedEvents));
    setCurrentEvent(null);
    setPendingPassEvent(null);
    videoRef.current.play();
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const keyActions = {
        'w': () => startEvent('Ground Pass'),
        'q': () => startEvent('High Pass'),
        'e': () => startEvent('Low Pass'),
        'd': () => startEvent('Shot'),
        't': () => startEvent('Dribble'),
        's': () => startEvent('Dispossessed'),
        '5': () => startEvent('Miss control'),
        'r': () => startEvent('Ball Recovery'),
        'g': () => startEvent('Press'),
        '8': () => startEvent('Foul Won'),
        'a': () => startEvent('Duel'),
        'x': () => startEvent('Interception'),
        'f': () => startEvent('Clearance'),
        'b': () => startEvent('Block'),
        'n': () => startEvent('Dribbled Past'),
        '9': () => startEvent('Foul Commit'),
      };

      if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        }
      } else if (e.shiftKey && e.key === '0') {
        e.preventDefault();
        if (videoRef.current) {
          videoRef.current.currentTime += 10;
        }
      } else if (keyActions[e.key.toLowerCase()]) {
        e.preventDefault();
        keyActions[e.key.toLowerCase()]();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [events]);

  return (
    <div className="flex flex-col min-h-screen p-4 space-y-4">
      <Navbar />
      <div className="flex flex-col md:flex-row space-x-0 md:space-x-4">
        <div className="w-full md:w-2/3">
          <video ref={videoRef} src={videoSrc} preload="auto" className="w-full rounded shadow" controls />
          <div className="mt-2 flex space-x-2">
            <button onClick={openVideo} className="p-2 bg-teal-700 text-white rounded">Upload Video</button>
            <button onClick={togglePlay} className="p-2 bg-green-500 text-white rounded">
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/3 mt-4 md:mt-0">
          <EventCategories startEvent={startEvent} videoRef={videoRef} setIsPlaying={setIsPlaying} />
        </div>
      </div>
      <div className="w-full mt-8">
        <EventTable events={events} onEventClick={handleEventClick} />
        <ExportButton events={events} />
      </div>
      {showPlayerModal && (
        <PlayerModal 
          onConfirm={handlePlayerSelect} 
          onClose={() => {
            setShowPlayerModal(false);
            setSelectingReceiver(false);
          }} 
          videoRef={videoRef} 
          setIsPlaying={setIsPlaying} 
          title={selectingReceiver ? 'Select Player Receiver' : 'Select Player'}
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
          onConfirm={handleResultSelect}
          onClose={() => setShowResultModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
      {showGoalkeeperModal && (
        <GoalkeeperModal
          onConfirm={(action) => {
            setCurrentEvent(prev => ({ ...prev, actionType: action }));
            setShowGoalkeeperModal(false);
            setLocationType('start');
            setShowLocationModal(true);
          }}
          onClose={() => setShowGoalkeeperModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
      {showLocationModal && (
        <LocationModal onSelect={handleLocationSelect} onClose={() => setShowLocationModal(false)} videoRef={videoRef} setIsPlaying={setIsPlaying} />
      )}
      {showBodyPartModal && (
        <BodyPartModal
          onConfirm={handleBodyPartSelect}
          onClose={() => setShowBodyPartModal(false)}
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
      {showPlayerReceiverModal && (
        <PlayerReceiverModal onConfirm={handlePlayerReceiverSelect} onClose={() => setShowPlayerReceiverModal(false)} videoRef={videoRef} setIsPlaying={setIsPlaying} />
      )}
    </div>
  );
};

export default FootballAnalysis;