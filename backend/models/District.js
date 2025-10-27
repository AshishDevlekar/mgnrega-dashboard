
const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  districtCode: { type: String, required: true, unique: true },
  districtName: { type: String, required: true },
  hindiName: { type: String, required: true },
  stateCode: String,
  stateName: { type: String, default: 'Rajasthan' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } 
  }
}, { timestamps: true });


districtSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('District', districtSchema);
