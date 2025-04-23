import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.API_URL || 'https://thin-cases-sniff.loca.lt';

const API_URL = `${BASE_URL}/api/transactions`;

export { API_URL };