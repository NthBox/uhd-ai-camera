'use client';

import Link from 'next/link'
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  // Add error handling for Clerk initialization
  const { userId, isLoaded } = useAuth();

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mt-12">
          Ultra HD AI Camera
        </h1>
        
        <p className="text-center text-gray-600">
          Capture stunning photos enhanced by AI technology
        </p>

        {/* Before/After Comparison */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] bg-gray-100 rounded-lg">
            {/* Add demo images here */}
            <p className="absolute bottom-2 left-2 text-sm">Before</p>
          </div>
          <div className="relative aspect-[4/3] bg-gray-100 rounded-lg">
            {/* Add demo images here */}
            <p className="absolute bottom-2 left-2 text-sm">After</p>
          </div>
        </div>

        {isLoaded ? (
          <Link 
            href={userId ? "/capture" : "/sign-in"}
            className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {userId ? "Capture Your Moment" : "Sign in to Start"}
          </Link>
        ) : (
          <div className="block w-full py-3 px-4 bg-gray-400 text-white text-center rounded-lg font-medium">
            Loading...
          </div>
        )}
      </div>
    </main>
  )
}
