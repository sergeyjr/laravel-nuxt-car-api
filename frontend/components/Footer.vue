<script setup lang="ts">

import {useI18n} from 'vue-i18n'

/* -----------------------------
   i18n
------------------------------*/

const {t} = useI18n()

const localePath = useLocalePath()

const config = useRuntimeConfig()

const appName = config.public.appName

const year = new Date().getFullYear()

/* -----------------------------
   Scroll To Top
------------------------------*/

const showScrollTop = ref(false)

const handleScroll = () => {
    showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})

</script>

<template>
    <footer class="app-footer mt-5 py-4 border-top">
        <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center">

            <div class="text-muted small">
                &copy; {{ year }} {{ appName }}. {{ t('footer.allRightsReserved') }}
            </div>

            <div class="d-flex gap-3 mt-2 mt-md-0">

                <NuxtLink
                    :to="localePath('/cars')"
                    class="footer-link"
                    active-class="active"
                    exact-active-class="active"
                >
                    {{ t('nav.catalog') }}
                </NuxtLink>

                <NuxtLink
                    :to="localePath('/contact')"
                    class="footer-link"
                    active-class="active"
                    exact-active-class="active"
                >
                    {{ t('nav.contacts') }}
                </NuxtLink>

                <NuxtLink
                    :to="localePath('/page/about')"
                    class="footer-link"
                    active-class="active"
                    exact-active-class="active"
                >
                    {{ t('nav.about') }}
                </NuxtLink>

                <NuxtLink
                    :to="localePath('/page/info')"
                    class="footer-link"
                    active-class="active"
                    exact-active-class="active"
                >
                    {{ t('nav.info') }}
                </NuxtLink>

            </div>

        </div>
    </footer>

    <button
        v-if="showScrollTop"
        class="scroll-top-btn"
        type="button"
        @click="scrollToTop"
        aria-label="Scroll to top"
    >
        ↑
    </button>

</template>

<style scoped>

.app-footer {
    background: transparent;
}

.footer-link {
    position: relative;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    text-decoration: none;
    transition: color 0.2s ease, transform 0.2s ease;
}

.footer-link:hover {
    color: rgba(0, 0, 0, 0.85);
    /* transform: translateY(-1px); */
}

.footer-link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 100%;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
    opacity: 0.6;
}

.footer-link:hover::after {
    transform: scaleX(1);
}

.footer-link.active {
    color: #000;
    font-weight: 500;
    transform: translateY(-1px);
}

.footer-link.active::after {
    transform: scaleX(1);
    opacity: 1;
    height: 2px;
}

.footer-link.active {
    text-shadow: 0 0 0.5px rgba(0,0,0,0.25);
}

.footer-link:focus-visible {
    outline: none;
    color: #000;
}

.footer-link:focus-visible::after {
    transform: scaleX(1);
    opacity: 1;
    height: 2px;
}

.scroll-top-btn {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 42px;
    height: 42px;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.85);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.25s ease;
    z-index: 1000;
}

.scroll-top-btn:hover {
    transform: translateY(-3px) scale(1.05);
    background: rgba(0, 0, 0, 0.95);
}

.scroll-top-btn:active {
    transform: scale(0.95);
}

.scroll-top-btn {
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

</style>
