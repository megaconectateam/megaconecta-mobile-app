import axios from 'axios';

import { setupInterceptorsTo } from './interceptors';

const api = setupInterceptorsTo(
  axios.create({
    baseURL: 'https://apiweb2.megaconecta.com', // process.env.EXPO_PUBLIC_API_BASE_URL,
    timeout: 30000, // Number(process.env.EXPO_PUBLIC_API_TIMEOUT),
    headers: {
      'Content-Type': 'application/json',
    },
  }),
);

export default api;
