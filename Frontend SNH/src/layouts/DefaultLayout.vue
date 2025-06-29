<!--
  DefaultLayout.vue

  Este componente define el layout principal de la aplicación usando componentes de Vuetify.
  Incluye:
    - Una barra de navegación (NavBar) con un evento para alternar el drawer lateral.
    - Un drawer de navegación (<v-navigation-drawer>) que muestra secciones e ítems de navegación dinámicamente desde el dato `drawerItems`.
      - Cada sección puede tener un título, un divisor y una lista de ítems de navegación.
      - Cada ítem de navegación incluye un ícono y una etiqueta, y navega a una ruta especificada.
    - El área principal de contenido (<v-main>) donde se renderizan los componentes enrutados mediante <router-view>.

  Props/Estado:
    - drawer (Boolean): Controla la visibilidad del drawer de navegación.
    - drawerItems (Array): Contiene la estructura de secciones e ítems de navegación.

  Eventos:
    - Escucha el evento `toggle-drawer` desde NavBar para abrir/cerrar el drawer.

  Uso:
    Coloca este layout como componente raíz para páginas que requieran navegación y una estructura de layout consistente.
-->
<template>
  <v-app>
    <!-- Barra de navegacion -->
    <NavBar @toggle-drawer="drawer = !drawer"/>

    <!-- Botón Drawer (Hamburger Dinamico) -->
    <v-navigation-drawer app v-model="drawer">
        <v-list nav dense>
            <template v-for="section in drawerItems" :key="section.title">
              <template v-if="section.title">
                <v-divider class="my-2" />
                <v-list-subheader class="text-uppercase">
                  {{ section.title }}
                </v-list-subheader>
              </template>
              <v-list-item
                v-for="item in section.items"
                :key="item.to"
                :to="item.to"
                :prepend-icon="item.icon"
                link
              >
                <v-list-item-title>{{ item.label }}</v-list-item-title>
              </v-list-item>
            </template>
        </v-list>
    </v-navigation-drawer>

    <v-main class="pa-4 mt-15">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { useUserStore } from '@/stores/users'

// Controlar el estado del drawer de navegación (abierto/cerrado)
const drawer = ref(false)

const userStore = useUserStore()

// Define los ítems del drawer de navegación para el layout de la aplicación.
// Cada objeto en el arreglo representa una sección en el drawer, con un título opcional y una lista de ítems.
// Cada ítem incluye:
//   - label: El nombre que se muestra del ítem de navegación.
//   - icon: El nombre del ícono Material Design Icon (mdi) para el ítem.
//   - to: La ruta a la que navega el ítem al seleccionarlo.
//   - roles: Un arreglo de roles de usuario que pueden ver este ítem.
// Las secciones pueden agruparse por funcionalidad, como registros administrativos o formularios generales.
const allDrawerItems = [
  {
    title: null,
    items: [
      { label: 'Inicio', icon: 'mdi-home', to: '/inicio', roles: ['admin', 'healt'] },
    ],
  },
  {
    title: 'Gestión Administrativa',
    items: [
      { label: 'Areas de Salud', icon: 'mdi-file-chart', to: '/area-salud', roles: ['admin',] },
      { label: 'Dosis', icon: 'mdi-file-chart', to: '/dosis', roles: ['admin','salud'] },
      { label: 'Fabricantes', icon: 'mdi-file-chart', to: '/fabricantes', roles: ['admin',] },
      { label: 'Lotes', icon: 'mdi-file-chart', to: '/lotes', roles: ['admin',] },
      { label: 'Pacientes', icon: 'mdi-file-chart', to: '/pacientes', roles: ['admin',] },
      { label: 'País', icon: 'mdi-file-chart', to: '/pais', roles: ['admin',] },
      { label: 'Vacunas', icon: 'mdi-file-chart', to: '/vacunas', roles: ['admin',] },
    ],
  },
]

/**
 * Calcula la lista de secciones e ítems del drawer según el rol actual del usuario.
 * 
 * - Itera sobre todas las secciones disponibles (`allDrawerItems`).
 * - Para cada sección, filtra sus ítems para incluir solo aquellos permitidos para el rol del usuario actual (`userRole.value`).
 * - Devuelve un nuevo arreglo de secciones, cada una con solo los ítems permitidos.
 * - Excluye cualquier sección que no tenga ítems después del filtrado.
 *
 * - Retorna un arreglo de secciones del drawer, cada una con un título y una lista filtrada de ítems según el rol del usuario.
 */

const drawerItems = computed(() => {
  return allDrawerItems
    .map(section => {
      const filteredItems = section.items.filter(item => item.roles.includes(userStore.role))
      return {
        title: section.title,
        items: filteredItems
      }
    })
    .filter(section => section.items.length > 0)
})

</script>