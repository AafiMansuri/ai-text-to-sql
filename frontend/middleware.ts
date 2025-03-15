import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';



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


  // Restricts auth users to /login
  if(userId && currentUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/chat",req.url))
  }

  // Restricts non-admin users to /admin(*) routes
  if(userId && currentUrl.pathname.startsWith('/admin')) {
    const user = (await clerkClient()).users.getUser(userId)
    const role = (await user).publicMetadata.role
    if (role !== "Admin" && role !== "SuperAdmin" ){
      return NextResponse.redirect(new URL("/chat", req.url));
    }
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