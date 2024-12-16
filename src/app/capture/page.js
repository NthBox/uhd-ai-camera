'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Camera from '@/components/Camera';

const CapturePage = () => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = async (imageData) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('enhancedImage', data.enhancedImage);
        router.push('/result');
      } else {
        throw new Error(data.error || 'Enhancement failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to enhance image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Handle any async initialization here
  }, []);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="p-4">
          <h1 className="text-2xl font-bold">Processing</h1>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p>Enhancing your photo...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-4">
        <h1 className="text-2xl font-bold">Take Photo</h1>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Camera onCapture={handleCapture} />
      </main>
    </div>
  );
};

export default CapturePage; 