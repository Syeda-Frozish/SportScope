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
const { getCache, setCache } = require('../utils/cacheClient');

// Search players
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    console.log('[tennisPlayers] SEARCH route hit query=', query);
    const type = req.query.type || 'atp';
    const cacheKey = `tennis_players_search:${type}:${query}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const marker = { route: 'tennisPlayers.search', query };
    const results = await searchPlayers(query, type);
    const response = {
      success: true,
      ...marker,
      type,
      results,
    };
    await setCache(cacheKey, response, 30 * 60 * 1000);
    res.json(response);
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
    const cacheKey = `tennis_player_profile:${type}:${playerId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const profile = await getPlayerProfile(type, playerId);
    const response = {
      success: true,
      type,
      playerId,
      profile,
    };
    await setCache(cacheKey, response, 60 * 60 * 1000);
    res.json(response);
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
    const cacheKey = `tennis_player_matches:${type}:${playerId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const matches = await getPlayerPastMatches(type, playerId);
    const response = {
      success: true,
      type,
      playerId,
      count: matches.length,
      matches,
    };
    await setCache(cacheKey, response, 30 * 60 * 1000);
    res.json(response);
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
    const cacheKey = `tennis_player_stats:${type}:${playerId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const stats = await getPlayerMatchStats(type, playerId);
    const response = {
      success: true,
      type,
      playerId,
      stats,
    };
    await setCache(cacheKey, response, 30 * 60 * 1000);
    res.json(response);
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
    const cacheKey = `tennis_player_surface:${type}:${playerId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const summary = await getPlayerSurfaceSummary(type, playerId);
    const response = {
      success: true,
      type,
      playerId,
      summary,
    };
    await setCache(cacheKey, response, 30 * 60 * 1000);
    res.json(response);
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
    const cacheKey = `tennis_player_titles:${type}:${playerId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const titles = await getPlayerTitles(type, playerId);
    const response = {
      success: true,
      type,
      playerId,
      titles,
    };
    await setCache(cacheKey, response, 60 * 60 * 1000);
    res.json(response);
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
    const cacheKey = `tennis_player_finals:${type}:${playerId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const finals = await getPlayerFinals(type, playerId);
    const response = {
      success: true,
      type,
      playerId,
      count: finals.length,
      finals,
    };
    await setCache(cacheKey, response, 60 * 60 * 1000);
    res.json(response);
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
    const cacheKey = `tennis_player_tournament_record:${type}:${playerId}:${tournamentId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const records = await getPlayerTournamentRecord(type, playerId, tournamentId);
    const response = {
      success: true,
      type,
      playerId,
      tournamentId,
      records,
    };
    await setCache(cacheKey, response, 60 * 60 * 1000);
    res.json(response);
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
    const cacheKey = `tennis_player_db:${type}:${playerId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const player = await getPlayerFromDB(playerId, type);
    if (!player) {
      return res.status(404).json({
        error: 'Player not found in database',
      });
    }
    const response = {
      success: true,
      type,
      playerId,
      player,
    };
    await setCache(cacheKey, response, 60 * 60 * 1000);
    res.json(response);
  } catch (err) {
    console.error('Error fetching player from DB:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch player from DB',
    });
  }
});

module.exports = router;