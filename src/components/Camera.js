'use client';

import { useEffect, useRef, useState } from 'react';

export default function Camera({ onCapture }) {
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);

  useEffect(() => {
    initializeCamera();
  }, [isFrontCamera]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setHasPermission(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    onCapture(imageData);
  };

  const toggleCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsFrontCamera(!isFrontCamera);
  };

  if (hasPermission === null) {
    return <div className="text-center p-4">Requesting camera access...</div>;
  }

  if (hasPermission === false) {
    return <div className="text-center p-4 text-red-500">Camera access denied</div>;
  }

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-lg"
      />
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={toggleCamera}
          className="bg-gray-800 p-3 rounded-full"
          aria-label="Switch camera"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <button
          onClick={capturePhoto}
          className="bg-blue-600 p-4 rounded-full"
          aria-label="Take photo"
        >
          <div className="w-12 h-12 rounded-full border-4 border-white" />
        </button>
      </div>
    </div>
  );
} 