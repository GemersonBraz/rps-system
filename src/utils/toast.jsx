import toast from 'react-hot-toast';
import { ICONS } from './icons';

// Custom Notification Facade
export const notify = {
    // Green success with check mark
    success: (message) => toast.success(message, {
        icon: <ICONS.CONFIRM className="text-green-500 text-xl" />,
        style: {
            border: '2px solid #22c55e', // Green-500
            padding: '16px',
            color: '#1f2937',
            background: '#f0fdf4', // Green-50
        },
    }),

    // Red error with trash/cancel icon
    error: (message) => toast.error(message, {
        icon: <ICONS.CLOSE className="text-red-500 text-xl" />,
        style: {
            border: '2px solid #ef4444', // Red-500
            padding: '16px',
            color: '#1f2937',
            background: '#fef2f2', // Red-50
        },
    }),

    // Blue info with scroll icon
    info: (message) => toast(message, {
        icon: <ICONS.SCROLL className="text-blue-500 text-xl" />,
        style: {
            border: '2px solid #3b82f6', // Blue-500
            padding: '16px',
            color: '#1f2937',
            background: '#eff6ff', // Blue-50
        },
    }),
};
