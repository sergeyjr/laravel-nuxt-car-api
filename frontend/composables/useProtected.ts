export const useProtected = () => {

    const protectedPages = [
        '/admin',
        '/cabinet',
        '/dashboard',
        '/orders',
        '/profile',
        '/settings',
    ];

    const locales: any = ['ru', 'en']

    const requiresAuth = (path: string): boolean => {
        if (!locales) {
            return protectedPages.some(p => path === p || path.startsWith(p + '/'))
        }
        const parts = path.split('/').filter(Boolean)
        if (parts.length > 0 && locales.includes(parts[0])) {
            const normalizedPath = '/' + parts.slice(1).join('/')
            return protectedPages.some(p => normalizedPath === p || normalizedPath.startsWith(p + '/'))
        }
        return protectedPages.some(p => path === p || path.startsWith(p + '/'))
    }

    return {requiresAuth}

}
