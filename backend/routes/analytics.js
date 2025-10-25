// routes/analytics.js
const express = require('express');
const router = express.Router();
const StateSummary = require('../models/StateSummary');
const Performance = require('../models/Performance');

// GET state summary
router.get('/state-summary', async (req, res) => {
  try {
    const summary = await StateSummary.findOne()
      .sort({ monthYear: -1 });
    
    if (!summary) {
      return res.status(404).json({ error: 'No state summary found' });
    }
    
    res.json({
      totalDistricts: summary.totalDistricts,
      data: {
        totalPersonDays: summary.totalPersonDays,
        totalExpenditure: summary.totalExpenditure,
        totalWorks: summary.totalWorks
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET top districts
router.get('/top-districts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    // Get latest month
    const latestMonth = await Performance.findOne()
      .sort({ monthYear: -1 })
      .select('monthYear');
    
    const topDistricts = await Performance.find({
      monthYear: latestMonth.monthYear
    })
      .sort({ 'jobData.householdsEmployed': -1 })
      .limit(limit);
    
    const data = topDistricts.map(d => ({
      districtCode: d.districtCode,
      districtName: d.districtName,
      hindiName: d.hindiName,
      householdsEmployed: d.jobData.householdsEmployed,
      personDaysGenerated: d.jobData.personDaysGenerated
    }));
    
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;