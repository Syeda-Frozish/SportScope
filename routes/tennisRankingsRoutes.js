const express = require('express');
const router = express.Router();

const {
  getSinglesRankings,
  getDoublesRankings,
  getRaceRankings,
  getRankingsFromDB,
  getAllRankingsFromDB,
} = require('../services/tennisRankingsApi');
const { getCache, setCache } = require('../utils/cacheClient');

const normalizeType = (type) => {
  if (type === 'men') return 'atp';
  if (type === 'women') return 'wta';
  return type;
};


// Singles rankings
router.get('/:type/singles', async (req, res) => {
  try {
    const { type: typeRaw } = req.params;
    const normalizedType = normalizeType(typeRaw);
    const cacheKey = `tennis_rankings:${normalizedType}:singles`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const rankings = await getSinglesRankings(normalizedType);
    const response = {
      success: true,
      type: normalizedType,
      category: 'singles',
      count: rankings.length,
      rankings,
    };
    if (rankings && rankings.length > 0) {
      await setCache(cacheKey, response, 15 * 60 * 1000);
    }
    res.json(response);
  } catch (err) {
    console.error('Error fetching singles rankings:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch singles rankings',
    });
  }
});

// Doubles rankings
router.get('/:type/doubles', async (req, res) => {
  try {
    const { type: typeRaw } = req.params;
    const type = normalizeType(typeRaw);
    const cacheKey = `tennis_rankings:${type}:doubles`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const rankings = await getDoublesRankings(type);
    const response = {
      success: true,
      type,
      category: 'doubles',
      count: rankings.length,
      rankings,
    };
    if (rankings && rankings.length > 0) {
      await setCache(cacheKey, response, 15 * 60 * 1000);
    }
    res.json(response);
  } catch (err) {
    console.error('Error fetching doubles rankings:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch doubles rankings',
    });
  }
});

// Race rankings
router.get('/:type/race', async (req, res) => {
  try {
    const { type } = req.params;
    const normalizedType = normalizeType(type);
    const cacheKey = `tennis_rankings:${normalizedType}:race`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const rankings = await getRaceRankings(normalizedType);
    const response = {
      success: true,
      type,
      category: 'race',
      count: rankings.length,
      rankings,
    };
    if (rankings && rankings.length > 0) {
      await setCache(cacheKey, response, 15 * 60 * 1000);
    }
    res.json(response);
  } catch (err) {
    console.error('Error fetching race rankings:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch race rankings',
    });
  }
});

// Get rankings from DB
router.get('/:type/:category/db', async (req, res) => {
  try {
    const { type, category } = req.params;
    const cacheKey = `tennis_rankings_db:${type}:${category}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const ranking = await getRankingsFromDB(type, category);
    if (!ranking) {
      return res.status(404).json({
        error: 'Rankings not found in database',
      });
    }
    const response = {
      success: true,
      type,
      category,
      ranking,
    };
    await setCache(cacheKey, response, 30 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching rankings from DB:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch rankings from DB',
    });
  }
});

// Get all rankings from DB
router.get('/:type/db', async (req, res) => {
  try {
    const { type } = req.params;
    const cacheKey = `tennis_rankings_db_all:${type}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const rankings = await getAllRankingsFromDB(type);
    const response = {
      success: true,
      type,
      rankings,
    };
    await setCache(cacheKey, response, 30 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching all rankings from DB:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch all rankings from DB',
    });
  }
});

module.exports = router;