var mongoose = require('mongoose');
var antwortSchema = new mongoose.Schema({
    ergebnis: String,
    korrekt: Boolean,
  });


var antwortenSchema = new mongoose.Schema({
  antworten : {
  user : String,
  firstname: String,
  lastname: String,
  klasse: String,
  fach: String,
  Aufgaben_ID: String,
  Abgegeben: String,
  Korrekt: String,
  Note: String,
  insNotenbuch: Boolean,
  Antwort: [antwortSchema],
  }
});



module.exports = mongoose.model('Ergebnis', antwortenSchema);
