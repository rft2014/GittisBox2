var ConfigData = require('../models/configdata');

module.exports = {
  aufgabe_loesenAction : aufgabe_loesenAction
};

function aufgabe_loesenAction (req,res){
			var arr = [];
ConfigData.find({},'aktAufgabe zeitgesteuert anzeigedauer aktAufgabentyp modus',{lean:true},function(err,aktau){
	if(err){console.log("Ich kann die aktuelle Aufgabe nicht finden")
	}
		else{
			aktuelleAufgabe = aktau[0].aktAufgabe;
			let istZeitgesteuert = aktau[0].zeitgesteuert;
			let anzeigedauer = aktau[0].anzeigedauer;
			let typ = aktau[0].aktAufgabentyp;
			let modus = aktau[0].modus;
			let tasks = require('../static'+aktuelleAufgabe);
			//mischen der Option 2 fuer die select box
      if(typ == 'singleChoice'){
			for(let i=0;i<tasks.Aufgaben.length;i++){
				arr[i] = tasks.Aufgaben[i].option_2;
				let randomIndex = Math.floor(Math.random()*(i+1));
				let itemAtIndex = arr[randomIndex];
				 arr[randomIndex] = arr[i];
					arr[i]= itemAtIndex;
			}
    }
				res.render(typ,{	title : 'Leistungskontrolle',
									'firstname' : req.user.local.firstname,
								 	'lastname' : req.user.local.lastname,
								 	'user': req.user.local.username,
									'klasse': req.user.local.klasse,
									'aufgabenDaten': tasks,
									'aufgabenDaten_json':JSON.stringify(tasks),
									'zeitgest': istZeitgesteuert,
									'DauerAnzeige': anzeigedauer,
									//'option_2_gemischt':arr,
									'option_2_gemischt':[... new Set(arr)],//doppelte entfernt
									'modus':modus,
									});
								}
						});
					};
