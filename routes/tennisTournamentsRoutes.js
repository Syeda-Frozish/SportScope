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

// Tournament calendar
router.get('/calendar/:year', async (req, res) => {
  try {
    const { year } = req.params;
    const type = req.query.type || 'atp';
    const tournaments = await getTournamentCalendar(type, year);
    res.json({
      success: true,
      type,
      year,
      count: tournaments.length,
      tournaments,
    });
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
    const info = await getTournamentInfo(type, seasonId);
    res.json({
      success: true,
      type,
      seasonId,
      info,
    });
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
    const seasons = await getTournamentSeasons(type, seasonId);
    res.json({
      success: true,
      type,
      seasonId,
      count: seasons.length,
      seasons,
    });
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
    const champions = await getTournamentPastChampions(type, seasonId);
    res.json({
      success: true,
      type,
      seasonId,
      champions,
    });
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
    const results = await getTournamentResults(type, seasonId);
    res.json({
      success: true,
      type,
      seasonId,
      results,
    });
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
    const tournament = await getTournamentFromDB(seasonId);
    if (!tournament) {
      return res.status(404).json({
        error: 'Tournament not found in database',
      });
    }
    res.json({
      success: true,
      seasonId,
      tournament,
    });
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

    const tournaments = await getTournamentsFromDB(query);
    res.json({
      success: true,
      query,
      count: tournaments.length,
      tournaments,
    });
  } catch (err) {
    console.error('Error fetching tournaments from DB:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch tournaments from DB',
    });
  }
});

module.exports = router;