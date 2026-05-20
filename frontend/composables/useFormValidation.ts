import {useI18n} from 'vue-i18n'

export const useFormValidation = () => {
    const {t} = useI18n()

    const setNativeValidity = (e: Event) => {
        const el = e.target as HTMLInputElement | HTMLTextAreaElement
        if (!el) return

        // required
        if (el.validity.valueMissing) {
            el.setCustomValidity(t('validation.required'))
            return
        }

        // email
        if (el instanceof HTMLInputElement && el.type === 'email') {
            if (el.validity.typeMismatch) {
                el.setCustomValidity(t('validation.email'))
                return
            }
        }

        el.setCustomValidity('')
    }

    const clearNativeValidity = (e: Event) => {
        const el = e.target as HTMLInputElement | HTMLTextAreaElement
        if (!el) return
        el.setCustomValidity('')
    }

    const validateForm = (form: HTMLFormElement) => {
        return form.reportValidity()
    }

    const focusFirstInvalid = (form: HTMLFormElement) => {
        const el = form.querySelector(':invalid') as HTMLElement | null
        el?.focus?.()
    }

    return {
        setNativeValidity,
        clearNativeValidity,
        validateForm,
        focusFirstInvalid,
    }
}
