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
      console.log("Missing prediction ID");
      return NextResponse.json(
        { error: "Prediction ID is required" },
        { status: 400 }
      );
    }

    console.log(`Checking status for prediction: ${predictionId}`);
    const prediction = await replicate.predictions.get(predictionId);
    console.log(`Status response:`, prediction);

    if (prediction.error) {
      console.error("Prediction error:", prediction.error);
      return NextResponse.json(
        { status: 'failed', error: prediction.error },
        { status: 500 }
      );
    }

    if (prediction.status === 'succeeded') {
      console.log("Enhancement succeeded:", prediction.output);
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