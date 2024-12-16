'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ResultPage() {
  const router = useRouter();
  const [enhancedImageUrl, setEnhancedImageUrl] = useState('');

  useEffect(() => {
    const url = localStorage.getItem('enhancedImage');
    if (!url) {
      router.replace('/capture');
      return;
    }
    setEnhancedImageUrl(url);
  }, [router]);

  const handleDownload = async () => {
    try {
      const response = await fetch(enhancedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'enhanced-photo.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download image');
    }
  };

  const handleRetake = () => {
    localStorage.removeItem('enhancedImage');
    router.push('/capture');
  };

  if (!enhancedImageUrl) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-4">
        <h1 className="text-2xl font-bold">Enhanced Photo</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="relative aspect-[3/4] w-full mb-8">
            <Image
              src={enhancedImageUrl}
              alt="Enhanced photo"
              fill
              className="rounded-lg object-contain"
            />
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleDownload}
              className="bg-blue-600 px-6 py-3 rounded-lg font-semibold"
            >
              Download
            </button>
            <button
              onClick={handleRetake}
              className="bg-gray-700 px-6 py-3 rounded-lg font-semibold"
            >
              Take New Photo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 