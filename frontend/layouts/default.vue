<script setup lang="ts">

import Alerts from '~/components/Alerts.vue'
import Navbar from '~/components/Navbar.vue'
import AppFooter from '~/components/Footer.vue'

</script>

<template>
    <div class="d-flex flex-column min-vh-100">

        <Navbar />
        <Alerts />

        <main class="flex-grow-1">
            <slot />
        </main>

        <AppFooter />

    </div>
</template>
