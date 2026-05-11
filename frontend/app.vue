<script setup lang="ts">

import {watch} from 'vue'

import AppLoader from '~/components/AppLoader.vue'

import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'

const auth = useAuthStore()
const cart = useCartStore()

/**
 * CLIENT HYDRATE
 * localStorage доступен только на клиенте
 */
if (import.meta.client) {
    cart.hydrate()
}

/**
 * GLOBAL CART INIT
 * выполнится 1 раз на приложение
 */
await callOnce(async () => {

    if (!auth.isAuth) {

        cart.initialized = true

        return
    }

    try {

        await cart.fetch()

    } catch (e) {

        console.error('Ошибка загрузки корзины', e)

    }

})

/**
 * LOGIN / LOGOUT WATCHER
 */
watch(
    () => auth.isAuth,
    async (isAuth, oldValue) => {

        // пропускаем первый вызов
        if (isAuth === oldValue) {
            return
        }

        /**
         * LOGIN
         */
        if (isAuth) {

            try {

                await cart.fetch(true)

            } catch (e) {

                console.error(e)

            }

            return
        }

        /**
         * LOGOUT
         */
        cart.items = {}
        cart.initialized = true

        if (import.meta.client) {
            cart.save()
        }

    }
)

</script>

<template>
    <NuxtLayout>

        <NuxtPage/>

        <ClientOnly>
            <AppLoader/>
        </ClientOnly>

    </NuxtLayout>
</template>
