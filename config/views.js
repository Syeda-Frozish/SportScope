const createDatabaseViews = async (db) => {
  try {
    const existingTennisView = await db.listCollections({ name: 'tennisTopPlayersView' }).next();
    if (!existingTennisView) {
      await db.createCollection('tennisTopPlayersView', {
        viewOn: 'tennisplayers',
        pipeline: [
          { $match: { currentRank: { $gt: 0 } } },
          { $project: { playerId: 1, type: 1, name: 1, currentRank: 1, points: 1, countryAcr: 1, lastUpdated: 1 } },
          { $sort: { currentRank: 1 } },
        ],
      });
      console.log('Created tennisTopPlayersView');
    }

    const existingCricketView = await db.listCollections({ name: 'cricketTeamSummaryView' }).next();
    if (!existingCricketView) {
      await db.createCollection('cricketTeamSummaryView', {
        viewOn: 'matches',
        pipeline: [
          { $project: { teams: ['$teamA.name', '$teamB.name'], date: 1, seriesId: 1 } },
          { $unwind: '$teams' },
          { $group: { _id: '$teams', totalMatches: { $sum: 1 }, lastMatchDate: { $max: '$date' } } },
          { $sort: { totalMatches: -1 } },
        ],
      });
      console.log('Created cricketTeamSummaryView');
    }
  } catch (error) {
    console.error('Error creating database views:', error.message);
  }
};

module.exports = { createDatabaseViews };