import { NextResponse } from 'next/server';
import Replicate from "replicate";

export async function POST(request) {
  try {
    const { image } = await request.json();
    
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Create prediction and return immediately
    const prediction = await replicate.predictions.create({
      version: "dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
      input: {
        image: image,
        scale_factor: 2,
        dynamic: 6,
        creativity: 0.35,
        resemblance: 0.6,
        output_format: "png"
      }
    });

    return NextResponse.json({
      success: true,
      predictionId: prediction.id
    });

  } catch (error) {
    console.error('Enhancement error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
