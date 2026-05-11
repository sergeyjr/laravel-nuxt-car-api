<script setup lang="ts">
import { onMounted, watch } from 'vue'

import Navbar from '~/components/Navbar.vue'
import Alerts from '~/components/Alerts.vue'

import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const auth = useAuthStore()
const cart = useCartStore()

onMounted(async () => {
    cart.hydrate()

    if (auth.isAuth) {
        await cart.fetch()
    } else {
        cart.initialized = true
    }

    watch(
        () => auth.isAuth,
        async (isAuth) => {
            if (isAuth) {
                await cart.fetch(true)
            } else {
                cart.items = {}
                cart.initialized = true
                cart.save()
            }
        }
    )
})
</script>

<template>
    <div>
        <Navbar />
        <Alerts />
        <slot />
    </div>
</template>
