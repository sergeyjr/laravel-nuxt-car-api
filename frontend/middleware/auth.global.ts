import {protectedPages} from '~/utils/protected-pages'

export default defineNuxtRouteMiddleware(async (to) => {

    const auth = useAuthStore()

    console.log('[auth-middleware] START', {path: to.path})

    // Восстанавливаем auth на любой странице после F5
    if (!auth.initialized) {
        console.log('[auth-middleware] initAuth() START')
        await auth.initAuth()
        console.log('[auth-middleware] initAuth() DONE', {
            initialized: auth.initialized,
            isAuth: auth.isAuth,
            user: auth.user
        })
    }

    const requiresAuth = protectedPages.some((page) => {
        const match = to.path === page || to.path.startsWith(page + '/')
        if (match) {
            console.log('[auth-middleware] MATCH protected page', page)
        }
        return match
    })

    console.log('[auth-middleware] requiresAuth', requiresAuth)
    console.log('[auth-middleware] initialized', auth.initialized)
    console.log('[auth-middleware] isAuth', auth.isAuth)

    if (!requiresAuth) {
        // Чтобы уже авторизованного пользователя не оставлять на /login после F5
        if (to.path === '/login' && auth.isAuth) {
            console.log('[auth-middleware] REDIRECT /login -> /dashboard')
            return navigateTo('/dashboard')
        }

        console.log('[auth-middleware] SKIP (public route)')
        return
    }

    if (!auth.isAuth) {
        console.log('[auth-middleware] REDIRECT -> /login')
        return navigateTo('/login')
    }

    console.log('[auth-middleware] ALLOW access')

})
