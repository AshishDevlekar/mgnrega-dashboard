// models/Performance.js
const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  districtCode: { type: String, required: true, index: true },
  districtName: String,
  hindiName: String,
  financialYear: { type: String, default: '2024-25' },
  month: String,
  monthYear: { type: Date, required: true },
  
  jobData: {
    totalJobCards: { type: Number, default: 0 },
    householdsEmployed: { type: Number, default: 0 },
    personDaysGenerated: { type: Number, default: 0 },
    avgDaysPerHousehold: { type: Number, default: 0 }
  },
  
  financialData: {
    totalExpenditure: { type: Number, default: 0 },
    wageExpenditure: { type: Number, default: 0 },
    materialExpenditure: { type: Number, default: 0 }
  },
  
  worksData: {
    totalWorks: { type: Number, default: 0 },
    completedWorks: { type: Number, default: 0 },
    ongoingWorks: { type: Number, default: 0 }
  },
  
  socialMetrics: {
    percentageWomen: { type: Number, default: 0 },
    scPersonsWorked: { type: Number, default: 0 },
    stPersonsWorked: { type: Number, default: 0 }
  },
  
  dataSource: { type: String, default: 'data.gov.in' },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index for efficient queries
performanceSchema.index({ districtCode: 1, monthYear: -1 });

module.exports = mongoose.model('Performance', performanceSchema);