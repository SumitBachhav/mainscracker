import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // ✅ Define public routes
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/auth/callback", // Allow auth callback to process
    "/images/hero.jpg",
    "/images/features/analytics.png",
    "/images/features/evaluation.png",
    "/images/features/faculty.png",
    "/images/features/student_dashboard.png",
    "/email/invite.html",
    "/email/password-reset.html",
  ];

  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/blog") || // blogs are public
    pathname.startsWith("/images/");

  // ✅ Redirect unauthenticated users trying to access protected pages
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  if (
    pathname === "/login" &&
    request.nextUrl.searchParams.get("type") === "recovery"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/reset-password";
    return NextResponse.redirect(url);
  }

  // ✅ Prevent logged-in users from visiting auth pages
  if (user && ["/login", "/register"].includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // ✅ Role-based access control
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role ?? "student";

    // Skip redirect for home `/` and `/blog`
    if (pathname !== "/" && !pathname.startsWith("/blog")) {
      if (role === "student" && !pathname.startsWith("/student")) {
        const url = request.nextUrl.clone();
        url.pathname = "/student";
        return NextResponse.redirect(url);
      }

      if (role === "faculty" && !pathname.startsWith("/faculty")) {
        const url = request.nextUrl.clone();
        url.pathname = "/faculty";
        return NextResponse.redirect(url);
      }

      if (role === "admin" && !pathname.startsWith("/admin")) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
