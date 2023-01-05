import { useState } from "react"
import {
    nameValidator,
    emailValidator,
    passwordValidator,
    confirmPasswordValidator
} from "../helpers/registerFormHelpers/registerFormValidators"

const touchErrors = errors => {
    return Object.entries(errors).reduce((acc, [field, fieldError]) => {
        acc[field] = {
            ...fieldError,
            dirty: true,
        }

        return acc
    }, {})
}

export const useLoginFormValidator = (form, setIsLoading) => {
    const initialErrorsState = {
        name: {
            dirty: false,
            error: false,
            message: "",
        },
        email: {
            dirty: false,
            error: false,
            message: "",
        },
        password: {
            dirty: false,
            error: false,
            message: "",
        },
        confirmPassword: {
            dirty: false,
            error: false,
            message: "",
        }
    }

    const [errors, setErrors] = useState(initialErrorsState)

    const validateForm = async ({ form, field, errors, forceTouchErrors = false }) => {
        let isValid = true
        let nextErrors = { ...errors }

        if (forceTouchErrors) {
            nextErrors = touchErrors(errors)
        }

        const { name, email, password, confirmPassword } = form

        if (nextErrors.name.dirty && (field ? field === "name" : true)) {
            const nameMessage = await nameValidator(name)
            nextErrors.name.error = !!nameMessage
            nextErrors.name.message = nameMessage
            if (!!nameMessage) isValid = false
        }

        if (nextErrors.email.dirty && (field ? field === "email" : true)) {
            const emailMessage = await emailValidator(email)
            nextErrors.email.error = !!emailMessage
            nextErrors.email.message = emailMessage
            if (!!emailMessage) isValid = false
        }

        if (nextErrors.password.dirty && (field ? field === "password" : true)) {
            const passwordMessage = passwordValidator(password)
            nextErrors.password.error = !!passwordMessage
            nextErrors.password.message = passwordMessage
            if (!!passwordMessage) isValid = false
        }

        if (nextErrors.confirmPassword.dirty && (field ? field === "confirmPassword" : true)) {
            const confirmPasswordMessage = confirmPasswordValidator(confirmPassword, password)
            nextErrors.confirmPassword.error = !!confirmPasswordMessage
            nextErrors.confirmPassword.message = confirmPasswordMessage
            if (!!confirmPasswordMessage) isValid = false
        }

        setErrors(nextErrors)

        return {
            isValid,
            errors: nextErrors,
        }
    }

    const handleBlur = e => {
        const field = e.target.name
        const fieldError = errors[field]

        if (fieldError.dirty) return

        const updatedErrors = {
            ...errors,
            [field]: {
                ...errors[field],
                dirty: true,
            },
        }

        validateForm({ form, field, errors: updatedErrors })
    }

    const clearErrors = () => setErrors(initialErrorsState)

    return {
        validateForm,
        handleBlur,
        clearErrors,
        errors,
    }
}