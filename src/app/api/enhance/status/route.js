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

    return NextResponse.json({
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
    });

  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Failed to check enhancement status" },
      { status: 500 }
    );
  }
} 