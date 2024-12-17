import { NextResponse } from 'next/server';
import Replicate from "replicate";

export async function POST(request) {
  try {
    const { image } = await request.json();
    
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Create prediction with expanded configuration options
    const prediction = await replicate.predictions.create({
      version: "dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
      input: {
        image: image,
        prompt: "masterpiece, best quality, highres, <lora:more_details:0.5> <lora:SDXLrender_v2.0:1>, red camera quality, red camera lens, red camera sensor, red camera, hollywood cinematic lighting, blockbuster movie color grading",
        negative_prompt: "(worst quality, low quality, normal quality:2) JuggernautNegative-neg",
        scale_factor: 4,
        dynamic: 9,
        creativity: 0.1,
        resemblance: 1,
        tiling_width: 112,
        tiling_height: 144,
        sd_model: "juggernaut_reborn.safetensors [338b85bc4f]",
        scheduler: "DPM++ 3M SDE Karras",
        num_inference_steps: 18,
        seed: 1337,
        downscaling: false,
        downscaling_resolution: 768,
        lora_links: "",
        custom_sd_model: "",
        sharpen: 2.5,
        mask: undefined,
        handfix: "disabled",
        pattern: false,
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
