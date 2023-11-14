import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  const cookieStore = cookies()

  const userId = cookieStore.get('userId');
  const token = cookieStore.get('token');
  console.log(userId, token)
  if(!userId || !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

}
 
// List private route
export const config = {
  matcher: ['/home', '/user/profile'],
}