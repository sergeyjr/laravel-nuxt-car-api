<script setup>
import Navbar from '~/components/Navbar.vue'
import Alerts from '~/components/Alerts.vue'
</script>

<template>
    <div>
        <Navbar />
        <Alerts />
        <slot />
    </div>
</template>
