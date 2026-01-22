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
    GiSkullMask,      // Error / Sombra
    GiVisoredHelm     // Capacete
} from 'react-icons/gi';

// Centralized Icon Registry
// Usando apenas ícones 100% seguros que já vimos funcionar.
export const ICONS = {
    // Actions
    CLOSE: GiCancel,
    CONFIRM: GiCheckMark,
    EDIT: GiQuill,
    DELETE: GiTrashCan,

    // Auth & Profile
    LOGIN: GiEntryDoor,
    LOGOUT: GiExitDoor,
    REGISTER: GiNewBorn,
    HELMET: GiVisoredHelm,

    // Classes / Roles
    WIZARD: GiMagicPotion, // Fallback
    ROGUE: GiBroadsword,    // Fallback
    WARRIOR: GiVisoredHelm,
    BARBARIAN: GiBroadsword,
    ELF: GiScrollUnfurled,

    // Monsters
    GOBLIN: GiSkullMask,
    ORC: GiSkullMask,
    DRAGON: GiSkullMask,
    SKELETON: GiSkullMask,
    WOLF: GiSkullMask,
    SPIDER: GiSkullMask,

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

    // Admin / CRUD
    DATABASE: GiStoneTower,
    TABLE: GiScrollUnfurled,
    ADD: GiNewBorn,
    FILTER: GiCog,
    SEARCH: GiHourglass,
    BOOK: GiScrollUnfurled,
    BACKPACK: GiGoldBar,
    ARMOR: GiCheckedShield,
    MAP: GiVillage,
    CRYSTAL_BALL: GiMagicPotion,
    FIRE_RING: GiMagicPotion,
    HISTORY: GiHourglass, // Fallback para HISTORY
    IMAGE: GiScrollUnfurled,

    // Combat & States (Fallbacks Seguros)
    SWORDS: GiBroadsword,
    BROKEN_SHIELD: GiCheckedShield,
    CHEST: GiGoldBar,
    DUMMY: GiStoneTower,
    POISON: GiSkullMask,
    BASH: GiBroadsword,
    COINS: GiGoldBar,
    HEART_BROKEN: GiHealthPotion,
    FATAL: GiSkullMask,
};

// Helper array for iterating over all icons
export const ICON_LIST = Object.entries(ICONS).map(([key, IconComponent]) => ({
    name: key,
    Icon: IconComponent
}));
