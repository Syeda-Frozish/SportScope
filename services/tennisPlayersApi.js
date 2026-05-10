const api = require('./tennisApi');
const TennisPlayer = require('../models/tennisPlayer');

const normalizeType = (type) => {
  if (type === 'men') return 'atp';
  if (type === 'women') return 'wta';
  return type;
};

const getPlayerProfile = async (type = 'atp', playerId) => {
  try {
    const res = await api.get(`/${type}/player/profile/${playerId}`);
    // API shape is typically: { data: { ...playerFields } }
    const payload = res?.data?.data ? res.data.data : res?.data;
    const profile = payload || {};
    const info = profile.information || {};

    // Save to DB
    await TennisPlayer.updateOne(
      { playerId, type },
      {
        playerId,
        type,
        name: profile.name || '' ,
        birthday: profile.birthday ? new Date(profile.birthday) : null,
        countryAcr: profile.countryAcr || profile.country?.acronym || null,
        height: info.height || profile.height || null,
        // Current rank / points etc are often not present in this endpoint response.
        currentRank: profile.currentRank ?? null,
        progress: profile.progress ?? null,
        points: profile.points ?? null,
        ch: profile.ch ?? null,
        hardPoints: profile.hardPoints ?? null,
        hardTournament: profile.hardTournament ?? null,
        ihardPoints: profile.ihardPoints ?? null,
        ihardTournament: profile.ihardTournament ?? null,
        clayPoints: profile.clayPoints ?? null,
        clayTournament: profile.clayTournament ?? null,
        grassPoints: profile.grassPoints ?? null,
        grassTournament: profile.grassTournament ?? null,
        carpetPoints: profile.carpetPoints ?? null,
        carterTournament: profile.carterTournament ?? null,
        doublesPosition: profile.doublesPosition ?? null,
        doublesPoints: profile.doublesPoints ?? null,
        doublesProgress: profile.doublesProgress ?? null,
        prize: profile.prize ?? null,
        itf: profile.itf ?? null,
        ep: {
          turnedPro: info.turnedPro ?? null,
          plays: info.plays ?? null,
          coach: info.coach ?? null,
          birthplace: info.birthplace ?? null,
          residence: info.residence ?? null,
          weight: info.weight ?? null,
          playerStatus: profile.playerStatus ?? null,
          twitter: null,
          instagram: null,
          facebook: null,
          site: null,
          page: null,
          last_revised: null,
        },
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    return profile;
  } catch (error) {
    console.error('Error fetching player profile:', error.message);
    throw error;
  }
};

const getPlayerPastMatches = async (type = 'atp', playerId) => {
  type = normalizeType(type);

  try {
    const res = await api.get(`/${type}/player/past-matches/${playerId}`);
    const data = res.data;
    const matches = Array.isArray(data) ? data : data.data || [];

    // Update player with past matches
    await TennisPlayer.updateOne(
      { playerId, type },
      {
        pastMatches: matches.map(match => ({
          id: match.id,
          date: new Date(match.date),
          result: match.result,
          best_of: match.best_of,
          odd1: match.odd1,
          odd2: match.odd2,
          player1Id: match.player1Id,
          player2Id: match.player2Id,
          tournamentId: match.tournamentId,
          roundId: match.roundId,
          player1: match.player1,
          player2: match.player2,
          tournament: match.tournament,
        })),
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    return matches;
  } catch (error) {
    console.error('Error fetching player past matches:', error.message);
    throw error;
  }
};

const getPlayerMatchStats = async (type = 'atp', playerId) => {
  type = normalizeType(type);

  try {
    const res = await api.get(`/${type}/player/match-stats/${playerId}`);
    const data = res.data;
    const stats = data.data || data;

    // Update player with match stats
    await TennisPlayer.updateOne(
      { playerId, type },
      {
        matchStats: stats,
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    return stats;
  } catch (error) {
    console.error('Error fetching player match stats:', error.message);
    throw error;
  }
};

const getPlayerSurfaceSummary = async (type = 'atp', playerId) => {
  type = normalizeType(type);

  try {
    const res = await api.get(`/${type}/player/surface-summary/${playerId}`);
    const data = res.data;
    const summary = data.data || data;

    // Update player with surface summary
    await TennisPlayer.updateOne(
      { playerId, type },
      {
        surfaceSummary: summary,
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    return summary;
  } catch (error) {
    console.error('Error fetching player surface summary:', error.message);
    throw error;
  }
};

const getPlayerTitles = async (type = 'atp', playerId) => {
  type = normalizeType(type);

  try {
    const res = await api.get(`/${type}/player/titles/${playerId}`);
    const data = res.data;
    const titles = data.data || data;

    // Update player with titles
    await TennisPlayer.updateOne(
      { playerId, type },
      {
        titles: titles,
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    return titles;
  } catch (error) {
    console.error('Error fetching player titles:', error.message);
    throw error;
  }
};

const getPlayerFinals = async (type = 'atp', playerId) => {
  type = normalizeType(type);

  try {
    const res = await api.get(`/${type}/player/finals/${playerId}`);
    const data = res.data;
    const finals = data.data || data;

    // Update player with finals
    await TennisPlayer.updateOne(
      { playerId, type },
      {
        finals: finals.map(final => ({
          id: final.id,
          date: new Date(final.date),
          result: final.result,
          roundId: final.roundId,
          player1: final.player1,
          player2: final.player2,
          tournament: final.tournament,
        })),
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    return finals;
  } catch (error) {
    console.error('Error fetching player finals:', error.message);
    throw error;
  }
};

const getPlayerTournamentRecord = async (type = 'atp', playerId, tournamentId) => {
  type = normalizeType(type);

  try {
    const res = await api.get(`/${type}/player/tournament-record/${playerId}/${tournamentId}`);
    const data = res.data;
    const recordsRaw = data.data || data;
    const records = Array.isArray(recordsRaw) ? recordsRaw : (recordsRaw ? [recordsRaw] : []);

    // Update player with tournament records
    await TennisPlayer.updateOne(
      { playerId, type },
      {
        $push: { tournamentRecords: { $each: records } },
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    return records;
  } catch (error) {
    console.error('Error fetching player tournament record:', error.message);
    throw error;
  }
};

const getPlayerFromDB = async (playerId, type) => {
  type = normalizeType(type);

  try {
    return await TennisPlayer.findOne({ playerId, type });
  } catch (error) {
    console.error('Error fetching player from DB:', error.message);
    return null;
  }
};

const searchPlayers = async (query = '', type = 'atp', limit = 20) => {
  type = normalizeType(type);

  const q = (query || '').trim();
  if (!q) return [];

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

  // 1. Search in explicitly saved players
  const playerResultsRaw = await TennisPlayer.find({ type, name: { $regex: regex } })
    .limit(limit)
    .select({ playerId: 1, name: 1, countryAcr: 1, currentRank: 1, points: 1 })
    .sort({ currentRank: 1 })
    .lean();

  const playerResults = playerResultsRaw.map(p => ({
    ...p,
    id: p.playerId
  }));

  // 2. Search within the Rankings data if we don't have enough results
  let rankingResults = [];
  if (playerResults.length < limit) {
    const TennisRanking = require('../models/tennisRanking');
    const rankingDoc = await TennisRanking.findOne({ type, category: 'singles' }).sort({ snapshotDate: -1 });
    
    if (rankingDoc && Array.isArray(rankingDoc.data)) {
      const filtered = rankingDoc.data.filter(item => item.player && regex.test(item.player.name));
      rankingResults = filtered.map(item => ({
        id: item.player.id,
        playerId: item.player.id,
        name: item.player.name,
        countryAcr: item.player.countryAcr || item.player.country?.acronym,
        currentRank: item.position || item.rank,
        points: item.pts || item.points || item.point
      }));
    }
  }

  // Merge and deduplicate
  const merged = [...playerResults, ...rankingResults];
  const uniquePlayers = [];
  const seenIds = new Set();
  
  for (const p of merged) {
    if (!seenIds.has(p.playerId)) {
      seenIds.add(p.playerId);
      uniquePlayers.push(p);
    }
  }

  return uniquePlayers.slice(0, limit);
};

module.exports = {
  getPlayerProfile,
  getPlayerPastMatches,
  getPlayerMatchStats,
  getPlayerSurfaceSummary,
  getPlayerTitles,
  getPlayerFinals,
  getPlayerTournamentRecord,
  getPlayerFromDB,
  searchPlayers,
};