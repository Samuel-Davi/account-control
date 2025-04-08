import { MiddlewareConfig, NextRequest, NextResponse } from "next/server"
import { get } from '@vercel/edge-config'

const publicRoutes = [
    {path: '/register', whenAuthenticated: 'redirect'},
    {path: '/', whenAuthenticated: 'redirect'},
    {path: '/forgot-password', whenAuthenticated: 'redirect'},
    {path: '/reset-password', whenAuthenticated: 'redirect'}
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/'

export const config: MiddlewareConfig = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico, sitemap.xml, robots.txt (metadata files)
        */
        '/((?!api|_next/static|_next/image|favicon2.png|sitemap.xml|robots.txt).*)',
    ],
}

export async function middleware(request: NextRequest){
    const path = request.nextUrl.pathname
    const publicRoute = publicRoutes.find(route => route.path === path)
    const authToken = request.cookies.get('account_token')

    const isMaintenanceMode = await get('maintenance')
    console.log(isMaintenanceMode)
    

    if(isMaintenanceMode){
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = `/maintenance`

        return NextResponse.rewrite(redirectUrl)
    }

    if(!authToken && publicRoute){
        return NextResponse.next()    
    }

    if(!authToken && !publicRoute){
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

        return NextResponse.redirect(redirectUrl)
    }

    if(authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect'){
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/dashboard'

        return NextResponse.redirect(redirectUrl)
    }

    if(authToken && !publicRoute){
        //verificar JWT
    }

    return NextResponse.next()
}