const mongoose = require('mongoose');

const tennisTournamentSchema = new mongoose.Schema({
  seasonId: {
    type: Number,
    unique: true,
    required: true,
  },
  link: Number,
  type: {
    type: String,
    enum: ['atp', 'wta'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: Date,
  site: String,
  countryAcr: String,
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
  prize: String,
  draw_size: Number,
  entry: Number,
  race: Number,
  tier: String,
  url: String,
  latitude: Number,
  longitude: Number,
  info: {
    id: Number,
    name: String,
    date: Date,
    prize: String,
    singlesPrize: {
      winner: Number,
      finalist: Number,
      semiFinalist: Number,
      quarterFinalist: Number,
      fourth: Number,
      third: Number,
      second: Number,
      first: Number,
      qualifying: Number,
      qualifyingSecond: Number,
      qualifyingFirst: Number,
    },
    rating: {
      winner: Number,
      finalist: Number,
      semiFinalist: Number,
      quarterFinalist: Number,
      fourth: Number,
      third: Number,
      second: Number,
      first: Number,
      qualifying: Number,
      qualifyingSecond: Number,
      qualifyingFirst: Number,
    },
  },
  seasons: [{
    id: Number,
    name: String,
    date: Date,
  }],
  pastChampions: {
    singles: [{
      id: Number,
      date: Date,
      result: String,
      roundId: Number,
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
        prize: String,
      },
    }],
    doubles: [{
      id: Number,
      date: Date,
      result: String,
      roundId: Number,
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
        prize: String,
      },
    }],
  },
  results: {
    singles: [{
      id: Number,
      date: Date,
      result: String,
      roundId: Number,
      round: {
        id: Number,
        name: String,
      },
      player1Id: Number,
      player2Id: Number,
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
      },
    }],
    doubles: [{
      id: Number,
      date: Date,
      result: String,
      roundId: Number,
      round: {
        id: Number,
        name: String,
      },
      player1Id: Number,
      player2Id: Number,
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
      },
    }],
    qualifying: [{
      id: Number,
      date: Date,
      result: String,
      roundId: Number,
      round: {
        id: Number,
        name: String,
      },
      player1Id: Number,
      player2Id: Number,
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
      },
    }],
    doublesQualifying: [{
      id: Number,
      date: Date,
      result: String,
      roundId: Number,
      round: {
        id: Number,
        name: String,
      },
      player1Id: Number,
      player2Id: Number,
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
      },
    }],
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('TennisTournament', tennisTournamentSchema);