<script setup lang="ts">

import {watch} from 'vue'

import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()

await callOnce(async () => {
    if (!authStore.isAuth) {
        cartStore.items = {}
        cartStore.initialized = true
        return
    }
    try {
        await cartStore.fetch(true)
    } catch (e) {
        console.error('Ошибка загрузки корзины', e)
    }

})

watch(
    () => authStore.isAuth,
    async (isAuth, oldValue) => {

        if (isAuth === oldValue) {
            return
        }

        // LOGIN
        if (isAuth) {
            try {
                await cartStore.fetch(true)
            } catch (e) {
                console.error(e)
            }

            return
        }

        // LOGOUT
        cartStore.$patch({
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
