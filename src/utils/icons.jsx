import {
    GiBroadsword,
    GiCheckedShield,
    GiHealthPotion,
    GiScrollUnfurled,
    GiStoneTower,
    GiMagicPotion,
    GiCancel,
    GiCheckMark,
    GiQuill,
    GiTrashCan,
    GiVillage,
    GiEntryDoor,      // Login
    GiExitDoor,       // Logout
    GiNewBorn,        // Register/New Char
    GiLevelFour,      // Level Up
    GiGoldBar,        // Item/Gold
    GiCog,            // System/Maintenance
    GiHourglass,      // Coming Soon
    GiSave,           // Backup
    GiSkullMask       // Error
} from 'react-icons/gi';

// Centralized Icon Registry
// Use these constants throughout the app to ensure consistency.
export const ICONS = {
    // Actions
    CLOSE: GiCancel,
    CONFIRM: GiCheckMark,
    EDIT: GiQuill,
    DELETE: GiTrashCan,

    // Auth
    LOGIN: GiEntryDoor,
    LOGOUT: GiExitDoor,
    REGISTER: GiNewBorn,

    // RPG Elements
    ATTACK: GiBroadsword,
    DEFENSE: GiCheckedShield,
    POTION: GiHealthPotion,
    MAGIC: GiMagicPotion,
    SCROLL: GiScrollUnfurled,
    TOWER: GiStoneTower,
    SKULL: GiSkullMask,

    // RPG Events
    LEVEL_UP: GiLevelFour,
    GOLD: GiGoldBar,

    // System
    SETTINGS: GiCog,
    WAIT: GiHourglass,
    SAVE: GiSave,

    // Navigation
    HOME: GiVillage,
};

// Helper array for iterating over all icons (good for style guides)
export const ICON_LIST = Object.entries(ICONS).map(([key, IconComponent]) => ({
    name: key,
    Icon: IconComponent
}));
