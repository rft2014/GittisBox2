var mongoose = require('mongoose');
var antwortSchema = new mongoose.Schema({
    ergebnis: Number,
    korrekt: Boolean,
  });


var antwortenSchema = new mongoose.Schema({
  antworten : {
  user : String,
  firstname: String,
  lastname: String,
  klasse: String,
  Aufgaben_ID: String,
  Abgegeben: Date,
  Korrekt: String,
  Note: String,
  Antwort: [antwortSchema],
  }
});



module.exports = mongoose.model('Ergebnis', antwortenSchema);
