const express = require('express');
const router = express.Router();

const {
  getSinglesRankings,
  getDoublesRankings,
  getRaceRankings,
  getRankingsFromDB,
  getAllRankingsFromDB,
} = require('../services/tennisRankingsApi');

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

    const rankings = await getSinglesRankings(normalizedType);
    res.json({
      success: true,
      type: normalizedType,

      category: 'singles',
      count: rankings.length,
      rankings,
    });
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
    const rankings = await getDoublesRankings(type);
    res.json({
      success: true,
      type,


      category: 'doubles',
      count: rankings.length,
      rankings,
    });
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
    const rankings = await getRaceRankings(normalizedType);

    res.json({
      success: true,
      type,
      category: 'race',
      count: rankings.length,
      rankings,
    });
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
    const ranking = await getRankingsFromDB(type, category);
    if (!ranking) {
      return res.status(404).json({
        error: 'Rankings not found in database',
      });
    }
    res.json({
      success: true,
      type,
      category,
      ranking,
    });
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
    const rankings = await getAllRankingsFromDB(type);
    res.json({
      success: true,
      type,
      rankings,
    });
  } catch (err) {
    console.error('Error fetching all rankings from DB:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch all rankings from DB',
    });
  }
});

module.exports = router;