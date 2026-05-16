<!-- app.vue -->

<script setup lang="ts">

import {watch} from 'vue'

import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'

const auth = useAuthStore()
const cart = useCartStore()

await callOnce(async () => {

    // ГОСТЬ
    if (!auth.isAuth) {
        cart.items = {}
        cart.initialized = true
        return
    }

    // AUTH USER
    try {
        await cart.fetch(true)
    } catch (e) {
        console.error('Ошибка загрузки корзины', e)
    }

})

watch(
    () => auth.isAuth,
    async (isAuth, oldValue) => {

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
        cart.$patch({
            items: {},
            initialized: true
        })

    }
)

</script>

<template>
    <NuxtLayout>
        <NuxtPage/>
    </NuxtLayout>
</template>
