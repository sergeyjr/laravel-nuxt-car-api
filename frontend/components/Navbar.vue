<script setup lang="ts">

import {computed, watch} from 'vue'
import {useRoute} from 'vue-router'
import {useAuthActions} from '~/composables/useAuthActions'
import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'

const auth = useAuthStore()
const cart = useCartStore()
const route = useRoute()

const {handleLogout} = useAuthActions()

const config = useRuntimeConfig()
const appName = config.public.appName

// watch(
//     () => auth.isAuth,
//     async (isAuth) => {
//         if (isAuth && !cart.initialized) {
//             await cart.fetch()
//         }
//     }
// )

const cartCount = computed(() => {
    return Object.values(cart.items || {}).reduce((sum, item: any) => {
        return item ? sum + Number(item.qty || 0) : sum
    }, 0)
})

const isActive = (path: string) => {
    return route.path.startsWith(path)
}

</script>

<template>
    <nav class="navbar navbar-dark bg-dark">
        <div class="container d-flex justify-content-between align-items-center">

            <!-- логотип -->
            <NuxtLink class="navbar-brand text-white" to="/">
                {{ appName }}
            </NuxtLink>

            <!-- меню -->
            <div class="d-flex flex-wrap gap-2">

                <NuxtLink
                    to="/cars"
                    class="btn btn-sm"
                    :class="isActive('/cars') ? 'btn-primary' : 'btn-outline-light'"
                >
                    Каталог
                </NuxtLink>

                <NuxtLink
                    to="/contact"
                    class="btn btn-sm"
                    :class="isActive('/contact') ? 'btn-primary' : 'btn-outline-light'"
                >
                    Контакты
                </NuxtLink>

                <NuxtLink
                    to="/page/about"
                    class="btn btn-sm"
                    :class="isActive('/page/about') ? 'btn-primary' : 'btn-outline-light'"
                >
                    О проекте
                </NuxtLink>

                <NuxtLink
                    to="/page/info"
                    class="btn btn-sm"
                    :class="isActive('/page/info') ? 'btn-primary' : 'btn-outline-light'"
                >
                    Инфо
                </NuxtLink>

                <template v-if="auth.isAuth">

                    <NuxtLink
                        to="/dashboard"
                        class="btn btn-sm"
                        :class="isActive('/dashboard') ? 'btn-primary' : 'btn-outline-light'"
                    >
                        Кабинет
                    </NuxtLink>

                    <NuxtLink
                        to="/cart"
                        class="btn btn-sm position-relative"
                        :class="isActive('/cart') ? 'btn-primary' : 'btn-outline-light'"
                    >
                        Корзина

                        <span
                            v-if="cart.initialized && cartCount > 0"
                            class="badge bg-danger ms-1"
                            style="font-size: 11px;"
                        >
                            {{ cartCount }}
                        </span>
                    </NuxtLink>

                    <button
                        class="btn btn-sm btn-outline-light"
                        @click="handleLogout"
                    >
                        Выход
                    </button>

                </template>

                <template v-else>

                    <NuxtLink
                        to="/login"
                        class="btn btn-sm"
                        :class="isActive('/login') ? 'btn-primary' : 'btn-outline-light'"
                    >
                        Вход
                    </NuxtLink>

                </template>

            </div>
        </div>
    </nav>
</template>

<style scoped>

.navbar {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.btn {
    transition: all 0.2s ease;
}

.btn-outline-light {
    border: none;
}

.btn-outline-light:hover {
    border-color: #fff;
}

.btn-primary {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

</style>
