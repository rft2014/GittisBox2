var ConfigData = require('../models/configdata');
var fs = require('fs');
var alleAufgaben = fs.readdirSync('./static/aufgaben/');
module.exports = {
  admin_startAction : admin_startAction
};

function admin_startAction (req, res) {

		var aufgList = [];
		var aktuelleKlasse = '';
		var aktuelleAufgabe = '';
		var istZeitgesteuert = '';
		var anzeigeDauer = 0;
		var itemList = [];
		var ausgabe = '';
		var newItem = [];
		var klassen = ['5a','5b','5c','6a','6b','6c'];
		var faecher = ['MNT', 'Geo', 'De', 'Ma']
		ConfigData.find({},'aktKlasse aktAufgabe zeitgesteuert anzeigedauer aktFach',{lean:true},function(err, result){
	if(err) throw err;
	if(result){
		aktuelleKlasse = result[0].aktKlasse;
		aktuellesFach = result[0].aktFach;
		aktuelleAufgabe = result[0].aktAufgabe;
		istZeitgesteuert = result[0].zeitgesteuert;
		anzeigeDauer = result[0].anzeigedauer;
			}

		for(var i=0; i<alleAufgaben.length;i++){
			var aufgabe = JSON.parse(fs.readFileSync('./static/aufgaben/'+alleAufgaben[i]));
			if(aufgabe.Fach == aktuellesFach){
			aufgList.push({aufgabe : {'path' : '/aufgaben/',
																'filename' : alleAufgaben[i],
																'id'	:	aufgabe.Aufgaben_id,
																'title' : aufgabe.title,
																'zeit_moeglich' : aufgabe.ZeitsteuerungMoeglich,
																'aufgabentyp' :	aufgabe.Aufgabentyp,
															}});

			ausgabe = aufgabe.title +' - '+aufgabe.Aufgaben_id;
			itemList.push(ausgabe);
			console.log('Ausgabe: '+ausgabe);
			console.log('JSON-Obj: '+ JSON.stringify(aufgList));
			console.log("aktuelle Klasse: " + aktuelleKlasse);

				}
			}

			res.render('admin_start',{'alleAufgaben': aufgList,
																'aktKl': aktuelleKlasse,
																'alleKlassen': klassen,
																'aktAufg': aktuelleAufgabe,
																'istZeitgest': istZeitgesteuert,
																'DauerAnzeige': anzeigeDauer,
																'title': ' Admin - Startmenü',
																'aktFach': aktuellesFach,
																'alleFaecher': faecher,
															});
													});
											};
