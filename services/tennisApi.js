const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const BASE_URL = 'https://tennis-api-atp-wta-itf.p.rapidapi.com/tennis/v2';
const API_KEY = process.env.RAPIDAPI_TENNIS_KEY;
const API_HOST = process.env.RAPIDAPI_TENNIS_HOST || 'tennis-api-atp-wta-itf.p.rapidapi.com';

if (!API_KEY) {
  throw new Error('RAPIDAPI_TENNIS_KEY environment variable is not set');
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': API_HOST,
  },
  timeout: 30000, // 30 seconds
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Tennis API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
      });
    } else if (error.code === 'ECONNABORTED') {
      console.error('Tennis API Timeout:', error.config.url);
    } else {
      console.error('Tennis API Error:', error.message);
    }
    throw error;
  }
);

module.exports = api;