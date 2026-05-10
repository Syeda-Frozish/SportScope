const api = require('./tennisApi');
const TennisRanking = require('../models/tennisRanking');

const extractRankingsArray = (res) => {
  const rankingsRaw = res?.data;

  // Observed:
  // - { data: [ ... ] }
  // Also sometimes:
  // - { data: { data: [ ... ] } }
  if (Array.isArray(rankingsRaw)) return rankingsRaw;
  if (Array.isArray(rankingsRaw?.data)) return rankingsRaw.data;
  if (Array.isArray(rankingsRaw?.data?.data)) return rankingsRaw.data.data;

  return [];
};

const normalizeType = (type) => {
  // API expects atp/wta. Many clients may pass men/women.
  if (type === 'men') return 'atp';
  if (type === 'women') return 'wta';
  return type;
};

const getSinglesRankings = async (type = 'atp') => {
  type = normalizeType(type);

  try {
    const res = await api.get(`/${type}/ranking/singles`);
    const rankings = extractRankingsArray(res);

    // Save to DB (best-effort; rankings should still return even if DB is down)
    try {
      await TennisRanking.updateOne(
        { type, category: 'singles' },
        {
          type,
          category: 'singles',
          data: rankings,
          snapshotDate: new Date(),
          lastUpdated: new Date(),
        },
        { upsert: true }
      );
    } catch (dbError) {
      console.error('Warning: failed to persist singles rankings:', dbError.message);
    }

    return rankings;
  } catch (error) {
    console.error('Error fetching singles rankings:', error.message);
    throw error;
  }
};

const getDoublesRankings = async (type = 'atp') => {
  try {
    const res = await api.get(`/${type}/ranking/doubles`);
    const rankings = extractRankingsArray(res);

    // Save to DB (best-effort; rankings should still return even if DB is down)
    try {
      await TennisRanking.updateOne(
        { type, category: 'doubles' },
        {
          type,
          category: 'doubles',
          data: rankings,
          snapshotDate: new Date(),
          lastUpdated: new Date(),
        },
        { upsert: true }
      );
    } catch (dbError) {
      console.error('Warning: failed to persist doubles rankings:', dbError.message);
    }

    return rankings;
  } catch (error) {
    console.error('Error fetching doubles rankings:', error.message);
    throw error;
  }
};


const getRaceRankings = async (type = 'atp') => {
  try {
    const res = await api.get(`/${type}/ranking/singles?race=true`);
    const rankings = extractRankingsArray(res);

    // Save to DB
    await TennisRanking.updateOne(
      { type, category: 'race' },
      {
        type,
        category: 'race',
        data: rankings,
        snapshotDate: new Date(),
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    return rankings;
  } catch (error) {
    console.error('Error fetching race rankings:', error.message);
    throw error;
  }
};

const getRankingsFromDB = async (type, category) => {
  try {
    return await TennisRanking.findOne({ type, category }).sort({ snapshotDate: -1 });
  } catch (error) {
    console.error('Error fetching rankings from DB:', error.message);
    return null;
  }
};

const getAllRankingsFromDB = async (type) => {
  try {
    const rankings = await TennisRanking.find({ type }).sort({ snapshotDate: -1 });
    return rankings.reduce((acc, ranking) => {
      acc[ranking.category] = ranking;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching all rankings from DB:', error.message);
    return {};
  }
};

module.exports = {
  getSinglesRankings,
  getDoublesRankings,
  getRaceRankings,
  getRankingsFromDB,
  getAllRankingsFromDB,
};

