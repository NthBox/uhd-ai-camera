import Replicate from "replicate";

// Initialize global processes Map
if (!global.processes) {
  global.processes = new Map();
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { image } = data;

    console.log('🔵 [Server] Clarity API Request Started:', {
      timestamp: new Date().toISOString(),
      imageDataLength: image?.length || 0,
    });

    if (!image) {
      console.error('🔴 [Server] Error: No image provided');
      return new Response(JSON.stringify({ error: 'No image provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const processId = Date.now().toString();
    console.log('🔵 [Server] Process Created:', { processId });
    
    // Store initial process state
    global.processes.set(processId, {
      status: 'processing',
      progress: 0,
    });

    // Start the processing with proper error handling
    try {
      console.log('🔵 [Server] Calling Clarity API with params:', {
        processId,
        scale_factor: 2,
        prompt: "masterpiece, best quality, highres, <lora:more_details:0.5>",
      });

      const prediction = await replicate.run(
        "philz1337x/clarity-upscaler:dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
        {
          input: {
            image: image,
            scale_factor: 2,
            prompt: "masterpiece, best quality, highres, <lora:more_details:0.5>",
            negative_prompt: "(worst quality, low quality, normal quality:2)",
            dynamic: 6,
            creativity: 0.35,
            resemblance: 0.6,
            output_format: "png",
            scheduler: "DPM++ 3M SDE Karras",
            num_inference_steps: 18,
          },
        }
      );

      console.log('🟢 [Server] Clarity API Response:', {
        processId,
        prediction,
        timestamp: new Date().toISOString()
      });

      // The API returns an array of image URLs
      if (Array.isArray(prediction) && prediction.length > 0) {
        global.processes.set(processId, {
          status: 'completed',
          result: prediction[0],
          timestamp: new Date().toISOString()
        });
        console.log('🟢 [Server] Process Completed:', { processId, resultUrl: prediction[0] });
      } else {
        throw new Error('Invalid response format from Clarity API');
      }
    } catch (error) {
      console.error('🔴 [Server] Clarity API Error:', {
        processId,
        error: error.message,
        stack: error.stack
      });
      global.processes.set(processId, {
        status: 'error',
        error: error.message || 'Failed to enhance image',
        timestamp: new Date().toISOString()
      });
    }

    // Return the process ID immediately for client polling
    return new Response(JSON.stringify({ 
      processId,
      message: 'Image enhancement started'
    }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('🔴 [Server] Request Error:', {
      error: error.message,
      stack: error.stack
    });
    return new Response(JSON.stringify({ 
      error: 'Failed to process request',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const processId = searchParams.get('processId');

  console.log('🔵 [Server] Status Check:', { processId });

  if (!processId || !global.processes?.has(processId)) {
    console.log('🔴 [Server] Invalid Process ID:', { processId });
    return new Response(JSON.stringify({ 
      error: 'Invalid or expired process ID'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const process = global.processes.get(processId);
  console.log('🔵 [Server] Process Status:', { processId, status: process.status });
  
  // Clean up completed or errored processes after a delay
  if (process.status === 'completed' || process.status === 'error') {
    setTimeout(() => {
      global.processes.delete(processId);
      console.log('🔵 [Server] Process Cleaned Up:', { processId });
    }, 5000);
  }

  return new Response(JSON.stringify({
    ...process,
    message: process.status === 'processing' ? 'Enhancement in progress' : undefined
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}