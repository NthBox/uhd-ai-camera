export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const processId = searchParams.get('processId');

  if (!processId || !global.processes?.has(processId)) {
    return new Response(JSON.stringify({ error: 'Invalid process ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const process = global.processes.get(processId);
  
  // Clean up completed or errored processes after sending response
  if (process.status === 'completed' || process.status === 'error') {
    setTimeout(() => global.processes.delete(processId), 1000);
  }

  return new Response(JSON.stringify(process), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
} 