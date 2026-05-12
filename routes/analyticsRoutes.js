const express = require('express');
const router = express.Router();
const {
  getCricketTeamMatchCounts,
  getCricketRecentMatches,
  getCricketPlayersByCountry,
  getTennisTopRankedPlayers,
  getTennisTopTournaments,
  getTennisLatestRankings,
} = require('../services/analyticsService');

router.get('/cricket/top-teams', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
    const teams = await getCricketTeamMatchCounts(limit);
    res.json({ success: true, teams });
  } catch (err) {
    console.error('Error fetching cricket top teams:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch cricket top teams' });
  }
});

router.get('/cricket/recent-matches', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
    const matches = await getCricketRecentMatches(limit);
    res.json({ success: true, count: matches.length, matches });
  } catch (err) {
    console.error('Error fetching recent cricket matches:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch recent cricket matches' });
  }
});

router.get('/cricket/players-by-country', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
    const countries = await getCricketPlayersByCountry(limit);
    res.json({ success: true, countries });
  } catch (err) {
    console.error('Error fetching cricket players by country:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch cricket players by country' });
  }
});

router.get('/tennis/top-ranked', async (req, res) => {
  try {
    const type = req.query.type || 'atp';
    const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
    const players = await getTennisTopRankedPlayers(type, limit);
    res.json({ success: true, type, count: players.length, players });
  } catch (err) {
    console.error('Error fetching tennis top ranked players:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch tennis top ranked players' });
  }
});

router.get('/tennis/top-ranked/:type', async (req, res) => {
  try {
    const type = req.params.type || 'atp';
    const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
    const players = await getTennisTopRankedPlayers(type, limit);
    res.json({ success: true, type, count: players.length, players });
  } catch (err) {
    console.error('Error fetching tennis top ranked players:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch tennis top ranked players' });
  }
});

router.get('/tennis/top-tournaments', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
    const tournaments = await getTennisTopTournaments(limit);
    res.json({ success: true, tournaments });
  } catch (err) {
    console.error('Error fetching tennis top tournaments:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch tennis top tournaments' });
  }
});

router.get('/tennis/latest-rankings/:type/:category', async (req, res) => {
  try {
    const { type, category } = req.params;
    const rankings = await getTennisLatestRankings(type, category);
    if (!rankings) {
      return res.status(404).json({ error: 'Rankings not found' });
    }
    res.json({ success: true, type, category, rankings });
  } catch (err) {
    console.error('Error fetching latest tennis rankings:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch latest tennis rankings' });
  }
});

module.exports = router;