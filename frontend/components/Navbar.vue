<script setup lang="ts">

import { computed, onMounted } from 'vue'

import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useAuthActions } from '~/composables/useAuthActions'

/* ---------------- stores ---------------- */

const auth = useAuthStore()
const cart = useCartStore()

/* ---------------- composables ---------------- */

const { handleLogout } = useAuthActions()

/* ---------------- config ---------------- */

const config = useRuntimeConfig()
const appName = config.public.appName || 'My App'

/* ---------------- lifecycle ---------------- */

onMounted(async () => {
  if (auth.isAuth) {
    await cart.fetch()
  }
})

/* ---------------- computed ---------------- */

const cartCount = computed(() => {
  return Object.values(cart.items || {}).filter(Boolean).length
})

</script>

<template>
    <nav v-if="auth.initialized" class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">

            <NuxtLink class="navbar-brand text-white text-decoration-none" to="/">
                {{ appName }}
            </NuxtLink>

            <div class="nav-divider d-flex align-items-center">

                <NuxtLink class="nav-link d-inline text-white" to="/cars">
                    Каталог
                </NuxtLink>

                <span class="text-white mx-2">|</span>

                <NuxtLink class="nav-link d-inline text-white" to="/contact">
                    Контакты
                </NuxtLink>

                <span class="text-white mx-2">|</span>

                <NuxtLink class="nav-link d-inline text-white" to="/page/about">
                    О проекте
                </NuxtLink>

                <span class="text-white mx-2">|</span>

                <NuxtLink class="nav-link d-inline text-white" to="/page/info">
                    Инфо (БД)
                </NuxtLink>

                <template v-if="auth.isAuth">
                    <span class="text-white mx-2">|</span>

                    <NuxtLink class="nav-link d-inline text-white" to="/dashboard">
                        Личный кабинет
                    </NuxtLink>
                </template>

                <template v-if="auth.isAuth">
                    <span class="text-white mx-2">|</span>

                    <NuxtLink class="nav-link d-inline text-white position-relative" to="/cart">
                        Корзина

                        <span
                            v-if="cartCount > 0"
                            class="badge bg-danger ms-1"
                            style="font-size: 11px;"
                        >{{ cartCount }}
                        </span>

                    </NuxtLink>
                </template>

                <span class="text-white mx-2">|</span>

                <a
                    v-if="auth.isAuth"
                    href="#"
                    class="nav-link d-inline text-white"
                    @click.prevent="handleLogout"
                >
                    Выход
                </a>

                <NuxtLink
                    v-else
                    class="nav-link d-inline text-white"
                    to="/login"
                >
                    Вход
                </NuxtLink>

            </div>

        </div>
    </nav>
</template>

<style scoped>

.navbar {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.navbar .nav-link {
    transition: 0.2s;
}

.navbar .nav-link:hover {
    opacity: 0.8;
    text-decoration: underline;
}

</style>
