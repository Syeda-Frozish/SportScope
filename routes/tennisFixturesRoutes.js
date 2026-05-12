const express = require('express');
const router = express.Router();

const {
  getTodayFixtures,
  getFixturesByDate,
  getFixturesByDateRange,
  getFixturesByTournament,
  getFixturesByPlayer,
  getFixturesFromDB,
} = require('../services/tennisFixturesApi');
const { getCache, setCache } = require('../utils/cacheClient');

// Today's fixtures
router.get('/today', async (req, res) => {
  try {
    const type = req.query.type || 'atp';
    const cacheKey = `tennis_fixtures_today:${type}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const fixtures = await getTodayFixtures(type);
    const response = {
      success: true,
      type,
      count: fixtures.length,
      fixtures,
    };
    await setCache(cacheKey, response, 5 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching today fixtures:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch today fixtures',
    });
  }
});

// Fixtures by date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const type = req.query.type || 'atp';
    const cacheKey = `tennis_fixtures_date:${type}:${date}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const fixtures = await getFixturesByDate(type, date);
    const response = {
      success: true,
      type,
      date,
      count: fixtures.length,
      fixtures,
    };
    await setCache(cacheKey, response, 5 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching fixtures by date:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch fixtures by date',
    });
  }
});

// Fixtures by date range
router.get('/range', async (req, res) => {
  try {
    const { start, end, type = 'atp' } = req.query;
    const cacheKey = `tennis_fixtures_range:${type}:${start}:${end}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    if (!start || !end) {
      return res.status(400).json({
        error: 'start and end query parameters are required',
      });
    }
    const fixtures = await getFixturesByDateRange(type, start, end);
    const response = {
      success: true,
      type,
      startDate: start,
      endDate: end,
      count: fixtures.length,
      fixtures,
    };
    await setCache(cacheKey, response, 10 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching fixtures by date range:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch fixtures by date range',
    });
  }
});

// Fixtures by tournament
router.get('/tournament/:tournamentId', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const type = req.query.type || 'atp';
    const cacheKey = `tennis_fixtures_tournament:${type}:${tournamentId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const fixtures = await getFixturesByTournament(type, tournamentId);
    const response = {
      success: true,
      type,
      tournamentId,
      count: fixtures.length,
      fixtures,
    };
    await setCache(cacheKey, response, 10 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching fixtures by tournament:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch fixtures by tournament',
    });
  }
});

// Fixtures by player
router.get('/player/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const type = req.query.type || 'atp';
    const cacheKey = `tennis_fixtures_player:${type}:${playerId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const fixtures = await getFixturesByPlayer(type, playerId);
    const response = {
      success: true,
      type,
      playerId,
      count: fixtures.length,
      fixtures,
    };
    await setCache(cacheKey, response, 10 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching fixtures by player:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch fixtures by player',
    });
  }
});

// Get completed fixtures from DB (past + finished only)
// completed definition: fixture.complete === 1 (and optionally exclude live)
router.get('/db/completed', async (req, res) => {
  try {
    const query = {
      ...(req.query.type ? { type: req.query.type } : {}),
      complete: 1,
    };

    // Optional filters
    if (req.query.source) query.source = req.query.source;
    if (req.query.tournamentId) query.tournamentId = parseInt(req.query.tournamentId, 10);
    if (req.query.playerId) query.player1Id = parseInt(req.query.playerId, 10);

    // If you pass both player1Id and player2Id you can query both sides using $or, but keep it simple for now.
    if (req.query.playerId) {
      const pid = parseInt(req.query.playerId, 10);
      query.$or = [{ player1Id: pid }, { player2Id: pid }];
      delete query.player1Id;
    }

    if (req.query.start || req.query.end) {
      query.date = {};
      if (req.query.start) query.date.$gte = new Date(req.query.start);
      if (req.query.end) query.date.$lte = new Date(req.query.end);
    }

    const cacheKey = `tennis_fixtures_db_completed:${JSON.stringify(query)}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const fixtures = await getFixturesFromDB(query);
    const response = {
      success: true,
      query,
      count: fixtures.length,
      fixtures,
    };
    await setCache(cacheKey, response, 30 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching completed fixtures from DB:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch completed fixtures from DB',
    });
  }
});

// Get fixtures from DB (generic)
router.get('/db', async (req, res) => {
  try {
    const query = {};
    if (req.query.type) query.type = req.query.type;
    if (req.query.source) query.source = req.query.source;
    if (req.query.tournamentId) query.tournamentId = parseInt(req.query.tournamentId, 10);
    if (req.query.playerId) query.$or = [{ player1Id: parseInt(req.query.playerId, 10) }, { player2Id: parseInt(req.query.playerId, 10) }];
    if (req.query.complete !== undefined) query.complete = Number(req.query.complete);

    if (req.query.start || req.query.end) {
      query.date = {};
      if (req.query.start) query.date.$gte = new Date(req.query.start);
      if (req.query.end) query.date.$lte = new Date(req.query.end);
    }

    const cacheKey = `tennis_fixtures_db:${JSON.stringify(query)}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const fixtures = await getFixturesFromDB(query);
    const response = {
      success: true,
      query,
      count: fixtures.length,
      fixtures,
    };
    await setCache(cacheKey, response, 30 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching fixtures from DB:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch fixtures from DB',
    });
  }
});

module.exports = router;
