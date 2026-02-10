# uhd-ai-camera

**Ultra HD AI Camera** – Mobile-first web app for capturing and enhancing photos with AI-powered upscaling and clarity.

---

## Features

### Photo capture
- **Live viewfinder** – Real-time camera stream via `getUserMedia()` (HTML5 video).
- **High-resolution capture** – Targets up to 1920×1080 for source images.
- **Front / rear camera** – Toggle between user and environment (mobile).
- **Fullscreen capture** – Optional fullscreen for a focused shooting experience.
- **Portrait mirroring** – Front camera preview is mirrored for natural framing.

### AI enhancement
- **Clarity Upscaler (Replicate)** – Cloud AI for detail enhancement and upscaling.
- **4× upscale** – Output resolution scaled up with sharpening and quality tuning.
- **Cinematic style** – Hollywood-style lighting and color grading (configurable prompt).
- **Async processing** – Non-blocking flow: capture → submit → poll status → view result.
- **Status API** – `GET /api/enhance/status?id=<predictionId>` for polling enhancement completion.

### User flow
1. **Landing** – Hero, before/after comparison placeholders, “Capture Your Moment” CTA.
2. **Sign in** – Required to access capture (Clerk).
3. **Capture** – Camera UI with capture button and camera switch.
4. **Processing** – Progress indicator while enhancement runs (polling every 2s).
5. **Result** – View enhanced image, **Download** (or **Share** on iOS), or **Take New Photo**.

### Authentication
- **Clerk** – Sign-in and sign-up (`/sign-in`, `/sign-up`).
- **Protected routes** – `/capture` and `/processing` require an authenticated user.
- **Public routes** – Landing (`/`), auth pages, and API routes as configured in middleware.

### Payments (Stripe)
- **Subscription checkout** – Stripe Checkout for subscription plans.
- **Pricing component** – Displays plans from Stripe (price, interval, description).
- **Success / cancel** – `/payment/success` and `/payment/cancel` for post-checkout.
- **API** – `POST /api/stripe/checkout` with `priceId` to create a session and redirect.

### Technical
- **Next.js 15** – App Router, React 19.
- **Tailwind CSS** – Styling and responsive layout.
- **API routes** – `POST /api/enhance` (submit image), `GET /api/enhance/status` (poll), Stripe routes.
- **Client state** – `localStorage` for `predictionId`, `originalImage`, and `enhancedImage` during the flow.
- **Mobile-focused** – Touch-friendly UI, `100dvh` height, no scroll on capture.

---

## Project structure

- **`ultra-hd-ai-camera-nextjs/`** – Next.js app (pages, components, API, Stripe, Clerk).
- **`Requirements/`** – PRD and Spec (product and technical).
- **`Documentation/`** – Clarity Upscaler, Clerk, Stripe, and troubleshooting notes.

---

## Getting started

From the Next.js app directory:

```bash
cd ultra-hd-ai-camera-nextjs
nvm use node
npm install
npm run dev
```

Set environment variables (see app and docs for exact names), including:
- **Clerk** – `NEXT_PUBLIC_CLERK_*`, `CLERK_SECRET_KEY`.
- **Replicate** – `REPLICATE_API_TOKEN` (Clarity Upscaler).
- **Stripe** – `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_*`, `NEXT_PUBLIC_APP_URL`.

---

## Planned / future

- User gallery and cloud storage (e.g. Vercel Blob).
- Advanced editing (sliders, AI filters).
- i18n and PWA (e.g. push notifications).
- Zoom controls (UI present, backend optional).
