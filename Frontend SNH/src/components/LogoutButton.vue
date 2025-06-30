<template>
    <v-btn
    @click="logout"
    icon>
        <v-icon>mdi-logout</v-icon>
    </v-btn>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()


// Funcionalidad del backend
const logout = () => {
  localStorage.removeItem('role')   // Elimina el rol
  localStorage.removeItem('token')   // Elimina el token
  router.push('/login')              // Redirige al login
}
</script>