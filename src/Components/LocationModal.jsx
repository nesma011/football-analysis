import { useEffect, useRef, useState } from 'react';
import React from 'react';

const LocationModal = ({ onSelect, onClose, eventType, videoRef, setIsPlaying }) => {
  const canvasRef = useRef(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const goalCoordinates = {
    top_left: { x: 30, y: 115, z: 2.44 }, 
    top_right: { x: 30, y: 155, z: 2.44 }, 
    bottom_left: { x: 30, y: 115, z: 0 },
    bottom_right: { x: 30, y: 155, z: 0 }, 
  };
const handleMouseLeave = () => {
    setCursorPosition({ x: 0, y: 0 });
  };
  const drawFootballField = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#2d5016');
    gradient.addColorStop(0.5, '#4ade80');
    gradient.addColorStop(1, '#2d5016');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 720, 400);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'white';

    const fieldX = 30;
    const fieldY = 30;
    const fieldWidth = 660; // 120م
    const fieldHeight = 340; // 80م

    ctx.strokeRect(fieldX, fieldY, fieldWidth, fieldHeight);

    const centerX = fieldX + fieldWidth / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, fieldY);
    ctx.lineTo(centerX, fieldY + fieldHeight);
    ctx.stroke();

    // دائرة المنتصف
    const centerY = fieldY + fieldHeight / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 55, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fill();

    const penaltyBoxWidth = 110; // 20م
    const penaltyBoxHeight = 220; // 40م  
    const penaltyBoxY = centerY - penaltyBoxHeight / 2;
    
    ctx.strokeRect(fieldX, penaltyBoxY, penaltyBoxWidth, penaltyBoxHeight);
    ctx.strokeRect(fieldX + fieldWidth - penaltyBoxWidth, penaltyBoxY, penaltyBoxWidth, penaltyBoxHeight);

    const goalBoxWidth = 33; // 6م
    const goalBoxHeight = 110; // 20م
    const goalBoxY = centerY - goalBoxHeight / 2;
    
    ctx.strokeRect(fieldX, goalBoxY, goalBoxWidth, goalBoxHeight);
    ctx.strokeRect(fieldX + fieldWidth - goalBoxWidth, goalBoxY, goalBoxWidth, goalBoxHeight);

    ctx.beginPath();
    ctx.arc(fieldX + 66, centerY, 3, 0, 2 * Math.PI); // 
    ctx.fill();
    ctx.beginPath();
    ctx.arc(fieldX + fieldWidth - 66, centerY, 3, 0, 2 * Math.PI);
    ctx.fill();

    const arcStartY = goalBoxY;
    const arcEndY = goalBoxY + goalBoxHeight;
    const arcRadius = (arcEndY - arcStartY) / 2;
    
    ctx.save();
    ctx.beginPath();
    ctx.rect(fieldX + penaltyBoxWidth, penaltyBoxY, fieldWidth - 2 * penaltyBoxWidth, penaltyBoxHeight);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(fieldX + 66, centerY, arcRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
    
    ctx.save();
    ctx.beginPath();
    ctx.rect(fieldX, penaltyBoxY, fieldWidth - penaltyBoxWidth, penaltyBoxHeight);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(fieldX + fieldWidth - 66, centerY, arcRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();

    const cornerRadius = 8;
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

    const goalWidth = 22; // 4م
    const goalHeight = 44; // 8م
    const goalY = centerY - goalHeight / 2;
    
    ctx.strokeRect(fieldX - goalWidth, goalY, goalWidth, goalHeight);
    ctx.strokeRect(fieldX + fieldWidth, goalY, goalWidth, goalHeight);

    if (eventType === 'Goalkeeper') {
      Object.values(goalCoordinates).forEach(coord => {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(coord.x, coord.y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(coord.x, coord.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
      });
    }
  };

  const drawGrid = (ctx) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    
    // خطوط عمودية
    for (let x = 0; x <= 720; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 400);
      ctx.stroke();
    }
    
    // خطوط أفقية
    for (let y = 0; y <= 400; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(720, y);
      ctx.stroke();
    }
  };



 const drawSelectedPoint = (ctx, point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  };

useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 720, 400);

    drawFootballField(ctx);
    drawGrid(ctx);

    if (selectedPoint) {
      drawSelectedPoint(ctx, selectedPoint);
    }
  }, [selectedPoint]);

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCursorPosition({ x, y });
  };

 const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    setSelectedPoint({ x, y });
  };

  const getFieldCoordinates = (x, y) => {
    const fieldX = 30;
    const fieldY = 30;
    const fieldWidth = 660;
    const fieldHeight = 340;
    const fieldLengthMeters = 120; 
    const fieldWidthMeters = 80;   

    if (x < fieldX || x > fieldX + fieldWidth || y < fieldY || y > fieldY + fieldHeight) {
      return null;
    }

    const fieldX_meters = ((x - fieldX) / fieldWidth * fieldLengthMeters).toFixed(1);
    const fieldY_meters = ((y - fieldY) / fieldHeight * fieldWidthMeters).toFixed(1);

    return { 
      x: parseFloat(fieldX_meters), 
      y: parseFloat(fieldY_meters) 
    };
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
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-5xl w-full max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Select Event Location on Field
        </h2>
        
        <div className="flex justify-center mb-6">
          <canvas
            ref={canvasRef}
            width="720"
            height="400"
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="border-2 border-gray-300 rounded-lg shadow-lg cursor-pointer"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        {selectedPoint && fieldCoordinates && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-700 mb-3 text-lg">Field Coordinates</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-gray-700">
                  <span className="text-blue-600">X Position:</span> {fieldCoordinates.x}m
                </p>
                <p className="text-xs text-gray-500 mt-1">Distance from left goal line</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-gray-700">
                  <span className="text-green-600">Y Position:</span> {fieldCoordinates.y}m
                </p>
                <p className="text-xs text-gray-500 mt-1">Distance from bottom sideline</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 flex-wrap">
          <button 
            onClick={() => {
              setSelectedPoint(null);
              setCursorPosition(null);
            }}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Clear Selection
          </button>
          
          <button 
            onClick={onClose} 
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
          
          {selectedPoint && fieldCoordinates && (
            <button 
              onClick={handleConfirm}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg animate-pulse"
            >
              Confirm Location
            </button>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-600 text-center space-y-2">
          <p className="font-medium">Click anywhere on the field to select coordinates</p>
          <p>Field dimensions: 120m × 80m (standard football field)</p>
          {eventType === 'Goalkeeper' && (
            <p className="text-red-600 font-medium">
              Click near red goal points for goalkeeper events
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationModal;