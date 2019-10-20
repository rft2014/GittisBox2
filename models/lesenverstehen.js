var mongoose = require('mongoose');

var fehlerSchema = new mongoose.Schema({
    fehler: String,
  });

var lesenverstehenSchema = new mongoose.Schema({
  lesenverstehen : {
  user : String,
  firstname: String,
  lastname: String,
  klasse: String,
  Aufgaben_ID: String,
  Begonnen: String,
  Abgegeben: String,
  Dauer: String,
  Fehler: [fehlerSchema],
  }
});


module.exports = mongoose.model('LVStatistik', lesenverstehenSchema);
