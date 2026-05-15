export const useProtected = () => {

    const protectedPages = [
        '/admin',
        '/cabinet',
        '/dashboard',
        '/orders',
        '/profile',
        '/settings',
    ]

    const requiresAuth = (path: string) =>
        protectedPages.some(p => path === p || path.startsWith(p + '/'))

    return {requiresAuth}

}
