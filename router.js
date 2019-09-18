 var Controller = require('./controller/admin_start.controller');
var User = require('./models/user');
var Ergebnis = require('./models/results');
var ConfigData = require('./models/configdata');
//var fs = require('fs');
//var alleAufgaben = fs.readdirSync('./static/aufgaben/');
var aufgabenText;
var aktau = '';
var aktuelleAufgabe = '';
var aktuelleKlasse = '';


module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('index',{
		title: 'Online-Tutor'});
	});
	app.get('/signup', function(req, res){
		res.render('signup', {
		message: req.flash('signupMessage'),
		title: 'Konto anlegen'
		 });
	});
	app.get('/login', function(req,res){
		res.render('login',{
		title: 'Login - Seite',
		message: req.flash('loginMessage')
		});
	});
	app.get('/profile', isLoggedIn, function (req, res, next) {
		if (req.user.local.role === 'admin') {res.redirect('/admin_start');}
		if (req.user.local.role === 'user') {res.redirect('/user');}
	});
	app.get('/admin_start', isLoggedInAsAdmin, Controller.admin_startAction);

	app.get('/admin', isLoggedInAsAdmin, function (req, res) {

		console.log('schritt 1, aktuelle Klasse: '+ req.query.KL);
		Ergebnis.find({'antworten.klasse':req.query.KL, 'antworten.insNotenbuch':'false'}, function(err, alleNoten){
		if (err) {console.log('keine Noten vorhanden');
		}
			else{
				res.render('admin',{AlleNoten:alleNoten, KL:req.query.KL});

			}
		});
	});

	app.get('/sessions', (req, res) => {
      res.render('session',{Sess:'sessions'})

});

	app.get('/user', isLoggedInAsUser, function (req, res) {
		ConfigData.find({},'aktAufgabe',{lean:true},function(err,aktau){
	if(err){throw err;
	}
		else{
			aktuelleAufgabe = aktau[0].aktAufgabe;
			console.log('Die aktuelle Aufgabe in user lautet: '+ aktuelleAufgabe + '   '+__filename)

		}

});
		res.render('user',{title : 'User',
								'user': req.user.local.username,
								 'role': req.user.local.role,
								 'firstname' : req.user.local.firstname,
								 'lastname' : req.user.local.lastname,
								 'UID' : req.user._id,
								 'Session': req.session,
								 'aufgaben':aktuelleAufgabe
								 });
			console.log('Aktuelle Aufgabe: '+ aktuelleAufgabe);
		});



		app.get('/lk_abgegeben', isLoggedInAsUser, function(req,res){
			res.render('lk_abgegeben',{title: 'LK abgegeben',
																	'firstname' : req.user.local.firstname,
																	'Note': req.query.note,
																});
		});

		app.get('/editor', isLoggedInAsAdmin, function(req,res){
			res.render('editor', {title: 'Aufgaben bearbeiten',
														});
		});
		app.get('/mathe-editor', function(req,res){
			res.render('mathe-editor', {title: 'Matheaufgaben entwickeln',
														});
		});

	app.post('/save', function(req,res){
		console.log("Json-Daten: "+JSON.stringify(req.body));
		var x = new Ergebnis({'antworten':req.body});

		x.save(function(err, result){
			if(err) throw err;
			if(result){
				console.log('Aus Zeile 170: '+result);
			}
		});
	})
//////////////////////////////////////////////////////////////////////////////
///					Loeschen der Ergebnisse von Leistungskonrollen								////
///																																				////
//////////////////////////////////////////////////////////////////////////////
	app.get('/loeschen', function(req, res){
		let aktuelleKlasse = '';
		console.log("zu loeschendes Object: "+ req.query.ObjID);
		ConfigData.find({},'aktKlasse',{lean:true},function(err, result){
	if(err) throw err;
	if(result){
		aktuelleKlasse = result[0].aktKlasse;
		}
		Ergebnis.findByIdAndDelete(req.query.ObjID, function(err, ergebnis){
			console.log('geloescht wird: '+ ergebnis);
		});
		res.redirect('/admin?KL='+aktuelleKlasse);
		});
	});

///////////////////////////////////////////////////////////////////////////////
/////			Uebernehmen der Noten ins Notenbuch															/////
///////////////////////////////////////////////////////////////////////////////
app.get('/ins_notenbuch', function(req,res){
	let aktuelleKlasse = '';
		ConfigData.find({},'aktKlasse',{lean:true},function(err, result){
			if(err) throw err;
			if(result){
				aktuelleKlasse = result[0].aktKlasse;
				}
		Ergebnis.findByIdAndUpdate(req.query.ObjID,{$set:{'antworten.insNotenbuch':'true'}}, function(err, ergebnis){
			if(err)throw err;
			if(ergebnis){
				}
			});
		res.redirect('/admin?KL='+aktuelleKlasse);
		});
});
///////////////////////////////////////////////////////////////////////////////
//////         Das Notenbuch																						///////
///////////////////////////////////////////////////////////////////////////////

app.get('/notenbuch', function(req, res){

	Ergebnis.distinct('antworten.Aufgaben_ID',{'antworten.klasse':req.query.KL},
			function(err, abgegebeneAufgabenDerKlasse ){

	User.find({'local.klasse':req.query.KL},'local.firstname local.lastname local.username',{lean:true},
			function(err,schueler){
				if(err){throw err;
					}
					else{};


	Ergebnis.find({'antworten.klasse':req.query.KL}, 'antworten.Note antworten.user antworten.Aufgaben_ID',{lean:true},
			function(err, noten){
				if(err){throw err;
				}
				else{console.log('Noten: '+JSON.stringify(noten));}


	res.render('notenbuch',{title:'Notenbuch',
														schueler:schueler,
														KL:req.query.KL,//aktuelle Klasse
														F:req.query.F, //aktuelles Fach
														AUFG:abgegebeneAufgabenDerKlasse,
														NOTEN:JSON.stringify(noten),
														});
													});
												}).sort({'local.lastname':1});
											});
});

///////////////////////////////////////////////////////////////////////////////
		app.post('/save-editor', function(req,res){
			console.log('Editordaten: '+ JSON.stringify(req.body));
		})
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	})

	app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
///////////////////////////////////////////////////////////////////////////////
////////																																///////
////////				Speicherung der Configdaten bei Bereitstellung					///////
////////				der Aufgaben fuer schueler															///////
///////////////////////////////////////////////////////////////////////////////
		app.post('/saveconfigdata', function(req,res){
			console.log('Jetzt werden die configdaten gespeichert');
			var AktKlasse = new ConfigData({aktKlasse:req.body.klasse});
			console.log('akt Klasse: '+AktKlasse);
			var kl = req.body.klasse;
			var aa = req.body.aufgabe;
			var zg = req.body.zeitgesteuert;
			var z  = req.body.zeit;
			var f  = req.body.fach;
			var m  = req.body.uebungOderPruefung;

			let position = aa.indexOf('|');
			aauf = aa.slice(0,position);
			var typ = aa.slice(position+1);

			ConfigData.updateOne({aktKlasse :{$regex:/[0-9]*[a-zA-Z]/}}, {aktKlasse:kl, aktAufgabe:aauf, zeitgesteuert:zg,anzeigedauer:z, aktFach:f, aktAufgabentyp:typ, modus:m} ,{upsert:true},function(err,numAffected){
				if(err)throw err;
				if(numAffected){}
			});
			res.redirect('/admin?' + 'KL='+kl);
		});

////////////////////////////////////////////////////////////////////////////////
////////				Speicherug ausgewaehlter Configdaten (Klasse, Fach)		//////////
////////				bei Aufruf Notenbuch																	//////////
////////////////////////////////////////////////////////////////////////////////

app.post('/saveconfigdata_part', function(req,res){
			var AktKlasse = new ConfigData({aktKlasse:req.body.klasse});
			var kl = req.body.klasse;
			var f  = req.body.fach;
			ConfigData.updateOne({aktKlasse :{$regex:/[0-9]*[a-zA-Z]/}}, {aktKlasse:kl, aktFach:f} ,{upsert:true},function(err,numAffected){
				if(err)throw err;
				if(numAffected){}
			});
			res.redirect('/notenbuch?'+'KL='+kl+'&F='+f);
		});

////////////////////////////////////////////////////////////////////////////////

app.get('/savefach', function(req, res){
console.log('Das neue Fach: '+req.query.Fach);
var f  = req.query.Fach;
ConfigData.updateOne({},{aktFach:f} ,{upsert:true},function(err,numAffected){
				if(err)throw err;
				if(numAffected){}
			});
	res.redirect('/admin_start');
});

		app.get('/aufgabe_loesen',isLoggedInAsUser, function(req,res){
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
			let tasks = require('./static'+aktuelleAufgabe);
			//mischen der Option 2 fuer die select box
			for(let i=0;i<tasks.Aufgaben.length;i++){
				arr[i] = tasks.Aufgaben[i].option_2;
				let randomIndex = Math.floor(Math.random()*(i+1));
				let itemAtIndex = arr[randomIndex];
				 arr[randomIndex] = arr[i];
					arr[i]= itemAtIndex;
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
									'option_2_gemischt':arr,
									'modus':modus,
									});
								}
						});
					});




				app.get('/lt', function(req,res){
					var data = ['','Fruchtknoten', 'Sprossachse', 'Staubfaden', 'Boden', 'Eizelle',
'verholzt', 'Griffel', 'schützen', 'Stempel', 'Insekten', 'Staubbeutel', 'Blattstiel',
'Speicherorgan', 'Wurzel', 'Sprossachse', 'Narbe', 'Aufnahme', 'männlichen',
'Wurzelhaare', 'Mineralsalzen', 'Laubblätter', 'Blüte', 'Laubblätter', 'Fotosynthese',
'unverholzten', 'Blattspreite', 'Wasser', 'weibliche'];
					res.render('lt',{'loesungsworte':data})
				});
};

function isLoggedIn(req, res, next){
	if(req.isAuthenticated())
		return next();

		res.redirect('/');
}

function isLoggedInAsAdmin(req, res, next){
	if(req.isAuthenticated() && req.user.local.role === 'admin')
		return next();

		res.redirect('/');
}

function isLoggedInAsUser(req, res, next){
	if(req.isAuthenticated() && req.user.local.role === 'user')
		return next();

		res.redirect('/');
}
function aktuelleKlasse(){
	ConfigData.find({},'aktKlasse',{lean:true},function(err, result){
	if(err) throw err;
	if(result){
		console.log('Die aktuelle Klassssse ist: '+ result[0].aktKlasse);
		aktuelleKlasse = result[0].aktKlasse;


	}
});

}
