import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./infrastructure/supabase/middleware";

export async function proxy(request: NextRequest) {
  // 1. Refresh/Sync Supabase session cookies
  const response = await updateSession(request);

  // 2. Base Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Custom Content-Security-Policy:
  // - connect-src allows local requests and Supabase database requests.
  // - img-src allows local images, inline data, and Leaflet OpenStreetMap tiles.
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.tile.openstreetmap.org; connect-src 'self' https://*.supabase.co;"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _not-found
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_not-found|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
