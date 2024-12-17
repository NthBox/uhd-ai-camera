import Replicate from "replicate";
import { NextResponse } from "next/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get("id");

    if (!predictionId) {
      return NextResponse.json(
        { error: "Prediction ID is required" },
        { status: 400 }
      );
    }

    const prediction = await replicate.predictions.get(predictionId);

    if (prediction.error) {
      return NextResponse.json(
        { status: 'failed', error: prediction.error },
        { status: 500 }
      );
    }

    if (prediction.status === 'succeeded') {
      return NextResponse.json({
        status: 'succeeded',
        output: prediction.output
      });
    }

    return NextResponse.json({
      status: prediction.status
    });

  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { status: 'failed', error: "Failed to check enhancement status" },
      { status: 500 }
    );
  }
} 