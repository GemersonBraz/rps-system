import { showToast } from './core';
import { ICONS } from '../icons';

export const rpgToasts = {
    levelUp: (level) => showToast(`LEVEL UP! Você alcançou o nível ${level}!`, {
        icon: ICONS.LEVEL_UP,
        color: 'yellow-500' // Gold
    }),

    questComplete: (questName) => showToast(`Missão "${questName}" Completada!`, {
        icon: ICONS.CONFIRM,
        color: 'green-500'
    }),

    itemObtained: (itemName) => showToast(`Você obteve: ${itemName}`, {
        icon: ICONS.GOLD,
        color: 'yellow-500'
    }),

    damageTaken: (amount) => showToast(`Você sofreu ${amount} de dano!`, {
        icon: ICONS.SKULL,
        color: 'red-500'
    })
};
