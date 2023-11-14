import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  const pathName = request.nextUrl.pathname;
  const cookieStore = cookies()

  const userId = cookieStore.get('userId');
  const token = cookieStore.get('token');
  console.log(userId, token)
  if(!userId || !token) {
    if(pathName != "/auth/login") {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } else {
    if(pathName == "/auth/login") {
      return NextResponse.redirect(new URL('/home', request.url))
    }
  }


}
 
// List private route
export const config = {
  matcher: ['/home', '/user/profile', '/auth/login'],
}