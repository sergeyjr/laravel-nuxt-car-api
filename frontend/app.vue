<script setup lang="ts">

import {watch} from 'vue'

import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'

const auth = useAuthStore()
const cart = useCartStore()

if (import.meta.client) {
    cart.hydrate()
}

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

watch(
    () => auth.isAuth,
    async (isAuth, oldValue) => {

        // Пропускаем первый вызов
        if (isAuth === oldValue) {
            return
        }

        // LOGIN
        if (isAuth) {
            try {
                await cart.fetch(true)
            } catch (e) {
                console.error(e)
            }
            return
        }

        // LOGOUT
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
    </NuxtLayout>
</template>
