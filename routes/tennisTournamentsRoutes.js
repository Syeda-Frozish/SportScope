const express = require('express');
const router = express.Router();

const {
  getTournamentCalendar,
  getTournamentInfo,
  getTournamentSeasons,
  getTournamentPastChampions,
  getTournamentResults,
  getTournamentFromDB,
  getTournamentsFromDB,
} = require('../services/tennisTournamentsApi');
const { getCache, setCache } = require('../utils/cacheClient');

// Tournament calendar
router.get('/calendar/:year', async (req, res) => {
  try {
    const { year } = req.params;
    const type = req.query.type || 'atp';
    const cacheKey = `tennis_tournaments_calendar:${type}:${year}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const tournaments = await getTournamentCalendar(type, year);
    const response = {
      success: true,
      type,
      year,
      count: tournaments.length,
      tournaments,
    };
    await setCache(cacheKey, response, 6 * 60 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching tournament calendar:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch tournament calendar',
    });
  }
});

// Tournament info
router.get('/info/:seasonId', async (req, res) => {
  try {
    const { seasonId } = req.params;
    const type = req.query.type || 'atp';
    const cacheKey = `tennis_tournaments_info:${type}:${seasonId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const info = await getTournamentInfo(type, seasonId);
    const response = {
      success: true,
      type,
      seasonId,
      info,
    };
    await setCache(cacheKey, response, 6 * 60 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching tournament info:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch tournament info',
    });
  }
});

// Tournament seasons
router.get('/seasons/:seasonId', async (req, res) => {
  try {
    const { seasonId } = req.params;
    const type = req.query.type || 'atp';
    const cacheKey = `tennis_tournaments_seasons:${type}:${seasonId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const seasons = await getTournamentSeasons(type, seasonId);
    const response = {
      success: true,
      type,
      seasonId,
      count: seasons.length,
      seasons,
    };
    await setCache(cacheKey, response, 6 * 60 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching tournament seasons:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch tournament seasons',
    });
  }
});

// Tournament past champions
router.get('/past-champions/:seasonId', async (req, res) => {
  try {
    const { seasonId } = req.params;
    const type = req.query.type || 'atp';
    const cacheKey = `tennis_tournaments_past_champions:${type}:${seasonId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const champions = await getTournamentPastChampions(type, seasonId);
    const response = {
      success: true,
      type,
      seasonId,
      champions,
    };
    await setCache(cacheKey, response, 12 * 60 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching tournament past champions:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch tournament past champions',
    });
  }
});

// Tournament results
router.get('/results/:seasonId', async (req, res) => {
  try {
    const { seasonId } = req.params;
    const type = req.query.type || 'atp';
    const cacheKey = `tennis_tournaments_results:${type}:${seasonId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const results = await getTournamentResults(type, seasonId);
    const response = {
      success: true,
      type,
      seasonId,
      results,
    };
    await setCache(cacheKey, response, 12 * 60 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching tournament results:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch tournament results',
    });
  }
});

// Get tournament from DB
router.get('/:seasonId/db', async (req, res) => {
  try {
    const { seasonId } = req.params;
    const cacheKey = `tennis_tournaments_db:${seasonId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const tournament = await getTournamentFromDB(seasonId);
    if (!tournament) {
      return res.status(404).json({
        error: 'Tournament not found in database',
      });
    }
    const response = {
      success: true,
      seasonId,
      tournament,
    };
    await setCache(cacheKey, response, 60 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching tournament from DB:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch tournament from DB',
    });
  }
});

// Get tournaments from DB
router.get('/db', async (req, res) => {
  try {
    const query = {};
    if (req.query.type) query.type = req.query.type;
    if (req.query.year) {
      const year = parseInt(req.query.year);
      query.date = {
        $gte: new Date(`${year}-01-01`),
        $lt: new Date(`${year + 1}-01-01`),
      };
    }

    const cacheKey = `tennis_tournaments_db:${JSON.stringify(query)}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const tournaments = await getTournamentsFromDB(query);
    const response = {
      success: true,
      query,
      count: tournaments.length,
      tournaments,
    };
    await setCache(cacheKey, response, 60 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching tournaments from DB:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch tournaments from DB',
    });
  }
});

module.exports = router;