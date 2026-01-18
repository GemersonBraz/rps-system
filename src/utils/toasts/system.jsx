import { showToast } from './core';
import { ICONS } from '../icons';

export const systemToasts = {
    comingSoon: () => showToast("Em breve em uma nova atualização.", {
        icon: ICONS.WAIT,
        color: 'blue-500'
    }),

    maintenance: () => showToast("Servidores em manutenção pelos ferreiros.", {
        icon: ICONS.SETTINGS,
        color: 'yellow-500'
    }),

    backupSuccess: () => showToast("Progresso salvo nos pergaminhos anciais.", {
        icon: ICONS.SAVE,
        color: 'green-500'
    })
};
