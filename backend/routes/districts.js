// routes/districts.js
const express = require('express');
const router = express.Router();
const District = require('../models/District');
const Performance = require('../models/Performance');
const ApiCache = require('../models/ApiCache');

// Cache middleware
const cacheMiddleware = async (req, res, next) => {
  const cacheKey = req.originalUrl;
  
  try {
    const cached = await ApiCache.findOne({
      cacheKey,
      expiresAt: { $gt: new Date() }
    });
    
    if (cached) {
      console.log('📦 Serving from cache:', cacheKey);
      return res.json(cached.cacheData);
    }
  } catch (error) {
    console.error('Cache error:', error);
  }
  
  // Store original json method
  res.originalJson = res.json;
  res.json = async function(data) {
    // Cache the response
    try {
      await ApiCache.findOneAndUpdate(
        { cacheKey },
        {
          cacheKey,
          cacheData: data,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        },
        { upsert: true }
      );
    } catch (error) {
      console.error('Failed to cache:', error);
    }
    
    res.originalJson(data);
  };
  
  next();
};

// GET all districts
router.get('/', cacheMiddleware, async (req, res) => {
  try {
    const districts = await District.find().select('-__v');
    res.json({ data: districts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET district summary
router.get('/:code/summary', cacheMiddleware, async (req, res) => {
  try {
    const { code } = req.params;
    
    const district = await District.findOne({ districtCode: code });
    if (!district) {
      return res.status(404).json({ error: 'District not found' });
    }
    
    // Get latest performance data
    const performance = await Performance.findOne({ districtCode: code })
      .sort({ monthYear: -1 });
    
    if (!performance) {
      return res.status(404).json({ error: 'Performance data not found' });
    }
    
    res.json({
      district: {
        code: district.districtCode,
        name: district.districtName,
        hindiName: district.hindiName
      },
      data: {
        totalJobCards: performance.jobData.totalJobCards,
        householdsEmployed: performance.jobData.householdsEmployed,
        personDaysGenerated: performance.jobData.personDaysGenerated,
        avgDaysPerHousehold: performance.jobData.avgDaysPerHousehold,
        totalExpenditure: performance.financialData.totalExpenditure,
        wageExpenditure: performance.financialData.wageExpenditure,
        totalWorks: performance.worksData.totalWorks,
        completedWorks: performance.worksData.completedWorks,
        ongoingWorks: performance.worksData.ongoingWorks,
        percentageWomen: performance.socialMetrics.percentageWomen
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET historical data
router.get('/:code/historical', cacheMiddleware, async (req, res) => {
  try {
    const { code } = req.params;
    
    const historical = await Performance.find({ districtCode: code })
      .sort({ monthYear: -1 })
      .limit(12);
    
    const data = historical.map(h => ({
      month: h.month,
      personDays: h.jobData.personDaysGenerated,
      expenditure: h.financialData.totalExpenditure
    }));
    
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET nearby district (BONUS - Geolocation)
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }
    
    const district = await District.findOne({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lon), parseFloat(lat)]
          },
          $maxDistance: 100000 // 100km radius
        }
      }
    });
    
    if (!district) {
      return res.status(404).json({ error: 'No district found nearby' });
    }
    
    res.json({ districtCode: district.districtCode, districtName: district.districtName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;