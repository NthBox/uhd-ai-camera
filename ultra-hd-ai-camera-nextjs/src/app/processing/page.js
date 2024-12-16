'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProcessingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [processId, setProcessId] = useState(null);

  const MAX_POLLING_TIME = 120000; // 2 minutes maximum polling time
  const POLLING_INTERVAL = 2000; // 2 seconds between polls

  useEffect(() => {
    const processImage = async () => {
      try {
        const originalImage = localStorage.getItem('capturedImage');
        if (!originalImage) {
          console.log('🔴 [Client] No image found in localStorage');
          router.replace('/capture');
          return;
        }

        // Initial API call to start processing
        if (!processId) {
          console.log('🔵 [Client] Starting enhancement process');
          const response = await fetch('/api/enhance', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: originalImage }),
          });

          const data = await response.json();
          console.log('🔵 [Client] Enhancement process initiated:', data);
          
          if (data.error) {
            console.error('🔴 [Client] Enhancement initiation error:', data.error);
            throw new Error(data.error);
          }
          setProcessId(data.processId);
          return;
        }

        let startTime = Date.now();
        console.log('🔵 [Client] Starting polling for processId:', processId);
        
        // Start polling for result
        const pollInterval = setInterval(async () => {
          try {
            // Check for timeout
            if (Date.now() - startTime > MAX_POLLING_TIME) {
              console.error('🔴 [Client] Process timed out');
              clearInterval(pollInterval);
              throw new Error('Enhancement process timed out. Please try again.');
            }

            const response = await fetch(`/api/enhance/status?processId=${processId}`);
            const data = await response.json();
            console.log('🔵 [Client] Poll response:', data);
            
            if (data.status === 'completed') {
              console.log('🟢 [Client] Enhancement completed:', data.result);
              clearInterval(pollInterval);
              localStorage.setItem('enhancedImage', data.result);
              router.replace('/result');
            } else if (data.status === 'processing') {
              setProgress(prev => Math.min(prev + 2, 95));
            } else if (data.status === 'error') {
              console.error('🔴 [Client] Enhancement error:', data.error);
              throw new Error(data.error || 'Enhancement failed');
            }
          } catch (err) {
            console.error('🔴 [Client] Polling error:', err);
            clearInterval(pollInterval);
            setError(err.message);
          }
        }, POLLING_INTERVAL);

        // Cleanup
        return () => {
          console.log('🔵 [Client] Cleaning up polling interval');
          clearInterval(pollInterval);
        };

      } catch (err) {
        console.error('🔴 [Client] Process error:', err);
        setError(err.message);
      }
    };

    processImage();
  }, [router, processId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error Processing Image</h2>
        <p className="mb-8">{error}</p>
        <Link 
          href="/capture"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
        >
          Try Again
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-8">Enhancing Your Photo</h2>
      <div className="w-64 h-2 bg-gray-700 rounded-full mb-4">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-gray-400">This may take up to a minute...</p>
    </div>
  );
}
