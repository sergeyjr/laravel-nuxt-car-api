// import type {FetchResponse, FetchRequest} from 'ofetch'
//
// import {useAlertStore} from '~/stores/alert'
//
// export default defineNuxtPlugin(() => {
//
//     const config = useRuntimeConfig()
//
//     const tokenCookie = useCookie<string | null>(
//         'web_session_token',
//         {
//             default: () => null,
//             path: '/',
//             sameSite: 'lax'
//         }
//     )
//
//     function normalizeResponse(
//         response: FetchResponse<any>,
//         request: FetchRequest
//     ) {
//
//         const data = response?._data
//
//         if (!data || typeof data !== 'object') {
//             return
//         }
//
//         if (data.success === true) {
//             response._data = data.data
//         }
//
//         if (data.success === false) {
//             handleErrors(response)
//             const error: any = new Error(
//                 data.message || 'API Error'
//             )
//             error.status = response.status
//             error.data = data
//             throw error
//         }
//
//     }
//
//     function handleErrors(response: FetchResponse<any>) {
//
//         if (import.meta.server) {
//             return
//         }
//
//         const alert = useAlertStore()
//         const status = response.status
//
//         if ([401, 403, 419].includes(status)) {
//             return
//         }
//
//         const data = response._data
//
//         if (data?.errors) {
//             Object.values(data.errors).forEach((arr: any) => {
//                 if (Array.isArray(arr)) {
//                     arr.forEach((msg: string) => {
//                         alert.add('error', msg)
//                     })
//                 }
//             })
//         } else if (data?.message) {
//             alert.add('error', data.message)
//         }
//
//     }
//
//     const apiToken = $fetch.create({
//
//         baseURL: config.public.apiBase + 'V1',
//         credentials: 'include',
//
//         async onRequest({options}) {
//             const headers = new Headers(
//                 options.headers || {}
//             )
//             const token = tokenCookie.value
//             if (token) {
//                 headers.set(
//                     'Authorization',
//                     `Bearer ${token}`
//                 )
//             }
//             if (import.meta.server) {
//                 const cookie = useRequestHeaders(['cookie']).cookie
//                 if (cookie) {
//                     headers.set('cookie', cookie)
//                 }
//             }
//             options.headers = headers
//         },
//
//         onResponse({response, request}) {
//             normalizeResponse(response, request)
//         },
//
//         onResponseError({response}) {
//             handleErrors(response)
//         }
//
//     })
//
//     return {
//         provide: {
//             apiToken
//         }
//     }
//
// })
