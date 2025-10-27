
const mongoose = require('mongoose');

const apiCacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true },
  cacheData: mongoose.Schema.Types.Mixed,
  expiresAt: { type: Date, required: true }
}, { timestamps: true });


apiCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ApiCache', apiCacheSchema);
