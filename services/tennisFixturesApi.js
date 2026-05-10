const api = require('./tennisApi');
const TennisFixture = require('../models/tennisFixture');

const getTodayFixtures = async (type = 'atp') => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const res = await api.get(`/${type}/fixtures/${today}`);
    const fixtures = Array.isArray(res.data) ? res.data : res.data.data || [];




    // Save to DB
    for (const fixture of fixtures) {
      await TennisFixture.updateOne(
        { fixtureId: fixture.id },
        {
          fixtureId: fixture.id,
          type,
          date: new Date(fixture.date),
          timeGame: fixture.timeGame ? new Date(fixture.timeGame) : null,
          result: fixture.result || '',
          live: fixture.live,
          complete: fixture.complete,
          draw: fixture.draw,
          player1Id: fixture.player1Id,
          player2Id: fixture.player2Id,
          tournamentId: fixture.tournamentId,
          roundId: fixture.roundId,
          seed1: fixture.seed1,
          seed2: fixture.seed2,
          odd1: fixture.odd1,
          odd2: fixture.odd2,
          player1: fixture.player1,
          player2: fixture.player2,
          tournament: fixture.tournament,
          round: fixture.round,
          h2h: fixture.h2h,
          source: 'today',
          lastUpdated: new Date(),
        },
        { upsert: true }
      );
    }

    return fixtures;
  } catch (error) {
    console.error('Error fetching today fixtures:', error.message);
    throw error;
  }
};

const getFixturesByDate = async (type = 'atp', date) => {
  try {
    const res = await api.get(`/${type}/fixtures/${date}`);
    const fixtures = Array.isArray(res.data) ? res.data : res.data.data || [];



    // Save to DB
    for (const fixture of fixtures) {
      await TennisFixture.updateOne(
        { fixtureId: fixture.id },
        {
          fixtureId: fixture.id,
          type,
          date: new Date(fixture.date),
          timeGame: fixture.timeGame ? new Date(fixture.timeGame) : null,
          result: fixture.result || '',
          live: fixture.live,
          complete: fixture.complete,
          draw: fixture.draw,
          player1Id: fixture.player1Id,
          player2Id: fixture.player2Id,
          tournamentId: fixture.tournamentId,
          roundId: fixture.roundId,
          seed1: fixture.seed1,
          seed2: fixture.seed2,
          odd1: fixture.odd1,
          odd2: fixture.odd2,
          player1: fixture.player1,
          player2: fixture.player2,
          tournament: fixture.tournament,
          round: fixture.round,
          h2h: fixture.h2h,
          source: 'date',
          lastUpdated: new Date(),
        },
        { upsert: true }
      );
    }

    return fixtures;
  } catch (error) {
    console.error('Error fetching fixtures by date:', error.message);
    throw error;
  }
};

const getFixturesByDateRange = async (type = 'atp', startDate, endDate) => {
  try {
    const res = await api.get(`/${type}/fixtures`, { params: { startDate, endDate } });

    const fixtures = Array.isArray(res.data) ? res.data : res.data.data || [];



    // Save to DB
    for (const fixture of fixtures) {
      await TennisFixture.updateOne(
        { fixtureId: fixture.id },
        {
          fixtureId: fixture.id,
          type,
          date: new Date(fixture.date),
          timeGame: fixture.timeGame ? new Date(fixture.timeGame) : null,
          result: fixture.result || '',
          live: fixture.live,
          complete: fixture.complete,
          draw: fixture.draw,
          player1Id: fixture.player1Id,
          player2Id: fixture.player2Id,
          tournamentId: fixture.tournamentId,
          roundId: fixture.roundId,
          seed1: fixture.seed1,
          seed2: fixture.seed2,
          odd1: fixture.odd1,
          odd2: fixture.odd2,
          player1: fixture.player1,
          player2: fixture.player2,
          tournament: fixture.tournament,
          round: fixture.round,
          h2h: fixture.h2h,
          source: 'range',
          lastUpdated: new Date(),
        },
        { upsert: true }
      );
    }

    return fixtures;
  } catch (error) {
    console.error('Error fetching fixtures by date range:', error.message);
    throw error;
  }
};

const getFixturesByTournament = async (type = 'atp', tournamentId) => {
  try {
    const res = await api.get(`/${type}/fixtures`, { params: { tournamentId } });

    const fixtures = Array.isArray(res.data) ? res.data : res.data.data || [];


    // Save to DB
    for (const fixture of fixtures) {
      await TennisFixture.updateOne(
        { fixtureId: fixture.id },
        {
          fixtureId: fixture.id,
          type,
          date: new Date(fixture.date),
          timeGame: fixture.timeGame ? new Date(fixture.timeGame) : null,
          result: fixture.result || '',
          live: fixture.live,
          complete: fixture.complete,
          draw: fixture.draw,
          player1Id: fixture.player1Id,
          player2Id: fixture.player2Id,
          tournamentId: fixture.tournamentId,
          roundId: fixture.roundId,
          seed1: fixture.seed1,
          seed2: fixture.seed2,
          odd1: fixture.odd1,
          odd2: fixture.odd2,
          player1: fixture.player1,
          player2: fixture.player2,
          tournament: fixture.tournament,
          round: fixture.round,
          h2h: fixture.h2h,
          source: 'tournament',
          lastUpdated: new Date(),
        },
        { upsert: true }
      );
    }

    return fixtures;
  } catch (error) {
    console.error('Error fetching fixtures by tournament:', error.message);
    throw error;
  }
};

const getFixturesByPlayer = async (type = 'atp', playerId) => {
  try {
    const res = await api.get(`/${type}/fixtures`, { params: { playerId } });
    const fixtures = Array.isArray(res.data) ? res.data : res.data.data || [];


    // Save to DB
    for (const fixture of fixtures) {
      await TennisFixture.updateOne(
        { fixtureId: fixture.id },
        {
          fixtureId: fixture.id,
          type,
          date: new Date(fixture.date),
          timeGame: fixture.timeGame ? new Date(fixture.timeGame) : null,
          result: fixture.result || '',
          live: fixture.live,
          complete: fixture.complete,
          draw: fixture.draw,
          player1Id: fixture.player1Id,
          player2Id: fixture.player2Id,
          tournamentId: fixture.tournamentId,
          roundId: fixture.roundId,
          seed1: fixture.seed1,
          seed2: fixture.seed2,
          odd1: fixture.odd1,
          odd2: fixture.odd2,
          player1: fixture.player1,
          player2: fixture.player2,
          tournament: fixture.tournament,
          round: fixture.round,
          h2h: fixture.h2h,
          source: 'player',
          lastUpdated: new Date(),
        },
        { upsert: true }
      );
    }

    return fixtures;
  } catch (error) {
    console.error('Error fetching fixtures by player:', error.message);
    throw error;
  }
};

const getFixturesFromDB = async (query = {}) => {
  try {
    return await TennisFixture.find(query).sort({ date: 1 });
  } catch (error) {
    console.error('Error fetching fixtures from DB:', error.message);
    return [];
  }
};

module.exports = {
  getTodayFixtures,
  getFixturesByDate,
  getFixturesByDateRange,
  getFixturesByTournament,
  getFixturesByPlayer,
  getFixturesFromDB,
};