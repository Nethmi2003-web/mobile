import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your server machine's local IP for physical device testing
// Android Emulator: http://10.0.2.2:5001/api
// iOS Simulator: http://localhost:5001/api
// Physical Device (Expo Go): http://<your-local-ip>:5001/api
const BASE_URL = 'http://localhost:5001/api';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
