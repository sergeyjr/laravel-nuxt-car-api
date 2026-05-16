<script setup lang="ts">

import {computed, ref} from 'vue'

import {useAuthStore} from '~/stores/auth'
import {useCartStore} from '~/stores/cart'

import {useLogout} from '~/composables/useLogout'
import LogoutModal from '~/components/modals/LogoutConfirmModal.vue'

/* -----------------------------
   stores
------------------------------*/

const auth = useAuthStore()
const cart = useCartStore()

const route = useRoute()

/* -----------------------------
   logout composable
------------------------------*/

const {logout} = useLogout()

/* -----------------------------
   config
------------------------------*/

const config = useRuntimeConfig()

const appName = config.public.appName

/* -----------------------------
   state
------------------------------*/

const showLogoutModal = ref(false)
const isLogoutLoading = ref(false)

/* -----------------------------
   computed
------------------------------*/

const cartCount = computed(() => {
    if (!auth.isAuth) return 0

    return Array.isArray(cart.items)
        ? cart.items.length
        : Object.keys(cart.items ?? {}).length
})

/* -----------------------------
   helpers
------------------------------*/

const isActive = (path: string) => {
    if (path === '/') {
        return route.path === '/'
    }

    return route.path === path || route.path.startsWith(path + '/')
}

/* -----------------------------
   logout handler
------------------------------*/

const onLogout = async () => {
    if (isLogoutLoading.value) return
    isLogoutLoading.value = true
    try {
        const ok = await logout(route.path)
        if (!ok) return
        showLogoutModal.value = false
    } finally {
        isLogoutLoading.value = false
    }
}

</script>

<template>
    <nav class="nav-bar">
        <div class="container nav-inner">

            <NuxtLink to="/" class="logo">
                {{ appName }}
            </NuxtLink>

            <div class="nav-links">

                <NuxtLink to="/cars" class="nav-link" :class="{ active: isActive('/cars') }">
                    Каталог
                </NuxtLink>

                <NuxtLink to="/contact" class="nav-link" :class="{ active: isActive('/contact') }">
                    Контакты
                </NuxtLink>

                <NuxtLink to="/page/about" class="nav-link" :class="{ active: isActive('/page/about') }">
                    О проекте
                </NuxtLink>

                <NuxtLink to="/page/info" class="nav-link" :class="{ active: isActive('/page/info') }">
                    Инфо
                </NuxtLink>

                <template v-if="auth.isAuth">

                    <NuxtLink to="/dashboard" class="nav-link" :class="{ active: isActive('/dashboard') }">
                        Кабинет
                    </NuxtLink>

                    <NuxtLink
                        to="/cart"
                        class="nav-link cart-link"
                        :class="{ active: isActive('/cart') }"
                    >
                        Корзина
                        <span
                            class="badge rounded-pill"
                            :class="cartCount > 0 ? 'bg-danger' : 'bg-secondary'"
                        >
                            {{ cartCount }}
                        </span>
                    </NuxtLink>

                    <button class="nav-link logout" @click="showLogoutModal = true">
                        Выход
                    </button>

                </template>

                <template v-else>

                    <NuxtLink to="/login" class="nav-link" :class="{ active: isActive('/login') }">
                        Вход
                    </NuxtLink>

                </template>

            </div>

        </div>

        <LogoutModal
            v-model:show="showLogoutModal"
            :loading="isLogoutLoading"
            @confirm="onLogout"
        />

    </nav>
</template>

<style scoped>

.nav-bar {
    background: #111827;
    color: white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, .25);
    position: sticky;
    top: 0;
    z-index: 50;
}

.nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
}

.logo {
    font-weight: 700;
    color: white;
    text-decoration: none;
    font-size: 18px;
    letter-spacing: .5px;
}

.nav-links {
    display: flex;
    gap: 18px;
    align-items: center;
    flex-wrap: wrap;
}

.nav-link {
    color: #cbd5e1;
    text-decoration: none;
    font-size: 14px;
    position: relative;
    padding: 6px 2px;
    transition: color .2s ease;
    cursor: pointer;
    background: none;
    border: none;
}

.nav-link:hover {
    color: white;
}

.nav-link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 0;
    background: #3b82f6;
    transition: width .2s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
    width: 100%;
}

.nav-link.active {
    color: white;
}

.cart-link {
    display: flex;
    align-items: center;
    gap: 6px;
}

.logout {
    color: #fca5a5;
}

.logout:hover {
    color: #ef4444;
}

</style>
