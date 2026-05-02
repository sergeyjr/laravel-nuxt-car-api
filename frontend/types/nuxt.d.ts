import type { $Fetch } from 'ofetch'

declare module '#app' {
    interface NuxtApp {
        $api: $Fetch
        $apiV1: $Fetch
    }
}
