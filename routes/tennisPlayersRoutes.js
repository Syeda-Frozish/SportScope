const express = require('express');
const router = express.Router();

const {
  getPlayerProfile,
  getPlayerPastMatches,
  getPlayerMatchStats,
  getPlayerSurfaceSummary,
  getPlayerTitles,
  getPlayerFinals,
  getPlayerTournamentRecord,
  getPlayerFromDB,
  searchPlayers,
} = require('../services/tennisPlayersApi');

// Search players
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    console.log('[tennisPlayers] SEARCH route hit query=', query);
    // temporary debug marker
    const marker = { route: 'tennisPlayers.search', query };
    const type = req.query.type || 'atp';
    const results = await searchPlayers(query, type);
    res.json({
      success: true,
      ...marker,
      type,
      results,
    });
  } catch (err) {
    console.error('Error searching players:', err);
    res.status(500).json({
      error: err.message || 'Failed to search players',
    });
  }
});

// Player profile
router.get('/:type/:playerId', async (req, res) => {
  try {
    const { type, playerId } = req.params;
    console.log('[tennisPlayers] PROFILE route hit type=', type, 'playerId=', playerId);
    const profile = await getPlayerProfile(type, playerId);
    res.json({
      success: true,
      type,
      playerId,
      profile,
    });
  } catch (err) {
    console.error('Error fetching player profile:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch player profile',
    });
  }
});

// Player past matches
router.get('/:type/:playerId/matches', async (req, res) => {
  try {
    const { type, playerId } = req.params;
    const matches = await getPlayerPastMatches(type, playerId);
    res.json({
      success: true,
      type,
      playerId,
      count: matches.length,
      matches,
    });
  } catch (err) {
    console.error('Error fetching player past matches:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch player past matches',
    });
  }
});

// Player match stats
router.get('/:type/:playerId/stats', async (req, res) => {
  try {
    const { type, playerId } = req.params;
    const stats = await getPlayerMatchStats(type, playerId);
    res.json({
      success: true,
      type,
      playerId,
      stats,
    });
  } catch (err) {
    console.error('Error fetching player match stats:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch player match stats',
    });
  }
});

// Player surface summary
router.get('/:type/:playerId/surface', async (req, res) => {
  try {
    const { type, playerId } = req.params;
    const summary = await getPlayerSurfaceSummary(type, playerId);
    res.json({
      success: true,
      type,
      playerId,
      summary,
    });
  } catch (err) {
    console.error('Error fetching player surface summary:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch player surface summary',
    });
  }
});

// Player titles
router.get('/:type/:playerId/titles', async (req, res) => {
  try {
    const { type, playerId } = req.params;
    const titles = await getPlayerTitles(type, playerId);
    res.json({
      success: true,
      type,
      playerId,
      titles,
    });
  } catch (err) {
    console.error('Error fetching player titles:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch player titles',
    });
  }
});

// Player finals
router.get('/:type/:playerId/finals', async (req, res) => {
  try {
    const { type, playerId } = req.params;
    const finals = await getPlayerFinals(type, playerId);
    res.json({
      success: true,
      type,
      playerId,
      count: finals.length,
      finals,
    });
  } catch (err) {
    console.error('Error fetching player finals:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch player finals',
    });
  }
});

// Player tournament record
router.get('/:type/:playerId/tournament-record/:tournamentId', async (req, res) => {
  try {
    const { type, playerId, tournamentId } = req.params;
    const records = await getPlayerTournamentRecord(type, playerId, tournamentId);
    res.json({
      success: true,
      type,
      playerId,
      tournamentId,
      records,
    });
  } catch (err) {
    console.error('Error fetching player tournament record:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch player tournament record',
    });
  }
});

// Get player from DB
router.get('/:type/:playerId/db', async (req, res) => {
  try {
    const { type, playerId } = req.params;
    const player = await getPlayerFromDB(playerId, type);
    if (!player) {
      return res.status(404).json({
        error: 'Player not found in database',
      });
    }
    res.json({
      success: true,
      type,
      playerId,
      player,
    });
  } catch (err) {
    console.error('Error fetching player from DB:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch player from DB',
    });
  }
});

module.exports = router;