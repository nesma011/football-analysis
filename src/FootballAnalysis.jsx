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
  const [showGoalkeeperModal, setShowGoalkeeperModal] = useState(false);
  const [selectingReceiver, setSelectingReceiver] = useState(false);
  const [pendingPassEvent, setPendingPassEvent] = useState(null);
  const [selectingSecondPlayer, setSelectingSecondPlayer] = useState(false);
  const videoRef = useRef(null);

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
        const endTime = event.endTime !== undefined ? event.endTime : (event.videoTimestamp || 0);
        const duration = event.duration !== undefined ? event.duration : (endTime && timestamp ? (endTime - timestamp) * 1000 / 1000 : 0);
        return {
          ...event,
          id: event.id || Date.now() + Math.random(),
          videoTimestamp: timestamp,
          endTime: endTime,
          duration: duration,
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
    const resultEvents = ['Goalkeeper', 'Dribble', 'Interception', 'Duel'];
    const isPassEvent = passEvents.includes(eventType);

    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    const existingPendingPass = events.find(event => 
      event.type === eventType && 
      event.player && 
      event.startLocation && 
      event.technique && 
      !event.endLocation && 
      !event.result
    );

    if (isPassEvent && existingPendingPass) {
      setCurrentEvent(existingPendingPass);
      setPendingPassEvent(existingPendingPass);
      setShowResultModal(true);
    } else if (eventType === 'Var Stop' || eventType === 'Water Break') {
      setCurrentEvent({
        type: eventType,
        videoTimestamp: videoRef.current?.currentTime || 0,
        startTime: videoRef.current?.currentTime || 0
      });
      finalizeEvent({
        type: eventType,
        videoTimestamp: videoRef.current?.currentTime || 0,
        startTime: videoRef.current?.currentTime || 0,
        endTime: videoRef.current?.currentTime || 0,
        duration: 0
      });
    } else if (eventType === 'Ball Drop') {
      setCurrentEvent({
        type: eventType,
        videoTimestamp: videoRef.current?.currentTime || 0
      });
      setLocationType('start');
      setShowLocationModal(true);
    } else if (resultEvents.includes(eventType)) {
      setCurrentEvent({
        type: eventType,
        videoTimestamp: videoRef.current?.currentTime || 0
      });
      setShowPlayerModal(true);
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
    const noExtraEvents = ['Dispossessed', 'Miss control', 'Ball Recovery', 'Offside', 'Own Goal', 'Press', 'Shield', 'Foul Won', 'Clearance', 'Block'];
    const playerOnlyEvents = ['Error', 'Bad Behaviour', 'Injury Stop'];

    if (selectingReceiver) {
      setCurrentEvent({ ...currentEvent, playerReceiver: playerName });
      setShowPlayerModal(false);
      setSelectingReceiver(false);
      if (currentEvent.type === 'Sub') {
        setCurrentEvent({ ...currentEvent, playerReceiver: playerName });
        setSelectingSecondPlayer(true);
        setShowPlayerModal(true);
      } else if (currentEvent.type === 'Own Goal For') {
        setCurrentEvent({ ...currentEvent, team: playerName });
        setLocationType('start');
        setShowLocationModal(true);
      } else if (['Ground Pass', 'Low Pass', 'High Pass'].includes(currentEvent.type)) {
        setLocationType('end');
        setShowLocationModal(true);
      } else {
        setShowExtraInfoModal(true);
      }
    } else if (selectingSecondPlayer) {
      setCurrentEvent({ ...currentEvent, playerIn: playerName });
      setShowPlayerModal(false);
      setSelectingSecondPlayer(false);
      finalizeEvent({ ...currentEvent, playerIn: playerName });
    } else {
      setCurrentEvent({ ...currentEvent, player: playerName });
      setShowPlayerModal(false);

      if (currentEvent.type === 'Goalkeeper') {
        setShowGoalkeeperModal(true);
      } else if (['Ground Pass', 'Low Pass', 'High Pass', 'Shot'].includes(currentEvent.type)) {
        setShowTechniqueModal(true);
      } else if (currentEvent.type === 'Own Goal For' || currentEvent.type === 'Sub') {
        setShowPlayerModal(true);
        setSelectingReceiver(true);
      } else if (playerOnlyEvents.includes(currentEvent.type)) {
        finalizeEvent({ ...currentEvent, player: playerName });
      } else if (noExtraEvents.includes(currentEvent.type)) {
        setLocationType('start');
        setShowLocationModal(true);
      } else if (['Dribble', 'Interception', 'Duel'].includes(currentEvent.type)) {
        setLocationType('start');
        setShowLocationModal(true);
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
        const noExtraEvents = ['Dispossessed', 'Miss control', 'Ball Recovery', 'Offside', 'Own Goal', 'Press', 'Shield', 'Foul Won', 'Clearance', 'Block'];
        if (passEvents.includes(currentEvent.type)) {
          setShowLocationModal(false);
          const tempEvent = {
            ...currentEvent,
            id: Date.now() + Math.floor(Math.random() * 1000),
            startLocation: { x, y },
            bodyPart: '-',
            extraInfo: currentEvent.technique || '-',
            passType: currentEvent.technique || '-',
            playerReceiver: '-',
            result: null,
            endLocation: null
          };
          const updatedEvents = [...events, tempEvent];
          setEvents(updatedEvents);
          localStorage.setItem('footballEvents', JSON.stringify(updatedEvents));
          setPendingPassEvent(tempEvent);
          videoRef.current.play();
          setIsPlaying(true);
        } else if (['Duel', 'Goalkeeper', 'Interception', 'Dribble'].includes(currentEvent.type)) {
          setCurrentEvent({ ...currentEvent, startLocation: { x, y }, endLocation: { x, y } });
          setShowLocationModal(false);
          if (currentEvent.type === 'Goalkeeper') {
            setShowBodyPartModal(true);
          } else {
            setShowResultModal(true); // طلب ResultModal لـ Duel, Interception, Dribble
          }
        } else if (noExtraEvents.includes(currentEvent.type)) {
          setShowLocationModal(false);
          finalizeEvent({ ...currentEvent, startLocation: { x, y } });
        } else if (currentEvent.type === 'Ball Drop') {
          setShowLocationModal(false);
          finalizeEvent({ ...currentEvent, startLocation: { x, y } });
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
      setShowExtraInfoModal(true);
    }
  };

  const handleBodyPartSelect = (bodyPart) => {
    if (currentEvent.type === 'Goalkeeper') {
      setCurrentEvent({ ...currentEvent, bodyPart });
    }
    setShowBodyPartModal(false);
    setShowResultModal(true);
  };

  const handleResultSelect = (result) => {
    setCurrentEvent({ ...currentEvent, result });
    setShowResultModal(false);
    const passEvents = ['Ground Pass', 'Low Pass', 'High Pass'];
    if (passEvents.includes(currentEvent.type)) {
      if (pendingPassEvent) {
        const updatedEvents = events.filter(event => event.id !== currentEvent.id);
        setEvents(updatedEvents);
        localStorage.setItem('footballEvents', JSON.stringify(updatedEvents));
        if (result === 'Complete') {
          setSelectingReceiver(true);
          setShowPlayerModal(true);
        } else {
          setLocationType('end');
          setShowLocationModal(true);
        }
      } else {
        if (result === 'Complete') {
          setSelectingReceiver(true);
          setShowPlayerModal(true);
        } else {
          setLocationType('end');
          setShowLocationModal(true);
        }
      }
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
      bodyPart: currentEvent.type === 'Goalkeeper' ? (bodyPart || currentEvent.bodyPart || '-') : '-',
      saveTechnique: saveTechnique || '-',
      endTime: currentEvent.endTime || (Date.now() / 1000)
    };
    console.log('ExtraInfoSelect - updatedEvent:', updatedEvent);
    const duration = updatedEvent.endTime && updatedEvent.videoTimestamp
      ? (updatedEvent.endTime - updatedEvent.videoTimestamp) * 1000 / 1000
      : (currentEvent.duration || 0);
    updatedEvent.duration = duration;
    setCurrentEvent(updatedEvent);
    setShowExtraInfoModal(false);
    finalizeEvent(updatedEvent);
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleGoalkeeperSelect = (action) => {
    setCurrentEvent({ ...currentEvent, actionType: action });
    setShowGoalkeeperModal(false);
    setLocationType('start');
    setShowLocationModal(true);
  };

  const finalizeEvent = (updatedEvent = currentEvent) => {
    const eventId = updatedEvent.id || (Date.now() + Math.floor(Math.random() * 1000));
    const endTime = updatedEvent.endTime || (videoRef.current?.currentTime || Date.now() / 1000);
    const duration = updatedEvent.type === 'Var Stop' || updatedEvent.type === 'Water Break'
      ? (endTime - (updatedEvent.startTime || updatedEvent.videoTimestamp || 0))
      : (updatedEvent.endTime && updatedEvent.videoTimestamp
        ? (endTime - updatedEvent.videoTimestamp) * 1000 / 1000
        : 0);
    const completedEvent = {
      ...updatedEvent,
      id: eventId,
      endTime: endTime,
      duration: duration,
      videoTimestamp: updatedEvent.videoTimestamp || 0,
      extraInfo: updatedEvent.extraInfo !== undefined && updatedEvent.extraInfo !== null ? updatedEvent.extraInfo : '-',
      passType: updatedEvent.passType !== undefined && updatedEvent.passType !== null ? updatedEvent.passType : '-',
      bodyPart: updatedEvent.bodyPart !== undefined && updatedEvent.bodyPart !== null ? updatedEvent.bodyPart : '-',
      saveTechnique: updatedEvent.saveTechnique !== undefined && updatedEvent.saveTechnique !== null ? updatedEvent.saveTechnique : '-',
      playerReceiver: updatedEvent.playerReceiver !== undefined && updatedEvent.playerReceiver !== null ? updatedEvent.playerReceiver : '-',
      playerIn: updatedEvent.playerIn || '-',
      result: updatedEvent.result || '-'
    };
    console.log('FinalizeEvent - completedEvent:', completedEvent);
    const updatedEvents = events.filter(event => event.id !== completedEvent.id);
    updatedEvents.push(completedEvent);
    setEvents(updatedEvents);
    localStorage.setItem('footballEvents', JSON.stringify(updatedEvents));
    setCurrentEvent(null);
    setPendingPassEvent(null);
    videoRef.current.play();
    setIsPlaying(true);
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

if (e.ctrlKey && e.code === 'Digit0') {
          e.preventDefault();
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        }
} else if (e.shiftKey && e.code === 'Digit0') {
          e.preventDefault();
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime + 10);
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
        <EventTable events={events} onEventClick={handleEventClick} setEvents={setEvents} />
        <ExportButton events={events} />
      </div>
      {showPlayerModal && (
        <PlayerModal
          onConfirm={handlePlayerSelect}
          onClose={() => {
            setShowPlayerModal(false);
            setSelectingReceiver(false);
            setSelectingSecondPlayer(false);
          }}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
          title={selectingReceiver ? 'Select Player Receiver' : selectingSecondPlayer ? 'Select Player In' : 'Select Player'}
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
      {showGoalkeeperModal && (
        <GoalkeeperModal
          onConfirm={handleGoalkeeperSelect}
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
        <PlayerReceiverModal
          onConfirm={handlePlayerReceiverSelect}
          onClose={() => setShowPlayerReceiverModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
    </div>
  );
};

export default FootballAnalysis;