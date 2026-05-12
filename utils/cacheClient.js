const { getCache: getRedisCache, setCache: setRedisCache } = require('../config/redis');
const { getCache: getMemoryCache, setCache: setMemoryCache } = require('./cache');

const getCache = async (key) => {
  const redisValue = await getRedisCache(key);
  if (redisValue !== null && redisValue !== undefined) {
    return redisValue;
  }
  return getMemoryCache(key);
};

const setCache = async (key, value, ttlMs) => {
  const ttlSeconds = Math.max(1, Math.ceil(ttlMs / 1000));
  const redisOk = await setRedisCache(key, value, ttlSeconds);
  if (!redisOk) {
    setMemoryCache(key, value, ttlMs);
  }
  return redisOk;
};

module.exports = {
  getCache,
  setCache,
};