# Sistema-NH

Sistema de gestión de vacunas desarrollado con Vue 3, Vite y Vuetify.

## Descripción

Sistema-NH (Convit) es una aplicación web para la gestión y registro de vacunas, pacientes, dosis aplicadas, centros de salud, fabricantes y reportes. Permite a usuarios administrativos y de salud registrar y consultar información relevante sobre el proceso de vacunación.

## Estructura del Proyecto

- **Frontend SNH/**: Contiene el frontend de la aplicación, construido con Vue 3, Pinia, Vue Router, Vuetify y Vee-Validate.
- **src/components/**: Componentes reutilizables para formularios y vistas.
- **src/pages/**: Páginas principales de la aplicación.
- **src/layouts/**: Layouts para la estructura visual.
- **src/router/**: Configuración de rutas.
- **src/plugins/**: Plugins de Vuetify y otros.
- **src/composables/**: Composables personalizados (por ejemplo, modo oscuro).

## Instalación y Uso

1. Entra a la carpeta del frontend:

   ```sh
   cd "Frontend SNH"
   ```

2. Instala las dependencias:

   ```sh
   npm install
   ```

3. Inicia el servidor de desarrollo:

   ```sh
   npm run dev
   ```

4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Scripts Disponibles

- `npm run dev`: Compila y recarga en caliente para desarrollo.
- `npm run build`: Compila para producción.
- `npm run preview`: Vista previa de producción.
- `npm run lint`: Linting con ESLint.
- `npm run format`: Formatea el código con Prettier.

## Tecnologías Utilizadas

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Vuetify](https://vuetifyjs.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vee-Validate](https://vee-validate.logaretm.com/)
- [Yup](https://github.com/jquense/yup)

## Licencia

Este proyecto es privado y su uso está restringido.