// scripts/fixIndexes.js
const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected\n');

    const db = mongoose.connection.db;
    const performancesCollection = db.collection('performances');

    console.log('📋 Current indexes:');
    const indexes = await performancesCollection.indexes();
    console.log(indexes.map(i => i.name));

    console.log('\n🗑️  Dropping old indexes...');
    
    try {
      await performancesCollection.dropIndex('district_1_financialYear_1_month_1');
      console.log('✓ Dropped district_1_financialYear_1_month_1');
    } catch (e) {
      console.log('✓ Index already removed or doesn\'t exist');
    }

    // Drop all indexes except _id
    console.log('\n🔄 Dropping all indexes except _id...');
    await performancesCollection.dropIndexes();
    console.log('✓ All indexes dropped');

    console.log('\n✅ Index cleanup complete!');
    console.log('Now run: node scripts/seedMNREGA.js\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixIndexes();