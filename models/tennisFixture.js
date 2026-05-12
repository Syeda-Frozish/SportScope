const mongoose = require('mongoose');

const tennisFixtureSchema = new mongoose.Schema({
  fixtureId: {
    type: Number,
    unique: true,
    required: true,
  },
  type: {
    type: String,
    enum: ['atp', 'wta'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeGame: Date,
  result: {
    type: String,
    default: '',
  },
  live: String,
  complete: Number,
  draw: Number,
  player1Id: Number,
  player2Id: Number,
  tournamentId: Number,
  roundId: Number,
  seed1: String,
  seed2: String,
  odd1: String,
  odd2: String,
  player1: {
    id: Number,
    name: String,
    countryAcr: String,
  },
  player2: {
    id: Number,
    name: String,
    countryAcr: String,
  },
  tournament: {
    id: Number,
    name: String,
    courtId: Number,
    court: {
      id: Number,
      name: String,
    },
    rankId: Number,
    rank: {
      id: Number,
      name: String,
    },
  },
  round: {
    id: Number,
    name: String,
  },
  h2h: {
    player1AllWins: Number,
    player2AllWins: Number,
  },
  source: {
    type: String,
    enum: ['today', 'date', 'range', 'tournament', 'player'],
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});


tennisFixtureSchema.index({ type: 1, date: -1 });
tennisFixtureSchema.index({ player1Id: 1 });
tennisFixtureSchema.index({ player2Id: 1 });
tennisFixtureSchema.index({ tournamentId: 1 });
tennisFixtureSchema.index({ source: 1 });

module.exports = mongoose.model('TennisFixture', tennisFixtureSchema);