
import React ,{ useEffect } from 'react';
import FootballAnalysis from './FootballAnalysis';

function App() {
  useEffect(() => {
    return () => {
      const savedVideo = localStorage.getItem('currentVideo');
      if (savedVideo) {
        URL.revokeObjectURL(savedVideo);
        localStorage.removeItem('currentVideo');
      }
    };
  }, []);
  return (
    <div className="bg-gray-100 font-sans">
      <FootballAnalysis />
    </div>
  );
}

export default App;