const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ashishdevlekar19_db_user:Cjr9br0NDLwp3LD7@cluster0.cdn5i4t.mongodb.net/districtDB?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const districtSchema = new mongoose.Schema({
  stateCode: String,
  stateName: String,
  districtCode: { type: String, unique: true },
  districtName: String,
  updatedAt: { type: Date, default: Date.now }
});

const performanceSchema = new mongoose.Schema({
  districtCode: String,
  districtName: String,
  month: String,
  year: Number,
  jobCards: Number,
  workingFamilies: Number,
  personDays: Number,
  totalExpenditure: Number,
  wages: Number,
  materials: Number,
  completedWorks: Number,
  ongoingWorks: Number,
  totalWorks: Number,
  femaleParticipation: Number,
  avgEmploymentDays: Number,
  fetchedAt: { type: Date, default: Date.now }
});

performanceSchema.index({ districtCode: 1, year: -1, month: -1 });

const District = mongoose.model('District', districtSchema);
const Performance = mongoose.model('Performance', performanceSchema);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'MGNREGA Backend API',
    status: 'running',
    endpoints: [
      '/api/health',
      '/api/districts',
      '/api/districts/:code/summary',
      '/api/districts/:code/historical',
      '/api/analytics/state-summary',
      '/api/analytics/top-districts',
      '/api/district/:code/latest',
      '/api/district/:code/performance'
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Get all districts
app.get('/api/districts', async (req, res) => {
  try {
    const districts = await District.find()
      .select('districtCode districtName stateName')
      .sort({ districtName: 1 });
    res.json({ data: districts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get district summary (NEW - Required by frontend)
app.get('/api/districts/:code/summary', async (req, res) => {
  try {
    const district = await District.findOne({ districtCode: req.params.code });
    const latest = await Performance.findOne({ districtCode: req.params.code })
      .sort({ year: -1, month: -1 });
    
    if (!latest) {
      return res.status(404).json({ error: 'No data found' });
    }
    
    res.json({
      district: {
        code: district?.districtCode,
        name: district?.districtName,
        hindiName: district?.districtName
      },
      data: {
        totalJobCards: latest.jobCards || 0,
        householdsEmployed: latest.workingFamilies || 0,
        personDaysGenerated: latest.personDays || 0,
        avgDaysPerHousehold: latest.avgEmploymentDays || 0,
        totalExpenditure: latest.totalExpenditure || 0,
        wageExpenditure: latest.wages || 0,
        completedWorks: latest.completedWorks || 0,
        ongoingWorks: latest.ongoingWorks || 0,
        totalWorks: latest.totalWorks || 0,
        percentageWomen: latest.femaleParticipation || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get historical data (NEW - Required by frontend)
// Get historical data (FIXED - Proper chronological sorting)
app.get('/api/districts/:code/historical', async (req, res) => {
  try {
    const historical = await Performance.find({ districtCode: req.params.code })
      .sort({ year: -1, month: 1 }) // This won't work properly with month names
      .limit(12);
    
    // Define month order for Financial Year (April to March)
    const monthOrder = {
      'April': 1, 'May': 2, 'June': 3, 'July': 4, 'August': 5, 'September': 6,
      'October': 7, 'November': 8, 'December': 9, 'January': 10, 'February': 11, 'March': 12
    };
    
    // Sort data chronologically for FY
    const data = historical
      .map(h => ({
        month: h.month,
        personDays: h.personDays || 0,
        expenditure: h.totalExpenditure || 0,
        monthOrder: monthOrder[h.month] || 0
      }))
      .sort((a, b) => a.monthOrder - b.monthOrder)
      .map(({ month, personDays, expenditure }) => ({ month, personDays, expenditure }));
    
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// State summary (NEW - Required by frontend)
app.get('/api/analytics/state-summary', async (req, res) => {
  try {
    const districts = await District.find();
    const latestPerformances = await Performance.aggregate([
      { $sort: { districtCode: 1, year: -1, month: -1 } },
      { $group: { _id: '$districtCode', latest: { $first: '$$ROOT' } } }
    ]);
    
    const totals = latestPerformances.reduce((acc, item) => {
      const p = item.latest;
      return {
        totalPersonDays: acc.totalPersonDays + (p.personDays || 0),
        totalExpenditure: acc.totalExpenditure + (p.totalExpenditure || 0),
        totalWorks: acc.totalWorks + (p.totalWorks || 0),
        totalFemaleParticipation: acc.totalFemaleParticipation + (p.femaleParticipation || 0),
        count: acc.count + 1
      };
    }, { totalPersonDays: 0, totalExpenditure: 0, totalWorks: 0, totalFemaleParticipation: 0, count: 0 });
    
    res.json({
      totalDistricts: districts.length,
      data: {
        totalPersonDays: totals.totalPersonDays,
        totalExpenditure: totals.totalExpenditure,
        totalWorks: totals.totalWorks,
        avgWomenParticipation: totals.count > 0 ? totals.totalFemaleParticipation / totals.count : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Top districts (NEW - Required by frontend)
app.get('/api/analytics/top-districts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const topDistricts = await Performance.aggregate([
      { $sort: { districtCode: 1, year: -1, month: -1 } },
      { $group: { 
          _id: '$districtCode',
          districtName: { $first: '$districtName' },
          householdsEmployed: { $first: '$workingFamilies' },
          personDaysGenerated: { $first: '$personDays' }
        }
      },
      { $sort: { householdsEmployed: -1 } },
      { $limit: limit },
      { $project: {
          districtCode: '$_id',
          districtName: 1,
          householdsEmployed: 1,
          personDaysGenerated: 1,
          _id: 0
        }
      }
    ]);
    
    res.json({ data: topDistricts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Old endpoints (keeping for backward compatibility)
app.get('/api/district/:code/latest', async (req, res) => {
  try {
    const latest = await Performance.findOne({ districtCode: req.params.code })
      .sort({ year: -1, month: -1 });
    if (!latest) return res.status(404).json({ error: 'No data found' });
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/district/:code/performance', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const performance = await Performance.find({ districtCode: req.params.code })
      .sort({ year: -1, month: -1 })
      .limit(limit);
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/state/stats', async (req, res) => {
  try {
    const stats = await Performance.aggregate([
      { $group: { 
          _id: null, 
          totalJobCards: { $sum: '$jobCards' }, 
          totalWorkingFamilies: { $sum: '$workingFamilies' }, 
          totalPersonDays: { $sum: '$personDays' }, 
          totalExpenditure: { $sum: '$totalExpenditure' }, 
          avgFemaleParticipation: { $avg: '$femaleParticipation' }, 
          totalCompletedWorks: { $sum: '$completedWorks' } 
        } 
      }
    ]);
    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});