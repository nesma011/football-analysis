import { useEffect, useRef, useState } from 'react';
import React from 'react';

const LocationModal = ({ onSelect, onClose, eventType,videoRef ,setIsPlaying }) => {
  const canvasRef = useRef(null);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const goalCoordinates = {
    top_left: { x: 30, y: 140, z: 2.67 }, 
    top_right: { x: 30, y: 210, z: 2.67 }, 
    bottom_left: { x: 30, y: 140, z: 0 },
    bottom_right: { x: 30, y: 210, z: 0 }, 
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawFootballField = () => {
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(0, 0, 600, 350);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'white';
      const fieldX = 30;
      const fieldY = 30;
      const fieldWidth = 540;
      const fieldHeight = 290;
      ctx.strokeRect(fieldX, fieldY, fieldWidth, fieldHeight);
      const centerX = fieldX + fieldWidth / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, fieldY);
      ctx.lineTo(centerX, fieldY + fieldHeight);
      ctx.stroke();
      const centerY = fieldY + fieldHeight / 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 45, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI);
      ctx.fill();
      const penaltyBoxWidth = 100;
      const penaltyBoxHeight = 190;
      const penaltyBoxY = centerY - penaltyBoxHeight / 2;
      ctx.strokeRect(fieldX, penaltyBoxY, penaltyBoxWidth, penaltyBoxHeight);
      ctx.strokeRect(fieldX + fieldWidth - penaltyBoxWidth, penaltyBoxY, penaltyBoxWidth, penaltyBoxHeight);
      const goalBoxWidth = 35;
      const goalBoxHeight = 95;
      const goalBoxY = centerY - goalBoxHeight / 2;
      ctx.strokeRect(fieldX, goalBoxY, goalBoxWidth, goalBoxHeight);
      ctx.strokeRect(fieldX + fieldWidth - goalBoxWidth, goalBoxY, goalBoxWidth, goalBoxHeight);
      ctx.beginPath();
      ctx.arc(fieldX + 70, centerY, 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(fieldX + fieldWidth - 70, centerY, 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(fieldX + 70, centerY, 45, -Math.PI/2.5, Math.PI/2.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(fieldX + fieldWidth - 70, centerY, 45, Math.PI - Math.PI/2.5, Math.PI + Math.PI/2.5);
      ctx.stroke();
      const cornerRadius = 6;
      ctx.beginPath();
      ctx.arc(fieldX, fieldY, cornerRadius, 0, Math.PI/2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(fieldX + fieldWidth, fieldY, cornerRadius, Math.PI/2, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(fieldX, fieldY + fieldHeight, cornerRadius, -Math.PI/2, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(fieldX + fieldWidth, fieldY + fieldHeight, cornerRadius, Math.PI, -Math.PI/2);
      ctx.stroke();
      const goalWidth = 18;
      const goalHeight = 50;
      const goalY = centerY - goalHeight / 2;
      ctx.strokeRect(fieldX - goalWidth, goalY, goalWidth, goalHeight);
      ctx.strokeRect(fieldX + fieldWidth, goalY, goalWidth, goalHeight);

      // رسم نقاط المرمى لأحداث Goalkeeper
      if (eventType === 'Goalkeeper') {
        Object.values(goalCoordinates).forEach(coord => {
          ctx.fillStyle = '#ff0000';
          ctx.beginPath();
          ctx.arc(coord.x, coord.y, 5, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= 600; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 350);
        ctx.stroke();
      }
      for (let y = 0; y <= 350; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(600, y);
        ctx.stroke();
      }
    };

    drawFootballField();
    drawGrid();
  }, [eventType]);

  useEffect(() => {
    if (selectedPoint) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 600, 350);
      
      const drawFootballField = () => {
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(0, 0, 600, 350);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'white';
        const fieldX = 30;
        const fieldY = 30;
        const fieldWidth = 540;
        const fieldHeight = 290;
        ctx.strokeRect(fieldX, fieldY, fieldWidth, fieldHeight);
        const centerX = fieldX + fieldWidth / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, fieldY);
        ctx.lineTo(centerX, fieldY + fieldHeight);
        ctx.stroke();
        const centerY = fieldY + fieldHeight / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 45, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI);
        ctx.fill();
        const penaltyBoxWidth = 100;
        const penaltyBoxHeight = 190;
        const penaltyBoxY = centerY - penaltyBoxHeight / 2;
        ctx.strokeRect(fieldX, penaltyBoxY, penaltyBoxWidth, penaltyBoxHeight);
        ctx.strokeRect(fieldX + fieldWidth - penaltyBoxWidth, penaltyBoxY, penaltyBoxWidth, penaltyBoxHeight);
        const goalBoxWidth = 35;
        const goalBoxHeight = 95;
        const goalBoxY = centerY - goalBoxHeight / 2;
        ctx.strokeRect(fieldX, goalBoxY, goalBoxWidth, goalBoxHeight);
        ctx.strokeRect(fieldX + fieldWidth - goalBoxWidth, goalBoxY, goalBoxWidth, goalBoxHeight);
        ctx.beginPath();
        ctx.arc(fieldX + 70, centerY, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(fieldX + fieldWidth - 70, centerY, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(fieldX + 70, centerY, 45, -Math.PI/2.5, Math.PI/2.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(fieldX + fieldWidth - 70, centerY, 45, Math.PI - Math.PI/2.5, Math.PI + Math.PI/2.5);
        ctx.stroke();
        const cornerRadius = 6;
        ctx.beginPath();
        ctx.arc(fieldX, fieldY, cornerRadius, 0, Math.PI/2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(fieldX + fieldWidth, fieldY, cornerRadius, Math.PI/2, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(fieldX, fieldY + fieldHeight, cornerRadius, -Math.PI/2, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(fieldX + fieldWidth, fieldY + fieldHeight, cornerRadius, Math.PI, -Math.PI/2);
        ctx.stroke();
        const goalWidth = 18;
        const goalHeight = 50;
        const goalY = centerY - goalHeight / 2;
        ctx.strokeRect(fieldX - goalWidth, goalY, goalWidth, goalHeight);
        ctx.strokeRect(fieldX + fieldWidth, goalY, goalWidth, goalHeight);

        // إعادة رسم نقاط المرمى
        if (eventType === 'Goalkeeper') {
          Object.values(goalCoordinates).forEach(coord => {
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(coord.x, coord.y, 5, 0, 2 * Math.PI);
            ctx.fill();
          });
        }
      };

      const drawGrid = () => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= 600; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 350);
          ctx.stroke();
        }
        for (let y = 0; y <= 350; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(600, y);
          ctx.stroke();
        }
      };

      drawFootballField();
      drawGrid();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(selectedPoint.x, selectedPoint.y, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(selectedPoint.x, selectedPoint.y, 10, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }, [selectedPoint, eventType]);

  const handleClick = (e) => {
     if (videoRef?.current) {
    videoRef.current.pause();
    setIsPlaying(false);
  }
    const rect = e.target.getBoundingClientRect();
    let x = Math.round(e.clientX - rect.left);
    let y = Math.round(e.clientY - rect.top);

    if (eventType === 'Goalkeeper') {
      let selectedGoal = null;
      for (const [key, coord] of Object.entries(goalCoordinates)) {
        const distance = Math.sqrt((x - coord.x) ** 2 + (y - coord.y) ** 2);
        if (distance < 10) {
          selectedGoal = coord;
          break;
        }
      }
      if (selectedGoal) {
        x = selectedGoal.x;
        y = selectedGoal.y;
      }
    }

    setSelectedPoint({ x, y });
  };

  const getFieldCoordinates = (x, y) => {
    const fieldX = 30;
    const fieldY = 30;
    const fieldWidth = 540;
    const fieldHeight = 290;
    const fieldLengthMeters = 105;
    const fieldWidthMeters = 68;

    if (x < fieldX || x > fieldX + fieldWidth || y < fieldY || y > fieldY + fieldHeight) {
      return null;
    }

    const fieldX_meters = ((x - fieldX) / fieldWidth * fieldLengthMeters).toFixed(1);
    const fieldY_meters = ((y - fieldY) / fieldHeight * fieldWidthMeters).toFixed(1);

    return { x: parseFloat(fieldX_meters), y: parseFloat(fieldY_meters) };
  };

  const fieldCoordinates = selectedPoint ? getFieldCoordinates(selectedPoint.x, selectedPoint.y) : null;

  const handleConfirm = () => {
    if (fieldCoordinates && onSelect) {
      onSelect(fieldCoordinates.x, fieldCoordinates.y);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Select Event Location on Field</h2>
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width="600"
            height="350"
            onClick={handleClick}
            className="border-2 border-gray-300 rounded cursor-crosshair"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        {selectedPoint && fieldCoordinates && (
          <div className="bg-blue-100 p-3 rounded mb-4">
            <h3 className="font-semibold text-blue-700 mb-2">Field Coordinates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm"><strong>X Position:</strong> {fieldCoordinates.x}m</p>
                <p className="text-xs text-gray-600">(Distance from left goal line)</p>
              </div>
              <div>
                <p className="text-sm"><strong>Y Position:</strong> {fieldCoordinates.y}m</p>
                <p className="text-xs text-gray-600">(Distance from bottom sideline)</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center gap-3 flex-wrap">
          <button 
            onClick={() => setSelectedPoint(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Clear Selection
          </button>
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Cancel
          </button>
          {selectedPoint && fieldCoordinates && (
            <button 
              onClick={handleConfirm}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Confirm Location
            </button>
          )}
        </div>
        <div className="mt-3 text-sm text-gray-600 text-center">
          <p>Click anywhere on the field to select coordinates</p>
          <p>Field dimensions: 105m × 68m (standard football field)</p>
          {eventType === 'Goalkeeper' && (
            <p className="text-red-600">Click near red goal points for goalkeeper events</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationModal;