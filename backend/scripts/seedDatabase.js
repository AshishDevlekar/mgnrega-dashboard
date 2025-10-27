
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ashishdevlekar19_db_user:Cjr9br0NDLwp3LD7@cluster0.cdn5i4t.mongodb.net/districtDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const districtSchema = new mongoose.Schema({
  stateCode: String,
  stateName: String,
  districtCode: String,
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

const District = mongoose.model('District', districtSchema);
const Performance = mongoose.model('Performance', performanceSchema);

const rajasthanDistricts = [
  { code: '2701', name: 'Ajmer' },
  { code: '2702', name: 'Alwar' },
  { code: '2703', name: 'Banswara' },
  { code: '2704', name: 'Baran' },
  { code: '2705', name: 'Barmer' },
  { code: '2706', name: 'Bharatpur' },
  { code: '2707', name: 'Bhilwara' },
  { code: '2708', name: 'Bikaner' },
  { code: '2709', name: 'Bundi' },
  { code: '2710', name: 'Chittorgarh' },
  { code: '2711', name: 'Churu' },
  { code: '2712', name: 'Dausa' },
  { code: '2713', name: 'Dungarpur' }
];

async function seedData() {
  try {
    
    await District.deleteMany({});
    await Performance.deleteMany({});
    
    console.log('Cleared existing data');
    
    
    for (const dist of rajasthanDistricts) {
      await District.create({
        stateCode: '27',
        stateName: 'Rajasthan',
        districtCode: dist.code,
        districtName: dist.name
      });
    }
    
    console.log('Inserted districts');
    
    
    const months = ['April', 'May', 'June', 'July', 'August', 'September', 'October'];
    const year = 2024;
    
    for (const dist of rajasthanDistricts) {
      for (let i = 0; i < months.length; i++) {
        const baseValue = Math.random() * 50000 + 40000;
        
        await Performance.create({
          districtCode: dist.code,
          districtName: dist.name,
          month: months[i],
          year: year,
          jobCards: Math.floor(baseValue),
          workingFamilies: Math.floor(baseValue * 0.9),
          personDays: Math.floor(baseValue * 5),
          totalExpenditure: Math.floor(baseValue * 1400),
          wages: Math.floor(baseValue * 1000),
          materials: Math.floor(baseValue * 400),
          completedWorks: Math.floor(Math.random() * 800 + 400),
          ongoingWorks: Math.floor(Math.random() * 300 + 150),
          totalWorks: Math.floor(Math.random() * 900 + 600),
          femaleParticipation: Math.floor(Math.random() * 20 + 30),
          avgEmploymentDays: Math.floor(Math.random() * 40 + 50)
        });
      }
    }
    
    console.log('Inserted performance data');
    console.log('Seeding completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedData();
