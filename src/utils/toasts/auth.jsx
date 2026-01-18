import { showToast } from './core';
import { ICONS } from '../icons';

export const authToasts = {
    loginSuccess: (user) => showToast(`Bem-vindo de volta, ${user || 'Guerreiro'}!`, {
        icon: ICONS.LOGIN,
        color: 'green-500'
    }),

    loginError: () => showToast("Falha ao entrar nos portões.", {
        icon: ICONS.SKULL,
        color: 'red-500'
    }),

    registerSuccess: () => showToast("Novo personagem criado!", {
        icon: ICONS.REGISTER,
        color: 'green-500'
    }),

    logout: () => showToast("Você deixou o reino.", {
        icon: ICONS.LOGOUT,
        color: 'blue-500'
    })
};
