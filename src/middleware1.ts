// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const atk = req.cookies.get("atk")?.value;

  const protectedRoutes = ["/analyzer", "/profile", "/account"]; // <-- add yours

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // If route is protected & no access token → attempt refresh
  if (isProtected && !atk) {
    try {
      console.log("refresh req run");
      
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh_token`,
        {
          method: "POST",
          credentials: "include", // send refresh token cookie
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await refreshRes.json();
      console.log(data);
      
      // If refresh fails → redirect to signin
      if (!data.success || !data.accessToken) {
        const url = req.nextUrl.clone();
        url.pathname = "/signin";
        return NextResponse.redirect(url);
      }

      // Refresh successful → set new access token & proceed
      const res = NextResponse.next();
      res.cookies.set("atk", data.accessToken, {
        httpOnly: false,
        maxAge: 60 * 60 * 24,
      });

      return res;
    } catch (err) {
      console.error("Refresh failed in middleware:", err);
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/analyzer/:path*",
    "/profile/:path*",
    "/account/:path*",
  ],
};
