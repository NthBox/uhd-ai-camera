import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  debug: process.env.NODE_ENV === 'development',
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/(api|trpc)(.*)'
  ],
  // Add protected routes that require authentication
  protectedRoutes: [
    '/capture(.*)',
    '/processing(.*)'
  ]
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', // exclude static files
    '/(api|trpc)(.*)', // include API routes
    '/capture(.*)', // explicitly include capture route
    '/processing(.*)' // include processing route
  ],
}; 