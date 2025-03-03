'use client';

import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Camera from '@/components/Camera';
import { useAuth } from "@clerk/nextjs";

export default function CapturePage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    // Check authentication
    if (!userId) {
      // Redirect to Clerk's hosted sign-in page
      window.location.href = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL;
      return;
    }

    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [userId, router]);

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
        localStorage.setItem('predictionId', data.predictionId);
        localStorage.setItem('originalImage', imageData);
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
    <div className="fixed inset-0 w-screen h-screen bg-black" style={{ height: '100dvh' }}>
      {isProcessing ? (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p className="text-white">Starting enhancement process...</p>
          </div>
        </div>
      ) : (
        <Camera onCapture={handleCapture} />
      )}
    </div>
  );
}