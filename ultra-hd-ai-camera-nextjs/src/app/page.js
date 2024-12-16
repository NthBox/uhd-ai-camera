import Link from 'next/link'

export default function Home() {
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

        <Link 
          href="/capture"
          className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Capture Your Moment
        </Link>
      </div>
    </main>
  )
}
