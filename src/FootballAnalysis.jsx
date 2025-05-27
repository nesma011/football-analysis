import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import ExportButton from './components/ExportButton';
import EventTable from './components/EventTable';
import PassEvents from './components/categories/PassEvents';
import ShotEvents from './components/categories/ShotEvents';
import PossessionDribblingEvents from './components/categories/PossessionDribblingEvents';
import DefensiveEvents from './components/categories/DefensiveEvents';
import SetPiecesSpecialEvents from './components/categories/SetPiecesSpecialEvents';

const FootballAnalysis = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [events, setEvents] = useState([]);
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
      const parsedEvents = JSON.parse(savedEvents).map((event) => ({
        ...event,
        id: event.id || Date.now() + Math.random(),
        videoTimestamp: event.videoTimestamp || (event.startTime ? new Date(event.startTime).getTime() / 1000 : 0),
        endTime: event.endTime || (event.videoTimestamp || 0),
        duration: event.duration || (event.endTime && event.videoTimestamp ? (event.endTime - event.videoTimestamp) * 1000 / 1000 : 0),
        extraInfo: event.extraInfo || '-',
        passType: event.passType || '-',
        bodyPart: event.bodyPart || '-',
        saveTechnique: event.saveTechnique || '-',
        playerReceiver: event.playerReceiver || '-',
        playerOut: event.playerOut || '-',
        playerIn: event.playerIn || '-',
        team: event.team || '-',
      }));
      setEvents(parsedEvents);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
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

  const finalizeEvent = (updatedEvent) => {
    const eventId = updatedEvent.id || Date.now() + Math.floor(Math.random() * 1000);
    const endTime = updatedEvent.endTime || (videoRef.current?.currentTime || Date.now() / 1000);
    const duration =
      updatedEvent.type === 'Var Stop' || updatedEvent.type === 'Water Break'
        ? endTime - (updatedEvent.startTime || updatedEvent.videoTimestamp || 0)
        : updatedEvent.endTime && updatedEvent.videoTimestamp
        ? (endTime - updatedEvent.videoTimestamp) * 1000 / 1000
        : 0;

    const completedEvent = {
      ...updatedEvent,
      id: eventId,
      endTime,
      duration,
      player: updatedEvent.type === 'Sub' ? null : updatedEvent.player,
      videoTimestamp: updatedEvent.videoTimestamp || 0,
      extraInfo: updatedEvent.type === 'Sub' ? '-' : updatedEvent.extraInfo || '-',
      passType: updatedEvent.type === 'Sub' ? '-' : updatedEvent.passType || '-',
      bodyPart: updatedEvent.type === 'Sub' ? '-' : updatedEvent.bodyPart || '-',
      saveTechnique: updatedEvent.type === 'Sub' ? '-' : updatedEvent.saveTechnique || '-',
      playerReceiver: updatedEvent.type === 'Sub' ? '-' : updatedEvent.playerReceiver || '-',
      playerOut: updatedEvent.type === 'Sub' ? updatedEvent.playerOut || '-' : '-',
      playerIn: updatedEvent.type === 'Sub' ? updatedEvent.playerIn || '-' : '-',
      team: updatedEvent.team || '-',
      startLocation: updatedEvent.type === 'Sub' ? null : updatedEvent.startLocation,
      endLocation: updatedEvent.type === 'Sub' ? null : updatedEvent.endLocation,
    };

    const updatedEvents = events.filter((event) => event.id !== completedEvent.id);
    updatedEvents.push(completedEvent);
    setEvents(updatedEvents);
    localStorage.setItem('footballEvents', JSON.stringify(updatedEvents));
  };

  const handleEventClick = (event) => {
    if (!events.length) return;
    const videoTime = event.videoTimestamp;
    if (videoRef.current) {
      videoRef.current.currentTime = videoTime;
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const keyActions = {
        w: () => document.querySelector(`button[data-type="Ground Pass"]`)?.click(),
        q: () => document.querySelector(`button[data-type="High Pass"]`)?.click(),
        e: () => document.querySelector(`button[data-type="Low Pass"]`)?.click(),
        d: () => document.querySelector(`button[data-type="Shot"]`)?.click(),
        t: () => document.querySelector(`button[data-type="Dribble"]`)?.click(),
        s: () => document.querySelector(`button[data-type="Dispossessed"]`)?.click(),
        5: () => document.querySelector(`button[data-type="Miss control"]`)?.click(),
        r: () => document.querySelector(`button[data-type="Ball Recovery"]`)?.click(),
        g: () => document.querySelector(`button[data-type="Press"]`)?.click(),
        8: () => document.querySelector(`button[data-type="Foul Won"]`)?.click(),
        a: () => document.querySelector(`button[data-type="Duel"]`)?.click(),
        x: () => document.querySelector(`button[data-type="Interception"]`)?.click(),
        f: () => document.querySelector(`button[data-type="Clearance"]`)?.click(),
        b: () => document.querySelector(`button[data-type="Block"]`)?.click(),
        n: () => document.querySelector(`button[data-type="Dribbled Past"]`)?.click(),
        9: () => document.querySelector(`button[data-type="Foul Commit"]`)?.click(),
      };

      if (e.ctrlKey && e.code === 'Digit0') {
        e.preventDefault();
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        }
      } else if (e.shiftKey && e.code === 'Digit0') {
        e.preventDefault();
        if (videoRef.current) {
          videoRef.current.currentTime = Math.min(
            videoRef.current.duration,
            videoRef.current.currentTime + 10
          );
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
          <PassEvents
            videoRef={videoRef}
            setIsPlaying={setIsPlaying}
            events={events}
            setEvents={setEvents}
            finalizeEvent={finalizeEvent}
          />
          <ShotEvents
            videoRef={videoRef}
            setIsPlaying={setIsPlaying}
            events={events}
            setEvents={setEvents}
            finalizeEvent={finalizeEvent}
          />
          <PossessionDribblingEvents
            videoRef={videoRef}
            setIsPlaying={setIsPlaying}
            events={events}
            setEvents={setEvents}
            finalizeEvent={finalizeEvent}
          />
          <DefensiveEvents
            videoRef={videoRef}
            setIsPlaying={setIsPlaying}
            events={events}
            setEvents={setEvents}
            finalizeEvent={finalizeEvent}
          />
          <SetPiecesSpecialEvents
            videoRef={videoRef}
            setIsPlaying={setIsPlaying}
            events={events}
            setEvents={setEvents}
            finalizeEvent={finalizeEvent}
          />
        </div>
      </div>
      <div className="w-full mt-8">
        <EventTable events={events} onEventClick={handleEventClick} setEvents={setEvents} />
        <ExportButton events={events} />
      </div>
    </div>
  );
};

export default FootballAnalysis;