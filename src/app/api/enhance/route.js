import { NextResponse } from 'next/server';
import Replicate from "replicate";

export const runtime = 'edge';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Configure enhancement parameters based on PRD requirements
    const input = {
      image,
      scale_factor: 2,
      prompt: "masterpiece, best quality, highres, <lora:more_details:0.5>",
      negative_prompt: "(worst quality, low quality, normal quality:2)",
      dynamic: 6,
      creativity: 0.35,
      resemblance: 0.6,
      output_format: "png",
      scheduler: "DPM++ 3M SDE Karras",
      num_inference_steps: 18,
    };

    const output = await replicate.run(
      "philz1337x/clarity-upscaler:dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
      { input }
    );

    return NextResponse.json({ 
      success: true,
      enhancedImage: output[0]
    });

  } catch (error) {
    console.error('Enhancement error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance image' },
      { status: 500 }
    );
  }
}