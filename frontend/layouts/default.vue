<script setup lang="ts">

import Alerts from '~/components/Alerts.vue'
import Navbar from '~/components/Navbar.vue'

</script>

<template>
    <div>
        <Navbar/>
        <Alerts/>
        <slot/>
    </div>
</template>
