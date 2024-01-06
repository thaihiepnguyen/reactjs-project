import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { useAppSelector } from "./redux/hook";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const cookieStore = cookies();
  let isStudent = false;
  let isAdmin = false;
  let isTeacher = false;

  const userId = cookieStore.get("userId");
  const token = cookieStore.get("token");
  let role = cookieStore.get("role");

  let isLoggedIn = true;
  if (!userId || !token) {
    isLoggedIn = false;
  }

  if (role?.value) {
    role = JSON.parse(role.value);
  }
  switch (role?.name) {
    case "admin":
      isAdmin = true;
      break;
    case "teacher":
      isTeacher = true;
      break;
    case "student":
      isStudent = true;
      break;
    default:
      isLoggedIn = false;
  }

  if (pathName.startsWith("/home") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/?redirect=true", request.url));
  }
  if (pathName.startsWith("/course") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/?redirect=true", request.url));
  }
  if (pathName.startsWith("/home") &&  isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  
  if (pathName.startsWith("/user") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathName.startsWith("/auth") && isLoggedIn) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (pathName.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/home", request.url));
  }
}

// List private route
