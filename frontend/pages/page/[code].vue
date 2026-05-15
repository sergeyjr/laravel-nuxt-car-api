<script setup lang="ts">

import {computed, watch} from 'vue'

import {useRoute} from 'vue-router'

import {usePageStore} from '~/stores/page'

/* -----------------------------
   store
------------------------------*/

const store = usePageStore()

const route = useRoute()

/* -----------------------------
   route param
------------------------------*/

const code = computed(() => String(route.params.code || ''))

/* -----------------------------
   load page
------------------------------*/

watch(
    code,
    async (newCode) => {
        if (!newCode) return
        await store.fetch(newCode)
    },
    {immediate: true}
)

/* -----------------------------
   state
------------------------------*/

const page = computed(() => store.current)

</script>
