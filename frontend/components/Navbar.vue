<script setup lang="ts">

import {computed, ref, onMounted, onBeforeUnmount} from 'vue'

import {useI18n} from 'vue-i18n'

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
   NUXT i18n
------------------------------*/

const {t, locale, setLocale} = useI18n()

const localePath = useLocalePath()

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

const isLangOpen = ref(false)

const langRef = ref<HTMLElement | null>(null)

/* -----------------------------
   languages
------------------------------*/

const languages = [
    {
        code: 'ru',
        name: 'Русский',
        icon: 'fi fi-ru'
    },
    {
        code: 'en',
        name: 'English',
        icon: 'fi fi-gb'
    }
] as const

type LocaleCode = (typeof languages)[number]['code']

const currentLanguage = computed(() => {
    return (
        languages.find(l => l.code === locale.value) ??
        languages[0]
    )
})

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
    const target = localePath(path)
    return route.path === target || route.path.startsWith(target + '/')
}

const toggleLangMenu = () => {
    isLangOpen.value = !isLangOpen.value
}

const chooseLanguage = async (code: LocaleCode) => {
    if (code === locale.value) {
        isLangOpen.value = false
        return
    }
    await setLocale(code)
    isLangOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
    if (!langRef.value) return
    if (!langRef.value.contains(event.target as Node)) {
        isLangOpen.value = false
    }
}

/* -----------------------------
   lifecycle
------------------------------*/

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

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

            <NuxtLink :to="localePath('/')" class="logo">
                {{ appName }}
            </NuxtLink>

            <div class="nav-links">

                <NuxtLink :to="localePath('/cars')" class="nav-link" :class="{ active: isActive('/cars') }">
                    {{ t('nav.catalog') }}
                </NuxtLink>

                <NuxtLink :to="localePath('/contact')" class="nav-link" :class="{ active: isActive('/contact') }">
                    {{ t('nav.contacts') }}
                </NuxtLink>

                <NuxtLink :to="localePath('/page/about')" class="nav-link" :class="{ active: isActive('/page/about') }">
                    {{ t('nav.about') }}
                </NuxtLink>

                <NuxtLink :to="localePath('/page/info')" class="nav-link" :class="{ active: isActive('/page/info') }">
                    {{ t('nav.info') }}
                </NuxtLink>

                <template v-if="auth.isAuth">

                    <NuxtLink :to="localePath('/dashboard')" class="nav-link"
                              :class="{ active: isActive('/dashboard') }">
                        {{ t('nav.dashboard') }}
                    </NuxtLink>

                    <NuxtLink :to="localePath('/cart')" class="nav-link cart-link"
                              :class="{ active: isActive('/cart') }">
                        {{ t('nav.cart') }}

                        <span class="badge rounded-pill"
                              :class="cartCount > 0 ? 'bg-danger' : 'bg-secondary'">
                        {{ cartCount }}
                    </span>
                    </NuxtLink>

                    <BaseButton class="nav-link logout" @click="showLogoutModal = true">
                        {{ t('nav.logout') }}
                    </BaseButton>

                </template>

                <template v-else>

                    <NuxtLink :to="localePath('/login')" class="nav-link" :class="{ active: isActive('/login') }">
                        {{ t('nav.login') }}
                    </NuxtLink>

                </template>

                <!-- LANGUAGE -->

                <div ref="langRef" class="language-switcher">

                    <button type="button" class="language-button" @click="toggleLangMenu">
                        <i :class="currentLanguage.icon"></i>
                    </button>

                    <div v-if="isLangOpen" class="language-dropdown">

                        <button v-for="language in languages"
                                :key="language.code"
                                type="button"
                                class="language-item"
                                @click="chooseLanguage(language.code)">

                            <i :class="language.icon" class="language-icon"></i>
                            <span>{{ language.name }}</span>

                        </button>

                    </div>

                </div>

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

/* LANGUAGE */

.language-switcher {
    position: relative;
    margin-left: 8px;
}

.language-button {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    border: transparent;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background .2s ease,
    border-color .2s ease;
}

.language-button:hover {
    border-color: #60a5fa;
    background: #273549;
}

.language-button i {
    font-size: 20px;
    color: #f9fafb;
}

.language-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    min-width: 190px;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 0, 0, .35);
    z-index: 100;
}

.language-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    background: transparent;
    border: none;
    color: #e5e7eb;
    cursor: pointer;
    transition: background .2s ease;
    font-size: 14px;
}

.language-item:hover {
    background: #374151;
}

.language-icon {
    font-size: 18px;
    color: #f9fafb;
}

</style>
