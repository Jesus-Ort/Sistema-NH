import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token') || null,  // Token persistido
        role: null                                     // Rol actual
    }),

    actions: {
        /**
         * Guarda el token y lo persiste en localStorage
         */
        setToken(token) {
        this.token = token
        localStorage.setItem('token', token)
        },

        setRole(role) {
        this.role = role
        },

        /**
         * Limpia el token y el rol
         */
        logout() {
        this.token = null
        this.role = null
        localStorage.removeItem('token')
        }
    }
})
