export const useProtected = () => {

    const protectedPages = [
        '/dashboard',
        '/profile',
        '/settings',
        '/orders',
        '/cabinet',
        '/admin'
    ]

    const requiresAuth = (path: string) =>
        protectedPages.some(p => path === p || path.startsWith(p + '/'))

    return {requiresAuth}

}
