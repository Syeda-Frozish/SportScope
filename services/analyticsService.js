const Match = require('../models/cricketMatch');
const Player = require('../models/cricketPlayers');
const TennisPlayer = require('../models/tennisPlayer');
const TennisFixture = require('../models/tennisFixture');
const TennisRanking = require('../models/tennisRanking');
const { getCache, setCache } = require('../config/redis');
const { getCache: getInternalCache, setCache: setInternalCache } = require('../utils/cache');

const normalizeTennisType = (type = 'atp') => {
  const value = String(type || 'atp').toLowerCase();
  if (value === 'men' || value === 'atp') return 'atp';
  if (value === 'women' || value === 'wta') return 'wta';
  return 'atp';
};

const getCacheValue = async (key) => {
  const redisValue = await getCache(key);
  if (redisValue) return redisValue;
  return getInternalCache(key);
};

const setCacheValue = async (key, value, ttl = 300) => {
  await setCache(key, value, ttl);
  setInternalCache(key, value, ttl);
};

const getCricketTeamMatchCounts = async (limit = 10) => {
  const cacheKey = `cricket:top-teams:${limit}`;
  const cached = await getCacheValue(cacheKey);
  if (cached) return cached;

  const result = await Match.aggregate([
    { $match: { matchStarted: true } },
    { $project: { teams: ['$teamA.name', '$teamB.name'] } },
    { $unwind: '$teams' },
    { $group: { _id: '$teams', matchCount: { $sum: 1 } } },
    { $sort: { matchCount: -1 } },
    { $limit: limit },
  ]);

  await setCacheValue(cacheKey, result, 600);
  return result;
};

const getCricketRecentMatches = async (limit = 20) => {
  const cacheKey = `cricket:recent-matches:${limit}`;
  const cached = await getCacheValue(cacheKey);
  if (cached) return cached;

  const result = await Match.aggregate([
    { $match: { matchStarted: true, matchEnded: true, date: { $lte: new Date() } } },
    { $project: { matchId: 1, name: 1, date: 1, teamA: 1, teamB: 1, seriesId: 1 } },
    { $sort: { date: 1 } },
    { $limit: limit },
  ]);

  await setCacheValue(cacheKey, result, 300);
  return result;
};

const getCricketPlayersByCountry = async (limit = 10) => {
  const cacheKey = `cricket:players-by-country:${limit}`;
  const cached = await getCacheValue(cacheKey);
  if (cached) return cached;

  const result = await Player.aggregate([
    { $group: { _id: '$country.name', playerCount: { $sum: 1 } } },
    { $sort: { playerCount: -1 } },
    { $limit: limit },
  ]);

  await setCacheValue(cacheKey, result, 900);
  return result;
};

const getTennisTopRankedPlayers = async (type = 'atp', limit = 10) => {
  const normalizedType = normalizeTennisType(type);
  const cacheKey = `tennis:top-ranked:${normalizedType}:${limit}`;
  const cached = await getCacheValue(cacheKey);
  if (cached) return cached;

  const result = await TennisPlayer.find({ type: normalizedType, currentRank: { $gt: 0 } })
    .sort({ currentRank: 1 })
    .limit(limit)
    .select('playerId name currentRank points countryAcr type')
    .lean();

  await setCacheValue(cacheKey, result, 600);
  return result;
};

const getTennisTopTournaments = async (limit = 10) => {
  const cacheKey = `tennis:top-tournaments:${limit}`;
  const cached = await getCacheValue(cacheKey);
  if (cached) return cached;

  const result = await TennisFixture.aggregate([
    { $match: { tournament: { $exists: true, $ne: null } } },
    { $group: { _id: '$tournament.name', matchCount: { $sum: 1 } } },
    { $sort: { matchCount: -1 } },
    { $limit: limit },
  ]);

  await setCacheValue(cacheKey, result, 600);
  return result;
};

const getTennisLatestRankings = async (type = 'atp', category = 'singles') => {
  const normalizedType = normalizeTennisType(type);
  const cacheKey = `tennis:latest-rankings:${normalizedType}:${category}`;
  const cached = await getCacheValue(cacheKey);
  if (cached) return cached;

  const ranking = await TennisRanking.findOne({ type: normalizedType, category }).sort({ snapshotDate: -1 }).lean();
  
  if (ranking) {
    await setCacheValue(cacheKey, ranking, 1800);
  }

  return ranking || null;
};

module.exports = {
  getCricketTeamMatchCounts,
  getCricketRecentMatches,
  getCricketPlayersByCountry,
  getTennisTopRankedPlayers,
  getTennisTopTournaments,
  getTennisLatestRankings,
};