import { NextResponse } from 'next/server';
import Replicate from "replicate";

export async function POST(request) {
  try {
    const { image } = await request.json();
    
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    console.log('Input image URL:', image);

    // Create prediction
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

    console.log('Prediction created:', prediction);

    // Wait for the prediction to complete
    let finalPrediction = await replicate.predictions.get(prediction.id);
    while (finalPrediction.status !== 'succeeded' && finalPrediction.status !== 'failed') {
      console.log('Waiting for prediction...', finalPrediction.status);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      finalPrediction = await replicate.predictions.get(prediction.id);
    }

    console.log('Final prediction:', finalPrediction);

    if (finalPrediction.status === 'succeeded') {
      const enhancedImageUrl = finalPrediction.output[0];
      console.log('Enhanced image URL:', enhancedImageUrl);

      return NextResponse.json({
        success: true,
        enhancedImage: enhancedImageUrl
      });
    }

    throw new Error(finalPrediction.error || 'Prediction failed');

  } catch (error) {
    console.error('Enhancement error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
