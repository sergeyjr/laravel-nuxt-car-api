import {ref, computed, watch, onBeforeUnmount} from 'vue'

export function useModal(initial = false) {
    const isOpen = ref(initial)

    const open = () => {
        isOpen.value = true
    }

    const close = () => {
        isOpen.value = false
    }

    const toggle = () => {
        isOpen.value = !isOpen.value
    }

    const isVisible = computed(() => isOpen.value)

    const lockScroll = () => {
        if (import.meta.client) {
            document.body.style.overflow = 'hidden'
        }
    }

    const unlockScroll = () => {
        if (import.meta.client) {
            document.body.style.overflow = ''
        }
    }

    watch(isOpen, (val) => {
        if (val) lockScroll()
        else unlockScroll()
    })

    onBeforeUnmount(() => {
        unlockScroll()
    })

    return {
        isOpen,
        isVisible,
        open,
        close,
        toggle,
    }
}
