'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProcessingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const predictionId = localStorage.getItem('predictionId');
    if (!predictionId) {
      router.replace('/capture');
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/enhance/status?id=${predictionId}`);
        const data = await response.json();

        if (data.status === 'succeeded' && data.output) {
          localStorage.setItem('enhancedImage', data.output[0]);
          router.replace('/result');
        } else if (data.status === 'failed' || data.error) {
          throw new Error(data.error || 'Enhancement failed');
        } else {
          setProgress(prev => Math.min(prev + 1.58, 95));
        }
      } catch (err) {
        console.error('Status check error:', err);
        setError(err.message);
      }
    };

    const intervalId = setInterval(checkStatus, 2000);
    return () => clearInterval(intervalId);
  }, [router]);

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
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-400">This may take up to 2 minutes...</p>
    </div>
  );
}
