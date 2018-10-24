var mongoose = require('mongoose');
var configDataSchema = new mongoose.Schema({
    aktKlasse: String,
    aktAufgabe: String,
  });


module.exports = mongoose.model('ConfigData', configDataSchema);
