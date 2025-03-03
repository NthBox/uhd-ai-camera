import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  debug: process.env.NODE_ENV === 'development',
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/(api|trpc)(.*)'
  ]
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', // exclude static files
    '/(api|trpc)(.*)' // include API routes
  ],
}; 