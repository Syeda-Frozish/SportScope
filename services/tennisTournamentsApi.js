const api = require('./tennisApi');
const TennisTournament = require('../models/tennisTournament');

const getTournamentCalendar = async (type = 'atp', year) => {
  try {
    const res = await api.get(`/${type}/tournament/calendar/${year}`);
    const tournaments = Array.isArray(res.data) ? res.data : res.data.data || [];

    // Save to DB
    for (const tournament of tournaments) {
      await TennisTournament.updateOne(
        { seasonId: tournament.id },
        {
          seasonId: tournament.id,
          link: tournament.link,
          type,
          name: tournament.name,
          date: new Date(tournament.date),
          site: tournament.site,
          countryAcr: tournament.countryAcr,
          courtId: tournament.courtId,
          court: tournament.court,
          rankId: tournament.rankId,
          rank: tournament.rank,
          prize: tournament.prize,
          draw_size: tournament.draw_size,
          entry: tournament.entry,
          race: tournament.race,
          tier: tournament.tier,
          url: tournament.url,
          latitude: tournament.latitude,
          longitude: tournament.longitude,
          lastUpdated: new Date(),
        },
        { upsert: true }
      );
    }

    return tournaments;
  } catch (error) {
    console.error('Error fetching tournament calendar:', error.message);
    throw error;
  }
};

const getTournamentInfo = async (type = 'atp', seasonId) => {
  try {
    const res = await api.get(`/${type}/tournament/info/${seasonId}`);
    const info = res.data;

    // Save to DB
    await TennisTournament.updateOne(
      { seasonId },
      {
        seasonId,
        type,
        name: info.name,
        date: new Date(info.date),
        prize: info.prize,
        info: {
          id: info.id,
          name: info.name,
          date: new Date(info.date),
          prize: info.prize,
          singlesPrize: info.singlesPrize,
          rating: info.rating,
        },
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    return info;
  } catch (error) {
    console.error('Error fetching tournament info:', error.message);
    throw error;
  }
};

const getTournamentSeasons = async (type = 'atp', seasonId) => {
  try {
    const res = await api.get(`/${type}/tournament/seasons/${seasonId}`);
    const data = res.data;
    const seasons = data.data || data;

    // Update tournament with seasons
    await TennisTournament.updateOne(
      { seasonId },
      {
        seasons: seasons.map(season => ({
          id: season.id,
          name: season.name,
          date: new Date(season.date),
        })),
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    return seasons;
  } catch (error) {
    console.error('Error fetching tournament seasons:', error.message);
    throw error;
  }
};

const getTournamentPastChampions = async (type = 'atp', seasonId) => {
  try {
    const res = await api.get(`/${type}/tournament/past-champtions/${seasonId}`);
    const data = res.data;
    const champions = data.data || data;

    // Update tournament with past champions
    await TennisTournament.updateOne(
      { seasonId },
      {
        pastChampions: {
          singles: champions.singles ? champions.singles.map(match => ({
            id: match.id,
            date: new Date(match.date),
            result: match.result,
            roundId: match.roundId,
            player1: match.player1,
            player2: match.player2,
            tournament: match.tournament,
          })) : [],
          doubles: champions.doubles ? champions.doubles.map(match => ({
            id: match.id,
            date: new Date(match.date),
            result: match.result,
            roundId: match.roundId,
            player1: match.player1,
            player2: match.player2,
            tournament: match.tournament,
          })) : [],
        },
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    return champions;
  } catch (error) {
    console.error('Error fetching tournament past champions:', error.message);
    throw error;
  }
};

const getTournamentResults = async (type = 'atp', seasonId) => {
  try {
    const res = await api.get(`/${type}/tournament/results/${seasonId}`);
    const results = res.data;

    // Update tournament with results
    await TennisTournament.updateOne(
      { seasonId },
      {
        results: {
          singles: results.data?.singles ? results.data.singles.map(match => ({
            id: match.id,
            date: new Date(match.date),
            result: match.result,
            roundId: match.roundId,
            round: match.round,
            player1Id: match.player1Id,
            player2Id: match.player2Id,
            player1: match.player1,
            player2: match.player2,
            tournament: match.tournament,
          })) : [],
          doubles: results.data?.doubles ? results.data.doubles.map(match => ({
            id: match.id,
            date: new Date(match.date),
            result: match.result,
            roundId: match.roundId,
            round: match.round,
            player1Id: match.player1Id,
            player2Id: match.player2Id,
            player1: match.player1,
            player2: match.player2,
            tournament: match.tournament,
          })) : [],
          qualifying: results.data?.qualifying ? results.data.qualifying.map(match => ({
            id: match.id,
            date: new Date(match.date),
            result: match.result,
            roundId: match.roundId,
            round: match.round,
            player1Id: match.player1Id,
            player2Id: match.player2Id,
            player1: match.player1,
            player2: match.player2,
            tournament: match.tournament,
          })) : [],
          doublesQualifying: results.data?.doublesQualifying ? results.data.doublesQualifying.map(match => ({
            id: match.id,
            date: new Date(match.date),
            result: match.result,
            roundId: match.roundId,
            round: match.round,
            player1Id: match.player1Id,
            player2Id: match.player2Id,
            player1: match.player1,
            player2: match.player2,
            tournament: match.tournament,
          })) : [],
        },
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    return results;
  } catch (error) {
    console.error('Error fetching tournament results:', error.message);
    throw error;
  }
};

const getTournamentFromDB = async (seasonId) => {
  try {
    return await TennisTournament.findOne({ seasonId });
  } catch (error) {
    console.error('Error fetching tournament from DB:', error.message);
    return null;
  }
};

const getTournamentsFromDB = async (query = {}) => {
  try {
    return await TennisTournament.find(query).sort({ date: -1 });
  } catch (error) {
    console.error('Error fetching tournaments from DB:', error.message);
    return [];
  }
};

module.exports = {
  getTournamentCalendar,
  getTournamentInfo,
  getTournamentSeasons,
  getTournamentPastChampions,
  getTournamentResults,
  getTournamentFromDB,
  getTournamentsFromDB,
};