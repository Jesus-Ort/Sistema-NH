import { ref } from 'vue';

const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
    timeout: 3000,
    actions: [] 
});

function show({ message, color = 'success', timeout = 3000, actions = [] }) {
    snackbar.value = {
        show: true,
        message,
        color,
        timeout,
        actions
    };
}

export default {
    install(app) {
        app.config.globalProperties.$snackbar = {
        success(msg, options = {}) {
            show({ message: msg, color: 'success', ...options });
        },
        error(msg, options = {}) {
            show({ message: msg, color: 'error', ...options });
        },
        warning(msg, options = {}) {
            show({ message: msg, color: 'warning', ...options });
        },
        info(msg, options = {}) {
            show({ message: msg, color: 'info', ...options });
        },
        show // para uso completo y personalizado
        };

        app.provide('snackbarRef', snackbar);
    },
    snackbar
};