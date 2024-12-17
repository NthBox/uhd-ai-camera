'use client';

import { useRef, useState, useEffect } from 'react';

export default function Camera({ onCapture }) {
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.5);

  useEffect(() => {
    const enterFullScreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        }
      } catch (err) {
        console.log('Fullscreen request failed:', err);
      }
    };

    enterFullScreen();

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (document.webkitFullscreenElement) {
        document.webkitExitFullscreen();
      }
    };
  }, []);

  useEffect(() => {
    initializeCamera();
  }, [isFrontCamera]);

  const initializeCamera = async () => {
    try {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          advanced: [{
            facingMode: isFrontCamera ? 'user' : 'environment',
            deviceId: { ideal: 'wide' }
          }]
        }
      };

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
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
      ctx.drawImage(videoRef.current, 0, 0);
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(videoRef.current, 0, 0);
    } else {
      ctx.drawImage(videoRef.current, 0, 0);
    }
    
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

  const handleZoomChange = (level) => {
    setZoomLevel(level);
    // Note: Actual zoom implementation would require additional camera API support
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden" style={{
      height: '100dvh',
      touchAction: 'none'
    }}>
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* save for future features */}
          {/* <button className="w-8 h-8 flex items-center justify-center bg-yellow-400 rounded-full">
            <span className="text-black text-xl">⚡</span>
          </button>
          <div className="bg-gray-800 rounded-full px-2 py-1">
            <span className="text-white">-1.0</span>
          </div> */}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-white">UHD AI</span>
          {/* save for future features */}
          {/* <button className="w-8 h-8 rounded-full border-2 border-white"></button> */}
        </div>
      </div>

      {/* Camera View */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover`}
        style={{ 
          transform: isFrontCamera ? `scaleX(-1) scale(${zoomLevel})` : `scale(${zoomLevel})`,
        }}
      />

      {/* Zoom Controls save for future scaling */}
      {/* <div className="absolute bottom-32 left-0 right-0 flex justify-center space-x-8 text-white">
        <button onClick={() => handleZoomChange(0.5)} className="opacity-60">0.5</button>
        <button onClick={() => handleZoomChange(1.5)} className="text-yellow-400">1.5x</button>
        <button onClick={() => handleZoomChange(2)} className="opacity-60">2</button>
        <button onClick={() => handleZoomChange(3)} className="opacity-60">3</button>
      </div> */}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 pb-8 px-4">
        <div className="flex justify-center items-center mb-8">
          {/* save for future features */}
          {/* <button className="text-white opacity-60">CINEMATIC</button>
          <button className="text-white opacity-60">VIDEO</button> */}
          <button className="text-yellow-400">PHOTO</button>
          {/* save for future features */}
          {/* <button className="text-white opacity-60">PORTRAIT</button>
          <button className="text-white opacity-60">PANO</button> */}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="w-16 h-16 rounded-lg overflow-hidden">
            {/* Thumbnail preview would go here */}
          </div>
          <button
            onClick={capturePhoto}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
          >
            <div className="w-16 h-16 bg-white rounded-full"></div>
          </button>
          <button
            onClick={toggleCamera}
            className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-8 h-8 text-white"
            >
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}