source: https://replicate.com/philz1337x/clarity-upscaler
api documentation: https://replicate.com/philz1337x/clarity-upscaler/api

example
```nodejs
import Replicate from "replicate";
const replicate = new Replicate();

const input = {
    image: "https://replicate.delivery/pbxt/KiDB5iqtTcxiTI17WASotG1Ei0TNJCztdU6J02pnMYAd8B1X/13_before-4.png"
};

const output = await replicate.run("philz1337x/clarity-upscaler:dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e", { input });

import { writeFile } from "node:fs/promises";
for (const [index, item] of Object.entries(output)) {
  await writeFile(`output_${index}.png`, item);
}
//=> output_0.png written to disk

```

```input schema
{
  "type": "object",
  "title": "Input",
  "required": [
    "image"
  ],
  "properties": {
    "mask": {
      "type": "string",
      "title": "Mask",
      "format": "uri",
      "x-order": 18,
      "description": "Mask image to mark areas that should be preserved during upscaling"
    },
    "seed": {
      "type": "integer",
      "title": "Seed",
      "default": 1337,
      "x-order": 12,
      "description": "Random seed. Leave blank to randomize the seed"
    },
    "image": {
      "type": "string",
      "title": "Image",
      "format": "uri",
      "x-order": 0,
      "description": "input image"
    },
    "prompt": {
      "type": "string",
      "title": "Prompt",
      "default": "masterpiece, best quality, highres, <lora:more_details:0.5> <lora:SDXLrender_v2.0:1>",
      "x-order": 1,
      "description": "Prompt"
    },
    "dynamic": {
      "type": "number",
      "title": "Dynamic",
      "default": 6,
      "maximum": 50,
      "minimum": 1,
      "x-order": 4,
      "description": "HDR, try from 3 - 9"
    },
    "handfix": {
      "enum": [
        "disabled",
        "hands_only",
        "image_and_hands"
      ],
      "type": "string",
      "title": "handfix",
      "description": "Use clarity to fix hands in the image",
      "default": "disabled",
      "x-order": 19
    },
    "pattern": {
      "type": "boolean",
      "title": "Pattern",
      "default": false,
      "x-order": 20,
      "description": "Upscale a pattern with seamless tiling"
    },
    "sharpen": {
      "type": "number",
      "title": "Sharpen",
      "default": 0,
      "maximum": 10,
      "minimum": 0,
      "x-order": 17,
      "description": "Sharpen the image after upscaling. The higher the value, the more sharpening is applied. 0 for no sharpening"
    },
    "sd_model": {
      "enum": [
        "epicrealism_naturalSinRC1VAE.safetensors [84d76a0328]",
        "juggernaut_reborn.safetensors [338b85bc4f]",
        "flat2DAnimerge_v45Sharp.safetensors"
      ],
      "type": "string",
      "title": "sd_model",
      "description": "Stable Diffusion model checkpoint",
      "default": "juggernaut_reborn.safetensors [338b85bc4f]",
      "x-order": 9
    },
    "scheduler": {
      "enum": [
        "DPM++ 2M Karras",
        "DPM++ SDE Karras",
        "DPM++ 2M SDE Exponential",
        "DPM++ 2M SDE Karras",
        "Euler a",
        "Euler",
        "LMS",
        "Heun",
        "DPM2",
        "DPM2 a",
        "DPM++ 2S a",
        "DPM++ 2M",
        "DPM++ SDE",
        "DPM++ 2M SDE",
        "DPM++ 2M SDE Heun",
        "DPM++ 2M SDE Heun Karras",
        "DPM++ 2M SDE Heun Exponential",
        "DPM++ 3M SDE",
        "DPM++ 3M SDE Karras",
        "DPM++ 3M SDE Exponential",
        "DPM fast",
        "DPM adaptive",
        "LMS Karras",
        "DPM2 Karras",
        "DPM2 a Karras",
        "DPM++ 2S a Karras",
        "Restart",
        "DDIM",
        "PLMS",
        "UniPC"
      ],
      "type": "string",
      "title": "scheduler",
      "description": "scheduler",
      "default": "DPM++ 3M SDE Karras",
      "x-order": 10
    },
    "creativity": {
      "type": "number",
      "title": "Creativity",
      "default": 0.35,
      "maximum": 1,
      "minimum": 0,
      "x-order": 5,
      "description": "Creativity, try from 0.3 - 0.9"
    },
    "lora_links": {
      "type": "string",
      "title": "Lora Links",
      "default": "",
      "x-order": 15,
      "description": "Link to a lora file you want to use in your upscaling. Multiple links possible, seperated by comma"
    },
    "downscaling": {
      "type": "boolean",
      "title": "Downscaling",
      "default": false,
      "x-order": 13,
      "description": "Downscale the image before upscaling. Can improve quality and speed for images with high resolution but lower quality"
    },
    "resemblance": {
      "type": "number",
      "title": "Resemblance",
      "default": 0.6,
      "maximum": 3,
      "minimum": 0,
      "x-order": 6,
      "description": "Resemblance, try from 0.3 - 1.6"
    },
    "scale_factor": {
      "type": "number",
      "title": "Scale Factor",
      "default": 2,
      "x-order": 3,
      "description": "Scale factor"
    },
    "tiling_width": {
      "enum": [
        16,
        32,
        48,
        64,
        80,
        96,
        112,
        128,
        144,
        160,
        176,
        192,
        208,
        224,
        240,
        256
      ],
      "type": "integer",
      "title": "tiling_width",
      "description": "Fractality, set lower tile width for a high Fractality",
      "default": 112,
      "x-order": 7
    },
    "output_format": {
      "enum": [
        "webp",
        "jpg",
        "png"
      ],
      "type": "string",
      "title": "output_format",
      "description": "Format of the output images",
      "default": "png",
      "x-order": 21
    },
    "tiling_height": {
      "enum": [
        16,
        32,
        48,
        64,
        80,
        96,
        112,
        128,
        144,
        160,
        176,
        192,
        208,
        224,
        240,
        256
      ],
      "type": "integer",
      "title": "tiling_height",
      "description": "Fractality, set lower tile height for a high Fractality",
      "default": 144,
      "x-order": 8
    },
    "custom_sd_model": {
      "type": "string",
      "title": "Custom Sd Model",
      "default": "",
      "x-order": 16
    },
    "negative_prompt": {
      "type": "string",
      "title": "Negative Prompt",
      "default": "(worst quality, low quality, normal quality:2) JuggernautNegative-neg",
      "x-order": 2,
      "description": "Negative Prompt"
    },
    "num_inference_steps": {
      "type": "integer",
      "title": "Num Inference Steps",
      "default": 18,
      "maximum": 100,
      "minimum": 1,
      "x-order": 11,
      "description": "Number of denoising steps"
    },
    "downscaling_resolution": {
      "type": "integer",
      "title": "Downscaling Resolution",
      "default": 768,
      "x-order": 14,
      "description": "Downscaling resolution"
    }
  }
}
```

```output schema
{
  "type": "array",
  "items": {
    "type": "string",
    "format": "uri"
  },
  "title": "Output"
}
```