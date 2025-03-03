'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Camera from '@/components/Camera';

export default function CapturePage() {
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
        localStorage.setItem('capturedImage', imageData);
        router.push('/processing');
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-4">
        <h1 className="text-2xl font-bold">Take Photo</h1>
      </header>
      <main className="container mx-auto px-4 py-8">
        {isProcessing ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p>Processing your photo...</p>
          </div>
        ) : (
          <Camera onCapture={handleCapture} />
        )}
      </main>
    </div>
  );
}