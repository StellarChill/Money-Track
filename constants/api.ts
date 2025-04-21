import Constants from 'expo-constants';

// ดึง base URL จาก app.json
const BASE_URL = Constants.expoConfig?.extra?.API_URL || 'https://loud-bats-occur.loca.lt';

// ต่อท้าย /api/transactions เพื่อให้ URL สมบูรณ์
const API_URL = `${BASE_URL}/api/transactions`;

export { API_URL };