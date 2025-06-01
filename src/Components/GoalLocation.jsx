import React, { useState, useEffect } from 'react';
import goal from "../assets/goall.jpeg";

const GoalLocation = ({ onSelect, onClose, videoRef, setIsPlaying }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [coordinates, setCoordinates] = useState({ finalX: null, finalY: null });

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [videoRef, setIsPlaying]);

  const svgWidth = 600; 
  const svgHeight = 400; 

  const handleSvgClick = (event) => {
    const svg = event.currentTarget;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    setSelectedPoint({ x: svgPoint.x, y: svgPoint.y });

    
    const scaledX = (svgPoint.x / svgWidth) * 100;
    const scaledY = (svgPoint.y / svgHeight) * 100;
    const roundedX = Math.round(scaledX * 10) / 10;
    const roundedY = Math.round(scaledY * 10) / 10;
    const finalX = Math.max(0, Math.min(100, roundedX));
    const finalY = Math.max(0, Math.min(100, roundedY));
    setCoordinates({ finalX, finalY });
  };

  const handleConfirm = () => {
    if (selectedPoint && coordinates.finalX !== null && coordinates.finalY !== null) {
      onSelect(coordinates.finalX, coordinates.finalY);
    }
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleCancel = () => {
    onClose();
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent overflow-y-scroll z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="relative">
          <svg
            width={svgWidth}
            height={svgHeight}
            onClick={handleSvgClick}
          >
            <image
              x="0"
              y="0"
              width={svgWidth}
              height={svgHeight}
              href={goal}
              preserveAspectRatio="xMidYMid meet"
            />

            {selectedPoint && (
              <circle
                cx={selectedPoint.x}
                cy={selectedPoint.y}
                r="5"
                fill="red"
              />
            )}
          </svg>
        </div>

        {selectedPoint && coordinates.finalX !== null && coordinates.finalY !== null && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Field Coordinates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-blue-600 font-medium">position X: {coordinates.finalX}</div>
                <div className="text-sm text-gray-500">Percentage from left edge</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-green-600 font-medium">position Y: {coordinates.finalY}</div>
                <div className="text-sm text-gray-500">Percentage from top edge</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4 mt-6 overflow-y-scroll">
          {selectedPoint && (
            <button
              onClick={() => {
                setSelectedPoint(null);
                setCoordinates({ finalX: null, finalY: null });
              }}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
            >
              clear selection
            </button>
          )}
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedPoint || coordinates.finalX === null}
            className={`py-2 px-4 rounded-lg ${
              selectedPoint && coordinates.finalX !== null
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            confirm location
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalLocation;