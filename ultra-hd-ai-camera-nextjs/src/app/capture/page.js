const response = await fetch('/api/enhance', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    image: imageUrl // URL or base64 string of the image
  })
});

const data = await response.json();
if (data.success) {
  const enhancedImageUrl = data.enhancedImage;
  // Use the enhanced image URL
}
