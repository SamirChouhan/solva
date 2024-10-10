import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { protectedRoutes } from './utils/PrivateRoute'

// 1. Specify protected and public routes

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)

  const cookie = cookies().get('token')

  if (!cookie && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
