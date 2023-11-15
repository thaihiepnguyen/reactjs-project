import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  const pathName = request.nextUrl.pathname;
  const cookieStore = cookies()

  const userId = cookieStore.get('userId');
  const token = cookieStore.get('token');
  let isLoggedIn = true;
  if(!userId || !token) {
      isLoggedIn = false;
  }
  switch(pathName){
    case '/home': return isLoggedIn ? null :  NextResponse.redirect(new URL('/', request.url))
    case '/user/profile': return isLoggedIn ? null :  NextResponse.redirect(new URL('/', request.url))
    case '/auth/login': return isLoggedIn ? NextResponse.redirect(new URL('/home', request.url)) : null
    case '/auth/register': return isLoggedIn ? NextResponse.redirect(new URL('/home', request.url)) : null
  }


}
 
// List private route
