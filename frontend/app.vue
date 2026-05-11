<script setup lang="ts">

import AppLoader from "~/components/AppLoader.vue";

</script>

<template>
    <NuxtLayout>
        <NuxtPage/>
        <ClientOnly>
            <AppLoader />
        </ClientOnly>
    </NuxtLayout>
</template>
