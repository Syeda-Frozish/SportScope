const mongoose = require('mongoose');

const tennisRankingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['atp', 'wta'],
    required: true,
  },
  category: {
    type: String,
    enum: ['singles', 'doubles', 'race'],
    required: true,
  },
  snapshotDate: {
    type: Date,
    default: Date.now,
  },
  data: [{
    id: Number,
    name: String,
    countryAcr: String,
    currentRank: Number,
    points: Number,
    progress: Number,
    ch: Number,
    hardPoints: Number,
    hardTournament: Number,
    ihardPoints: Number,
    ihardTournament: Number,
    clayPoints: Number,
    clayTournament: Number,
    grassPoints: Number,
    grassTournament: Number,
    carpetPoints: Number,
    carterTournament: Number,
    doublesPosition: Number,
    doublesPoints: Number,
    doublesProgress: Number,
    prize: Number,
    itf: Number,
    racePosition: Number,
    racePoints: Number,
    player: {
      id: Number,
      name: String,
      countryAcr: String,
      country: {
        name: String,
      },
    },
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('TennisRanking', tennisRankingSchema);