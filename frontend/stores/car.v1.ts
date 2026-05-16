// import {defineStore} from 'pinia'
// // import {useCarV1Api} from '~/services/api/external/v1/car.api'
// import {useAuthApi} from "~/services/api/internal/auth.api";
// import {useCarApi} from '~/services/api/internal/car.api'
// import {useAlertStore} from './alert'
// import {useAuthStore} from './auth'
//
// type CarForm = {
//     title: string
//     description: string
//     price: string | number
//     photo_url: string
//     contacts: string
//     brand: string
//     model: string
//     year: string | number
//     body: string
//     mileage: string | number
// }
//
// const defaultForm = (): CarForm => ({
//     title: '',
//     description: '',
//     price: '',
//     photo_url: '',
//     contacts: '',
//     brand: '',
//     model: '',
//     year: '',
//     body: '',
//     mileage: ''
// })
//
// export const useCarV1Store = defineStore('car-v1', {
//
//     state: () => ({
//         form: defaultForm(),
//         errors: {} as Record<string, string>,
//         submitting: false,
//         generating: false,
//     }),
//
//     actions: {
//
//         validateOptions() {
//             const f = this.form
//             const required = ['brand', 'model', 'year', 'body', 'mileage'] as const
//
//             const hasAny = f.brand || f.model || f.year || f.body || f.mileage
//             if (!hasAny) return []
//
//             return required.filter(k => !f[k])
//         },
//
//         reset() {
//             this.form = defaultForm()
//             this.errors = {}
//             this.submitting = false
//             this.generating = false
//         },
//
//         showAlert(type: string, message: string) {
//             useAlertStore().add(type, message)
//         },
//
//         clearErrors() {
//             this.errors = {}
//         },
//
//         setError(field: string, message: string) {
//             this.errors[field] = message
//         },
//
//         async submit() {
//             this.clearErrors()
//
//             const auth = useAuthStore()
//
//             const missing = this.validateOptions()
//
//             if (missing.length) {
//                 missing.forEach(f => this.setError(f, 'Обязательно.'))
//                 this.showAlert('danger', 'Заполните опции автомобиля.')
//                 return null
//             }
//
//             if (!auth.isAuth) {
//                 this.showAlert('danger', 'Требуется авторизация.')
//                 return null
//             }
//
//             const api = useAuthApi()
//             const carApi = useCarApi()
//
//             this.submitting = true
//
//             try {
//
//                 // await this.ensureToken()
//                 await api.csrf()
//
//                 const payload = {
//                     ...this.form,
//                     price: Number(this.form.price),
//                     year: Number(this.form.year),
//                     mileage: Number(this.form.mileage),
//                     options: {
//                         brand: this.form.brand,
//                         model: this.form.model,
//                         year: Number(this.form.year),
//                         body: this.form.body,
//                         mileage: Number(this.form.mileage),
//                     },
//                 }
//
//                 const res: any = await carApi.create(payload)
//
//                 this.showAlert('success', res.message || `Создано ID: ${res.data.id}`)
//                 this.reset()
//
//                 return res.data
//             } catch (e: any) {
//                 const status = e?.status
//                 const data = e?.data
//
//                 if (status === 401) {
//                     auth.logoutLocal()
//                     this.showAlert('danger', 'Сессия истекла.')
//                     return null
//                 }
//
//                 if (status === 422) {
//                     this.showAlert('error', data?.message || 'Ошибка валидации.')
//
//                     if (data?.errors) {
//                         Object.entries(data.errors).forEach(([k, v]: any) => {
//                             this.setError(k, v[0])
//                         })
//                     }
//                 } else {
//                     this.showAlert('error', data?.message || 'Ошибка сервера.')
//                 }
//
//                 return null
//             } finally {
//                 this.submitting = false
//             }
//         },
//
//         async generate() {
//             this.generating = true
//
//             const api = useAuthApi()
//             const carApi = useCarApi()
//
//             try {
//
//                 // await this.ensureToken()
//                 await api.csrf()
//
//                 const res: any = await carApi.generateMock()
//                 const car = res.data
//
//                 Object.assign(this.form, {
//                     title: car.title,
//                     description: car.description,
//                     price: car.price,
//                     photo_url: car.photo_url,
//                     contacts: car.contacts,
//                     brand: car.options?.brand,
//                     model: car.options?.model,
//                     year: car.options?.year,
//                     body: car.options?.body,
//                     mileage: car.options?.mileage,
//                 })
//             } catch {
//                 this.showAlert('error', 'Ошибка генерации данных.')
//             } finally {
//                 this.generating = false
//             }
//         },
//
//         async ensureToken() {
//             const tokenCookie = useCookie<string | null>('api_token', {
//                 default: () => null,
//                 path: '/',
//                 sameSite: 'lax',
//             })
//             if (tokenCookie.value) {
//                 return tokenCookie.value
//             }
//             const { $apiToken } = useNuxtApp()
//             try {
//                 const res: any = await $apiToken('/api/v1/auth/token')
//                 tokenCookie.value = res?.data?.token || null
//                 return tokenCookie.value
//             } catch (e) {
//                 console.error('[car-v1] token fetch failed', e)
//                 tokenCookie.value = null
//                 return null
//             }
//         }
//
//     }
//
// })
