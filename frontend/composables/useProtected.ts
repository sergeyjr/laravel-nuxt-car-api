export const useProtected = () => {

    debugLog('[useProtected] init')

    const protectedPages = [
        '/admin',
        '/cabinet',
        '/dashboard',
        '/orders',
        '/profile',
        '/settings',
    ]

    const locales = ['ru', 'en']

    /**
     * Убирает locale prefix из path
     *
     * /en/dashboard -> /dashboard
     * /dashboard -> /dashboard
     * /en -> /
     */
    const normalizePath = (path: string): string => {
        const parts = path.split('/').filter(Boolean)
        const locale = parts[0]
        if (locale && locales.includes(locale)) {
            const normalized = '/' + parts.slice(1).join('/')
            debugLog('[useProtected] normalized:', path, '->', normalized || '/',)
            return normalized || '/'
        }
        return path || '/'
    }

    const requiresAuth = (path: string): boolean => {
        const normalizedPath = normalizePath(path)
        const result = protectedPages.some(p => normalizedPath === p || normalizedPath.startsWith(p + '/'))
        debugLog('[useProtected] requiresAuth:', normalizedPath, result,)
        return result
    }

    return {
        requiresAuth,
        normalizePath,
    }

}
