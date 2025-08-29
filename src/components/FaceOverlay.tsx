'use client';

import { useEffect, useRef } from 'react';

interface FaceData {
  name: string;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface FaceOverlayProps {
  faceData: FaceData[];
  videoWidth: number;
  videoHeight: number;
}

const FaceOverlay = ({ faceData, videoWidth, videoHeight }: FaceOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match video
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bounding boxes and indicators
    faceData.forEach(face => {
      // Draw bounding box
      ctx.strokeStyle = '#3b82f6'; // Blue color from our new palette
      ctx.lineWidth = 2;
      ctx.strokeRect(face.left, face.top, face.right - face.left, face.bottom - face.top);
      
      // Draw name label
      const label = face.name;
      const labelWidth = ctx.measureText(label).width;
      const labelHeight = 20;
      
      // Use a lighter blue for the background
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'; // Blue background with opacity
      if (face.name === 'Unknown') {
        ctx.fillStyle = 'rgba(239, 68, 0.2)'; // Red background for unknown faces
      }
      ctx.fillRect(face.left, face.top - labelHeight, labelWidth + 10, labelHeight);
      
      ctx.fillStyle = '#ffffff'; // White text for better visibility
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText(label, face.left + 5, face.top - 5);
    });
  }, [faceData, videoWidth, videoHeight]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-xl"
    />
  );
};

export default FaceOverlay;