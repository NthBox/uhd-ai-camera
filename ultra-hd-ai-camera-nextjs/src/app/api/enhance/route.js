import { NextResponse } from 'next/server';
import Replicate from "replicate";

export async function POST(request) {
  try {
    const { image } = await request.json();
    
    // Initialize Replicate with your API token
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN, // Make sure to add this to your .env file
    });

    // Call the Clarity Upscaler model
    const output = await replicate.run(
      "philz1337x/clarity-upscaler:dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
      {
        input: {
          image: image,
          scale_factor: 2,
          dynamic: 6,
          creativity: 0.35,
          resemblance: 0.6,
        }
      }
    );

    return NextResponse.json({
      success: true,
      enhancedImage: output[0] // The API returns an array of image URLs
    });

  } catch (error) {
    console.error('Enhancement error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
