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

## Contribuyendo

Este proyecto forma parte de mi proceso de aprendizaje como ingeniero informático y desarrollador web. Es posible que encuentres decisiones de diseño mejorables, errores o implementaciones que aún no siguen las mejores prácticas. Estoy totalmente abierto a sugerencias, críticas constructivas y cualquier aporte que me ayude a mejorar.

Para participar:

- Haz un fork del repositorio y crea una rama para tu funcionalidad o corrección.
- Abre un Pull Request explicando claramente tus cambios.
- Si detectas un problema, crea un issue con la mayor cantidad de detalles posible.
- Toda recomendación sobre arquitectura, seguridad o buenas prácticas es bienvenida.

### Reglas básicas

- Escribe código claro y documentado.
- Intenta mantener la coherencia con el estilo del proyecto.
- Explica el porqué de los cambios, no solo el qué.

## Sobre este proyecto

Este sistema nació como un proyecto académico real para apoyar la gestión de vacunas en el Centro de Diagnóstico Integral (CDI) Negra Hipólita, ubicado en el municipio Rómulo Gallegos del estado Cojedes, pero también es mi laboratorio personal de aprendizaje. Cada módulo refleja cosas que voy descubriendo: nuevas formas de estructurar código, manejar bases de datos, diseñar interfaces y construir software útil para personas reales.

Si ves algo que podría hacerse mejor, probablemente tengas razón, y me encantaría aprenderlo.
