'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="p-4">
        <h1 className="text-2xl font-bold">Ultra HD AI Camera</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Transform Your Photos with AI</h2>
          <p className="text-xl mb-8">Experience unparalleled clarity and detail with our AI-powered photo enhancement</p>
          
          <Link 
            href="/capture"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
          >
            Capture Your Moment
          </Link>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Before UHD AI Camera</h3>
            {/* Add demo image */}
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">After UHD AI Camera</h3>
            {/* Add enhanced demo image */}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Ultra HD Quality</h3>
              <p>Crystal clear images with exceptional detail</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">AI Enhancement</h3>
              <p>Advanced AI algorithms for perfect photos</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Instant Processing</h3>
              <p>Quick enhancement with cloud processing</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
