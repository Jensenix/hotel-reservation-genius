import HomeWallpaper from '@/assets/HomeWallpaper.webp';
import HotelLogo from '@/assets/gsh_logo.png';
export const ImageAssets = {
  HomeWallpaper: HomeWallpaper,
  HotelLogo : HotelLogo
};

export const MaxStayDays = 14;

export const BaseUrl = import.meta.env.BASE_URL || 'http://localhost:3000';
export const ApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const DEBUG = import.meta.env.VITE_DEBUG_MODE === 'true' || false;

export const logger = {
  log: (...args) => {
    if (DEBUG) console.log(...args);
  },

  warn: (...args) => {
    if (DEBUG) console.warn(...args);
  },

  error: (...args) => {
    if (DEBUG) console.error(...args);
  },
};

export const SocketRetryDelays = [1000, 2000, 5000, 10000]; 