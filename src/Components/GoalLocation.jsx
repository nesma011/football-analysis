import React, { useState, useEffect } from 'react';

const GoalLocation = ({ onSelect, onClose, videoRef, setIsPlaying }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Pause video when the modal opens
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [videoRef, setIsPlaying]);

  // Handle click on the SVG to select a point
  const handleSvgClick = (event) => {
    const svg = event.currentTarget;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    setSelectedPoint({ x: svgPoint.x, y: svgPoint.y });
  };

  // Handle confirm button click
  const handleConfirm = () => {
    if (selectedPoint) {
      // SVG dimensions and goal dimensions in pixels
      const svgWidth = 600;
      const svgHeight = 400;
      const goalWidth = goalWidthMeters * scale; // From goal dimensions below
      const goalHeight = goalHeightMeters * scale;
      const goalX = (svgWidth - goalWidth) / 2;
      const goalY = 50;

      // Adjust coordinates relative to the goal's top-left corner
      const adjustedX = selectedPoint.x - goalX;
      const adjustedY = selectedPoint.y - goalY;

      // Scale to 0-100 range based on goal dimensions
      const scaledX = (adjustedX / goalWidth) * 100;
      const scaledY = (adjustedY / goalHeight) * 100;

      // Round to 1 decimal place
      const roundedX = Math.round(scaledX * 10) / 10;
      const roundedY = Math.round(scaledY * 10) / 10;

      // Ensure coordinates are within 0-100 range
      const finalX = Math.max(0, Math.min(100, roundedX));
      const finalY = Math.max(0, Math.min(100, roundedY));

      onSelect(finalX, finalY);
    }
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    onClose();
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // SVG dimensions (scaled for display)
  const svgWidth = 600; // Pixels (representing the penalty area width)
  const svgHeight = 400; // Pixels (representing the penalty area height)

  // Goal dimensions in meters (scaled to SVG)
  const goalWidthMeters = 7.32; // 7.32m wide
  const goalHeightMeters = 2.44; // 2.44m high
  const goalAreaWidthMeters = 18.32; // 6-yard box width (5.5m from each post + goal width)
  const goalAreaDepthMeters = 5.5; // 6-yard box depth
  const penaltyAreaWidthMeters = 40.32; // 18-yard box width (16.5m from each post + goal width)
  const penaltyAreaDepthMeters = 16.5; // 18-yard box depth

  // Scale meters to SVG pixels (arbitrary scale for visualization)
  const scale = svgWidth / penaltyAreaWidthMeters; // Scale based on penalty area width
  const goalWidth = goalWidthMeters * scale;
  const goalHeight = goalHeightMeters * scale;
  const goalAreaWidth = goalAreaWidthMeters * scale;
  const goalAreaDepth = goalAreaDepthMeters * scale;
  const penaltyAreaWidth = penaltyAreaWidthMeters * scale;
  const penaltyAreaDepth = penaltyAreaDepthMeters * scale;

  // Center the goal on the SVG
  const goalX = (svgWidth - goalWidth) / 2;
  const goalY = 50; // Position the goal slightly below the top of the SVG

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent overflow-y-scroll z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-center">Goal Location</h2>
        <div className="relative">
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="border border-gray-300"
            onClick={handleSvgClick}
          >
            {/* Background (field) - Simple green */}
            <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="#4ade80" />

            {/* Penalty Area (18-yard box) */}
            <rect
              x={(svgWidth - penaltyAreaWidth) / 2}
              y={goalY}
              width={penaltyAreaWidth}
              height={penaltyAreaDepth}
              fill="none"
              stroke="white"
              strokeWidth="2"
            />

            {/* Goal Area (6-yard box) */}
            <rect
              x={(svgWidth - goalAreaWidth) / 2}
              y={goalY}
              width={goalAreaWidth}
              height={goalAreaDepth}
              fill="none"
              stroke="white"
              strokeWidth="2"
            />

            {/* Goal */}
            <rect
              x={goalX}
              y={goalY}
              width={goalWidth}
              height={goalHeight}
              fill="white"
              stroke="black"
              strokeWidth="3"
            />

            {/* Goal Line */}
            <line
              x1={(svgWidth - penaltyAreaWidth) / 2}
              y1={goalY}
              x2={(svgWidth + penaltyAreaWidth) / 2}
              y2={goalY}
              stroke="white"
              strokeWidth="2"
            />

            {/* Selected Point */}
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
        
        {/* Field Coordinates */}
        {selectedPoint && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Field Coordinates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-blue-600 font-medium">X Position: {Math.round(selectedPoint.x * 10) / 10}m</div>
                <div className="text-sm text-gray-500">Distance from left goal line</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-green-600 font-medium">Y Position: {Math.round(selectedPoint.y * 10) / 10}m</div>
                <div className="text-sm text-gray-500">Distance from bottom sideline</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-center space-x-4 mt-6 overflow-y-scroll">
          {selectedPoint && (
            <button
              onClick={() => setSelectedPoint(null)}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
            >
              Clear Selection
            </button>
          )}
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedPoint}
            className={`py-2 px-4 rounded-lg ${
              selectedPoint
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm Location
          </button>
        </div>
        <div className="flex justify-end space-x-4 mt-4 ">
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedPoint}
            className={`py-2 px-4 rounded-lg ${
              selectedPoint
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalLocation;