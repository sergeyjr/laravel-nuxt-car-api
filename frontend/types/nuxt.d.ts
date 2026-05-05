import type { $Fetch } from 'ofetch'

declare module '#app' {
    interface NuxtApp {
        $backend: $Fetch
        $api: $Fetch
        $apiV1: $Fetch
    }
}
