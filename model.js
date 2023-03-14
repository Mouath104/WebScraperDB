const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  // TODO: Define schema fields for the scraped data
});

module.exports = mongoose.model('Data', DataSchema);

