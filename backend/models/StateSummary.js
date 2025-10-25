// models/StateSummary.js
const mongoose = require('mongoose');

const stateSummarySchema = new mongoose.Schema({
  stateCode: String,
  stateName: { type: String, default: 'Rajasthan' },
  financialYear: String,
  monthYear: Date,
  
  totalDistricts: Number,
  totalPersonDays: Number,
  totalExpenditure: Number,
  totalWorks: Number,
  completedWorks: Number,
  
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StateSummary', stateSummarySchema);