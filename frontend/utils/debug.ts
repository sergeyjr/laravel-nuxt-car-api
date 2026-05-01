export const isDebug = () => {
    try {
        return useRuntimeConfig()?.public?.debugApi === true
    } catch {
        return false
    }
}

const safeClone = (value: any) => {
    try {
        return JSON.parse(JSON.stringify(value))
    } catch {
        return value
    }
}

export const debugLog = (...args: any[]) => {
    if (!isDebug()) return

    console.log('[debug]', ...args.map(safeClone))
}

export const debugGroup = (label: string, fn: () => void) => {
    if (!isDebug()) return

    console.groupCollapsed(`[debug] ${label}`)
    try {
        fn()
    } finally {
        console.groupEnd()
    }
}
