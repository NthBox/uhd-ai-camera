# Stripe Implementation - Debug & Troubleshooting Documentation

## Issue: Stripe Payment Integration Implementation

**Date:** Current implementation on branch `feature-v01x15/stripe-implement`  
**Status:** Implementation in progress

---

## Implementation Overview

### Components Implemented
1. **API Routes:**
   - `/api/stripe/checkout` - Creates Stripe Checkout sessions for subscriptions
   - `/api/stripe/config` - Fetches active pricing plans from Stripe

2. **Client-Side Components:**
   - `Pricing.js` - Displays pricing plans and handles subscription initiation
   - `utils/stripe.js` - Client-side Stripe initialization utility

3. **Pages:**
   - `/payment/success` - Success page after payment completion
   - `/payment/cancel` - Cancellation page

---

## Debug Methods Used

### 1. Environment Variable Verification
- **Issue:** Stripe API keys not properly configured
- **Debug Method:** 
  - Checked `process.env.STRIPE_SECRET_KEY` in server-side routes
  - Verified `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in client-side code
  - Confirmed `process.env.NEXT_PUBLIC_APP_URL` for redirect URLs
- **Solution:** Ensure all environment variables are set in Vercel environment configuration

### 2. API Route Error Handling
- **Issue:** Unhandled errors in checkout session creation
- **Debug Method:**
  - Added try-catch blocks in API routes
  - Implemented console.error logging for debugging
  - Returned proper HTTP status codes (500 for errors)
- **Solution:** Comprehensive error handling with user-friendly error messages

### 3. Client-Side Stripe Initialization
- **Issue:** Multiple Stripe instances being created
- **Debug Method:**
  - Implemented singleton pattern in `getStripe()` utility
  - Ensured Stripe promise is cached and reused
- **Solution:** Single Stripe instance pattern prevents memory leaks and initialization issues

### 4. Checkout Session Redirect
- **Issue:** Redirect URLs not properly formatted
- **Debug Method:**
  - Verified `success_url` and `cancel_url` format
  - Ensured `{CHECKOUT_SESSION_ID}` placeholder is correctly used
  - Tested URL construction with environment variables
- **Solution:** Proper URL formatting with environment-based base URL

---

## Troubleshooting Methods

### Common Issues and Solutions

#### Issue 1: "Stripe is not defined" or Import Errors
**Symptoms:**
- Client-side errors when trying to use Stripe
- Module not found errors

**Troubleshooting Steps:**
1. Verify Stripe packages are installed:
   ```bash
   npm install stripe @stripe/stripe-js
   ```
2. Check import statements:
   - Server-side: `import Stripe from 'stripe'`
   - Client-side: `import { loadStripe } from '@stripe/stripe-js'`
3. Ensure package.json includes both dependencies

**Solution:**
- Install missing packages
- Verify import paths match package exports

#### Issue 2: Checkout Session Creation Fails
**Symptoms:**
- 500 errors from `/api/stripe/checkout`
- "Error creating checkout session" message

**Troubleshooting Steps:**
1. Check Stripe secret key is valid and has correct permissions
2. Verify `priceId` is being sent correctly from client
3. Check Stripe dashboard for API errors
4. Verify environment variables are loaded correctly

**Solution:**
- Use Stripe test keys for development
- Validate priceId format matches Stripe price IDs
- Check Stripe dashboard logs for detailed error messages

#### Issue 3: Redirect Not Working After Payment
**Symptoms:**
- User completes payment but doesn't redirect
- Stuck on Stripe checkout page

**Troubleshooting Steps:**
1. Verify `NEXT_PUBLIC_APP_URL` is set correctly
2. Check success/cancel URLs are accessible
3. Ensure URLs use HTTPS in production
4. Verify `{CHECKOUT_SESSION_ID}` placeholder is not replaced manually

**Solution:**
- Set proper environment variables for each environment
- Use absolute URLs for redirects
- Test redirect URLs are accessible

#### Issue 4: Pricing Data Not Loading
**Symptoms:**
- Pricing component shows no plans
- API returns empty array

**Troubleshooting Steps:**
1. Check `/api/stripe/config` endpoint returns data
2. Verify Stripe has active prices configured
3. Check API key has permissions to list prices
4. Verify product expansion is working (`expand: ['data.product']`)

**Solution:**
- Create test prices in Stripe dashboard
- Ensure prices are marked as active
- Verify API key permissions include `prices:read`

---

## Approaches That Worked

### 1. Server-Side API Routes Pattern
- **Approach:** Using Next.js API routes for server-side Stripe operations
- **Why It Works:** Keeps secret keys secure on server, prevents client-side exposure
- **Implementation:**
  ```javascript
  // Server-side only
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  ```

### 2. Client-Side Stripe Singleton
- **Approach:** Caching Stripe promise to prevent multiple initializations
- **Why It Works:** Reduces initialization overhead and prevents conflicts
- **Implementation:**
  ```javascript
  let stripePromise;
  export const getStripe = () => {
    if (!stripePromise) {
      stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    }
    return stripePromise;
  };
  ```

### 3. Checkout Session Flow
- **Approach:** Create session server-side, redirect client-side
- **Why It Works:** Secure session creation with proper error handling
- **Flow:**
  1. Client requests checkout session with priceId
  2. Server creates Stripe checkout session
  3. Client redirects to Stripe hosted checkout
  4. Stripe redirects back to success/cancel URLs

### 4. Error Handling Strategy
- **Approach:** Try-catch blocks with proper error responses
- **Why It Works:** Prevents unhandled errors and provides user feedback
- **Implementation:**
  ```javascript
  try {
    // Stripe operation
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'User-friendly message' }, { status: 500 });
  }
  ```

---

## Prevention Strategies

### To Prevent Future Issues:

1. **Environment Variable Management**
   - Document all required environment variables
   - Use different keys for test/production
   - Never commit keys to version control
   - Use Vercel environment variable management

2. **Package Dependency Management**
   - Keep Stripe packages up to date
   - Document required versions in package.json
   - Test after package updates

3. **Error Logging**
   - Implement proper logging for production
   - Use structured logging for easier debugging
   - Monitor Stripe dashboard for API errors

4. **Testing Strategy**
   - Test with Stripe test mode first
   - Use Stripe test cards for validation
   - Test all payment flows before production

5. **Documentation**
   - Keep API route documentation updated
   - Document environment variable requirements
   - Maintain troubleshooting guide

---

## Notes and Reminders

### Important Configuration Requirements:
- **Required Environment Variables:**
  - `STRIPE_SECRET_KEY` - Server-side Stripe secret key
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Client-side publishable key
  - `NEXT_PUBLIC_APP_URL` - Base URL for redirects

- **Required Stripe Setup:**
  - Create products in Stripe dashboard
  - Create prices for each product
  - Configure webhook endpoints (if needed)
  - Set up test mode for development

- **Security Considerations:**
  - Never expose secret keys to client
  - Use HTTPS in production
  - Validate all inputs server-side
  - Implement rate limiting for API routes

### Future Enhancements:
- Webhook handling for payment confirmations
- Subscription management UI
- Payment method management
- Invoice generation and history
- Refund processing

---

## References
- Official Stripe Documentation: https://docs.stripe.com/
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Stripe Checkout Sessions: https://docs.stripe.com/api/checkout/sessions

