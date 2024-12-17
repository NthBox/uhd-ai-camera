'use client';

import { useRef, useState, useEffect } from 'react';

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
    if (isFrontCamera) {
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
    }
    ctx.drawImage(videoRef.current, 0, 0);
    
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

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full aspect-[4/3] bg-gray-800 rounded-lg ${
          isFrontCamera ? 'scale-x-[-1]' : ''
        }`}
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={capturePhoto}
          className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium"
        >
          Capture
        </button>
        <button
          onClick={toggleCamera}
          className="bg-gray-600 text-white px-6 py-2 rounded-full font-medium"
        >
          Flip
        </button>
      </div>
    </div>
  );
}