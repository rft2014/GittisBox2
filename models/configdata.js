var mongoose = require('mongoose');
var configDataSchema = new mongoose.Schema({
    aktKlasse: String,
    aktAufgabe: String,
    zeitgesteuert:String,
    anzeigedauer:Number,
    aktFach: String,
  });


module.exports = mongoose.model('ConfigData', configDataSchema);
