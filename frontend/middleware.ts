import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import { use } from 'react';

const isPublicRoute = createRouteMatcher([
  "/login"
])

const isProtectedRoute = createRouteMatcher([
  "/chat(.*)",
  "/admin(.*)",
])

export default clerkMiddleware(async(auth,req) => {
  const {userId} = await auth();
  const currentUrl = new URL(req.url)

  if(userId && currentUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/chat",req.url))
  } 
  
  if(isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}