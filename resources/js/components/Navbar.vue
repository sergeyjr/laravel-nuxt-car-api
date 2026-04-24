<script setup>

import {useAuthStore} from '@/stores/authStore'
import {useAuthActions} from '@/composables/useAuthActions'

const auth = useAuthStore()

const appName = import.meta.env.VITE_APP_NAME || 'My App'

const { handleLogout } = useAuthActions()

</script>

<template>
    <nav v-if="auth.initialized" class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">

            <router-link class="navbar-brand text-white text-decoration-none" to="/">
                {{ appName }}
            </router-link>

            <div class="nav-divider d-flex align-items-center">

                <router-link class="nav-link d-inline text-white" to="/cars">
                    Каталог
                </router-link>

                <span class="text-white mx-2">|</span>

                <router-link class="nav-link d-inline text-white" to="/contact">
                    Контакты
                </router-link>

                <span class="text-white mx-2">|</span>

                <router-link class="nav-link d-inline text-white" to="/page/about">
                    About
                </router-link>

                <span class="text-white mx-2">|</span>

                <router-link class="nav-link d-inline text-white" to="/dashboard">
                    Личный кабинет
                </router-link>

                <span class="text-white mx-2">|</span>

                <a
                    v-if="auth.isAuth"
                    href="#"
                    class="nav-link d-inline text-white"
                    @click.prevent="handleLogout"
                >
                    Выход
                </a>

                <router-link
                    v-else
                    class="nav-link d-inline text-white"
                    to="/login"
                >
                    Вход
                </router-link>

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
