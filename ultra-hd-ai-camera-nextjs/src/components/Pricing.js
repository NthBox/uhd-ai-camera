'use client';

import { useState } from 'react';
import { getStripe } from '@/utils/stripe';

export default function Pricing({ prices }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (priceId) => {
    try {
      setLoading(true);
      
      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });
      
      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Pricing Plans
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          Choose the perfect plan for your needs
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {prices?.map((price) => (
          <div
            key={price.id}
            className="rounded-lg shadow-lg overflow-hidden"
          >
            <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
              <div className="mt-4 flex justify-center text-6xl font-extrabold text-gray-900">
                <span className="ml-1 text-2xl font-medium text-gray-500">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: price.currency,
                  }).format(price.unit_amount / 100)}
                </span>
                <span className="ml-3 text-xl font-medium text-gray-500">
                  /{price.recurring?.interval}
                </span>
              </div>
              <p className="mt-5 text-lg text-gray-500">
                {price.product.description}
              </p>
            </div>
            <div className="px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6">
              <button
                onClick={() => handleSubscribe(price.id)}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Processing...' : 'Subscribe'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 