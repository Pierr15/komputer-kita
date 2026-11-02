import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const roleRoutes = [
  { prefix: "/owner", role: "owner" },
  { prefix: "/employee", role: "employee" },
  { prefix: "/account", role: "buyer" },
] as const;

const defaultRouteByRole: Record<string, string> = {
  owner: "/owner",
  employee: "/employee",
  buyer: "/account",
};

export async function proxy(request: NextRequest) {
  const route = roleRoutes.find(({ prefix }) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  if (!route) return NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  if (profile.role !== route.role) {
    const fallback = defaultRouteByRole[profile.role] ?? "/login";
    const destination = request.nextUrl.clone();
    destination.pathname = fallback;
    destination.search = "";
    return NextResponse.redirect(destination);
  }

  return response;
}

export const config = {
  matcher: ["/owner/:path*", "/employee/:path*", "/account/:path*"],
};
