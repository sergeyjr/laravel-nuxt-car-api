<script setup lang="ts">

import {ref, watch, computed, onBeforeUnmount} from 'vue'
import {useI18n} from 'vue-i18n'

import BaseButton from '~/components/ui/base/BaseButton.vue'
import BaseInput from '~/components/ui/base/BaseInput.vue'

const {t} = useI18n()

const props = withDefaults(defineProps<{
    show: boolean
    processing?: boolean
    errors?: Record<string, string>
}>(), {
    processing: false
})

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'confirm', payload: { email: string; password: string }): void
}>()

const email = ref('')
const password = ref('')

const isLocked = computed(() => Boolean(props.processing))

let scrollY = 0
let prevHtmlOverflow = ''
let prevBodyOverflow = ''
let prevBodyPosition = ''
let prevBodyTop = ''
let prevBodyWidth = ''

const lockScroll = () => {
    if (!import.meta.client) return

    const html = document.documentElement
    const body = document.body

    scrollY = window.scrollY || window.pageYOffset || 0

    prevHtmlOverflow = html.style.overflow
    prevBodyOverflow = body.style.overflow
    prevBodyPosition = body.style.position
    prevBodyTop = body.style.top
    prevBodyWidth = body.style.width

    html.style.overflow = 'hidden'
    html.style.overscrollBehavior = 'none'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
}

const unlockScroll = () => {
    if (!import.meta.client) return

    const html = document.documentElement
    const body = document.body

    html.style.overflow = prevHtmlOverflow
    html.style.overscrollBehavior = ''
    body.style.overflow = prevBodyOverflow
    body.style.position = prevBodyPosition
    body.style.top = prevBodyTop
    body.style.width = prevBodyWidth

    window.scrollTo(0, scrollY)
}

const close = () => {
    if (isLocked.value) {
        return
    }
    emit('close')
}

const confirm = () => {
    if (isLocked.value) {
        return
    }
    emit('confirm', {
        email: email.value,
        password: password.value
    })
}

watch(
    () => props.show,
    (show) => {
        if (show) {
            email.value = ''
            password.value = ''
            lockScroll()
        } else {
            unlockScroll()
        }
    },
    {immediate: true}
)

onBeforeUnmount(() => {
    unlockScroll()
})

</script>

<template>
    <div
        v-if="show"
        class="modal fade show d-block modal-backdrop-fix"
        tabindex="-1"
        @click.self="close"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ t('modals.auth.loginTitle') }}
                    </h5>

                    <BaseButton
                        variant="link"
                        class="btn-close"
                        :disabled="isLocked"
                        aria-label="Close"
                        @click="close"
                    />
                </div>

                <div class="modal-body">
                    <div
                        v-if="errors?.general"
                        class="alert alert-danger"
                    >
                        {{ errors.general }}
                    </div>

                    <form @submit.prevent="confirm">
                        <BaseInput
                            v-model="email"
                            type="email"
                            :label="t('modals.auth.email')"
                            required
                            :disabled="isLocked"
                            :error="errors?.email"
                        />

                        <BaseInput
                            v-model="password"
                            type="password"
                            :label="t('modals.auth.password')"
                            required
                            :disabled="isLocked"
                            :error="errors?.password"
                        />

                        <BaseButton
                            type="submit"
                            class="w-100 mt-3"
                            :loading="isLocked"
                            :disabled="isLocked"
                        >
                            <template #loading>
                                {{ t('modals.auth.loggingIn') }}
                            </template>
                            {{ t('modals.auth.login') }}
                        </BaseButton>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>

.modal-backdrop-fix {
    background: rgba(0, 0, 0, .6);
    touch-action: none;
    overscroll-behavior: none;
}

</style>
