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

const {
  getPlayerFromDB,
  searchPlayers,
} = require('../services/tennisPlayersApi');

const {
  getTournamentCalendar,
  getTournamentFromDB,
  getTournamentsFromDB,
} = require('../services/tennisTournamentsApi');

const {
  getSinglesRankings,
  getDoublesRankings,
  getRaceRankings,
  getAllRankingsFromDB,
} = require('../services/tennisRankingsApi');

// Basic health / connectivity check for the tennis services layer
router.get('/health', async (req, res) => {
  res.json({
    success: true,
    service: 'tennisDebugRoutes',
    time: new Date().toISOString(),
  });
});

// Live fetch tests (will hit RapidAPI through the tennis services)
router.get('/fixtures/today', async (req, res) => {
  try {
    const type = req.query.type || 'atp';
    const fixtures = await getTodayFixtures(type);
    res.json({ success: true, type, count: fixtures.length, fixtures });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch fixtures today' });
  }
});

router.get('/rankings/singles', async (req, res) => {
  try {
    const type = req.query.type || 'atp';
    const rankings = await getSinglesRankings(type);
    res.json({ success: true, type, category: 'singles', count: rankings.length, rankings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch singles rankings' });
  }
});

router.get('/rankings/doubles', async (req, res) => {
  try {
    const type = req.query.type || 'atp';
    const rankings = await getDoublesRankings(type);
    res.json({ success: true, type, category: 'doubles', count: rankings.length, rankings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch doubles rankings' });
  }
});

router.get('/rankings/race', async (req, res) => {
  try {
    const type = req.query.type || 'atp';
    const rankings = await getRaceRankings(type);
    res.json({ success: true, type, category: 'race', count: rankings.length, rankings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch race rankings' });
  }
});

// DB-only tests (does not hit RapidAPI)
router.get('/db/fixtures', async (req, res) => {
  try {
    const query = {};
    if (req.query.type) query.type = req.query.type;
    if (req.query.source) query.source = req.query.source;
    if (req.query.tournamentId) query.tournamentId = parseInt(req.query.tournamentId);
    if (req.query.playerId) query.playerId = parseInt(req.query.playerId);

    const fixtures = await getFixturesFromDB(query);
    res.json({ success: true, query, count: fixtures.length, fixtures });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch fixtures from DB' });
  }
});

router.get('/db/tournaments', async (req, res) => {
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
    res.json({ success: true, query, count: tournaments.length, tournaments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch tournaments from DB' });
  }
});

router.get('/db/player/:type/:playerId', async (req, res) => {
  try {
    const { type, playerId } = req.params;
    const player = await getPlayerFromDB(parseInt(playerId), type);
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found in database' });
    }
    res.json({ success: true, type, playerId, player });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch player from DB' });
  }
});

router.get('/db/player-search/:query', async (req, res) => {
  try {
    const type = req.query.type || 'atp';
    const query = req.params.query;
    const results = await searchPlayers(query, type);
    res.json({ success: true, type, query, count: results.length, results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to search players in DB' });
  }
});

// DB rankings quick check
router.get('/db/rankings', async (req, res) => {
  try {
    const type = req.query.type || 'atp';
    const rankings = await getAllRankingsFromDB(type);
    res.json({ success: true, type, rankings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch rankings from DB' });
  }
});

module.exports = router;

