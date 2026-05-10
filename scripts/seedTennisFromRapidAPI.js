/*
  Seed Tennis data from RapidAPI into MongoDB.

  What it does (for a given type=atp|wta):
  - Fetch and store rankings: singles, doubles, race
  - Fetch and store fixtures (today, range, tournament, player optional)
  - Fetch and store tournaments (calendar for a year)
  - (Optional) Fetch and store player profiles discovered from ranking players

  Usage:
    node scripts/seedTennisFromRapidAPI.js --type=atp --year=2026 --rangeDays=7

  Env vars:
    - RAPIDAPI_TENNIS_KEY
    - MONGODB_URI (or whatever config/db.js uses)
*/

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const {
  getSinglesRankings,
  getDoublesRankings,
  getRaceRankings,
} = require('../services/tennisRankings');

const {
  getTodayFixtures,
  getFixturesByDateRange,
} = require('../services/tennisFixtures');

const {
  getTournamentCalendar,
} = require('../services/tennisTournaments');

const { getPlayerProfile } = require('../services/tennisPlayers');

const TennisPlayer = require('../models/tennisPlayer');
const TennisRanking = require('../models/tennisRanking');
const TennisFixture = require('../models/tennisFixture');
const TennisTournament = require('../models/tennisTournament');

function getArg(name, fallback) {
  const v = process.argv.find(a => a.startsWith(`--${name}=`));
  if (!v) return fallback;
  return v.split('=')[1];
}

async function main() {
  const type = getArg('type', 'atp');
  const year = parseInt(getArg('year', `${new Date().getFullYear()}`), 10);
  const rangeDays = parseInt(getArg('rangeDays', '7'), 10);
  const seedPlayersFromRankings = (getArg('seedPlayers', 'true') || 'true').toLowerCase() === 'true';

  if (!['atp', 'wta'].includes(type)) {
    console.error('Invalid --type. Must be atp or wta');
    process.exit(1);
  }

  console.log(`[seedTennis] type=${type}, year=${year}, rangeDays=${rangeDays}, seedPlayersFromRankings=${seedPlayersFromRankings}`);

  // Connect DB using same URI config as app.
  // If your project uses a different env var name, ensure config/db.js uses it.
  // We'll try to reuse MONGODB_URI if present.
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI env var. config/db.js may use a different var name; update script accordingly.');
    process.exit(1);
  }

  await mongoose.connect(uri);

  // Rankings: these services already upsert into TennisRanking collection.
  // We'll also seed players by calling getPlayerProfile for ranking players if enabled.
  console.log('[seedTennis] Fetching rankings...');
  const [singles, doubles, race] = await Promise.all([
    getSinglesRankings(type),
    getDoublesRankings(type),
    getRaceRankings(type),
  ]);

  console.log(`[seedTennis] rankings fetched: singles=${singles.length}, doubles=${doubles.length}, race=${race.length}`);

  if (seedPlayersFromRankings) {
    console.log('[seedTennis] Seeding players from ranking player lists...');

    const extractPlayerIds = (arr) => {
      // Each element generally has shape: { player: { id, name, countryAcr }, ... }
      const ids = new Set();
      for (const r of (arr || [])) {
        const pid = r?.player?.id;
        if (typeof pid === 'number') ids.add(pid);
      }
      return [...ids];
    };

    const playerIds = new Set([
      ...extractPlayerIds(singles),
      ...extractPlayerIds(doubles),
      ...extractPlayerIds(race),
    ]);

    const ids = [...playerIds];
    console.log(`[seedTennis] unique playerIds=${ids.length}`);

    // Throttle to avoid too many requests at once.
    const concurrency = parseInt(getArg('concurrency', '3'), 10);
    let idx = 0;

    async function worker() {
      while (idx < ids.length) {
        const myIndex = idx++;
        const playerId = ids[myIndex];
        try {
          await getPlayerProfile(type, playerId);
        } catch (e) {
          console.error(`[seedTennis] player profile failed type=${type} playerId=${playerId}:`, e.message);
        }
      }
    }

    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);
  }

  // Fixtures: these services upsert into TennisFixture.
  console.log('[seedTennis] Fetching fixtures...');
  await getTodayFixtures(type);

  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + rangeDays);

  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);

  await getFixturesByDateRange(type, startStr, endStr);
  console.log('[seedTennis] fixtures fetched');

  // Tournaments: calendar for the year.
  console.log('[seedTennis] Fetching tournaments calendar...');
  await getTournamentCalendar(type, String(year));

  console.log('[seedTennis] Done.');

  // Quick summary counts (best-effort)
  const [pCount, rCount, fCount, tCount] = await Promise.all([
    TennisPlayer.countDocuments({ type }),
    TennisRanking.countDocuments({ type }),
    TennisFixture.countDocuments({ type }),
    TennisTournament.countDocuments({ type }),
  ]);

  console.log(`[seedTennis] DB counts: players=${pCount}, rankings=${rCount}, fixtures=${fCount}, tournaments=${tCount}`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('[seedTennis] fatal:', err);
  process.exit(1);
});

