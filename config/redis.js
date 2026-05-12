const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();

let redisClient = null;
const isRedisEnabled = process.env.UPSTASH_REDIS_URL || process.env.REDIS_ENABLED === 'true';

const initRedis = async () => {
  if (!isRedisEnabled) {
    console.log('Redis is disabled (set UPSTASH_REDIS_URL or REDIS_ENABLED=true to enable)');
    return null;
  }

  try {
    const client = redis.createClient({
      url: process.env.UPSTASH_REDIS_URL || 'redis://localhost:6379',
    });

    client.on('error', (err) => {
      console.warn('Redis client error:', err.message);
    });

    client.on('connect', () => {
      console.log('Redis connected');
    });

    await client.connect();
    redisClient = client;
    return client;
  } catch (error) {
    console.warn('Failed to connect to Redis:', error.message);
    console.warn('Falling back to internal cache');
    return null;
  }
};

const getRedisClient = () => redisClient;

const setCache = async (key, value, ttlSeconds = 300) => {
  if (!redisClient) return false;

  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn('Redis setCache error:', error.message);
    return false;
  }
};

const getCache = async (key) => {
  if (!redisClient) return null;

  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn('Redis getCache error:', error.message);
    return null;
  }
};

const deleteCache = async (key) => {
  if (!redisClient) return false;

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.warn('Redis deleteCache error:', error.message);
    return false;
  }
};

const flushCache = async () => {
  if (!redisClient) return false;

  try {
    await redisClient.flushDb();
    return true;
  } catch (error) {
    console.warn('Redis flushCache error:', error.message);
    return false;
  }
};

module.exports = {
  initRedis,
  getRedisClient,
  setCache,
  getCache,
  deleteCache,
  flushCache,
};