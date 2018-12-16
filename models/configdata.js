var mongoose = require('mongoose');
var configDataSchema = new mongoose.Schema({
    aktKlasse: String,
    aktAufgabe: String,
    zeitgesteuert:String,
    anzeigedauer:Number,
  });


module.exports = mongoose.model('ConfigData', configDataSchema);
