var User = require('./models/user');
var Ergebnis = require('./models/results');
var ConfigData = require('./models/configdata');
var fs = require('fs');
var alleAufgaben = fs.readdirSync('./static/aufgaben/');
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

	app.get('/admin_start', isLoggedInAsAdmin, function (req, res) {

		var aufgList = [];
		var aktuelleKlasse = '';
		var aktuelleAufgabe = '';
		var istZeitgesteuert = '';
		var anzeigeDauer = 0;
		var itemList = [];
		var ausgabe = '';
		var newItem = [];
		var klassen = ['5a','5b','5c','6a','6b','6c','3c'];
		ConfigData.find({},'aktKlasse aktAufgabe zeitgesteuert anzeigedauer',{lean:true},function(err, result){
	if(err) throw err;
	if(result){
		aktuelleKlasse = result[0].aktKlasse;
		aktuelleAufgabe = result[0].aktAufgabe;
		istZeitgesteuert = result[0].zeitgesteuert;
		anzeigeDauer = result[0].anzeigedauer;
			}

		for(var i=0; i<alleAufgaben.length;i++){
			var aufgabe = JSON.parse(fs.readFileSync('./static/aufgaben/'+alleAufgaben[i]));
			aufgList.push({aufgabe : {'path' : '/aufgaben/',
																'filename' : alleAufgaben[i],
																'id'	:	aufgabe.Aufgaben_id,
																'title' : aufgabe.title,
																'zeit_moeglich' : aufgabe.ZeitsteuerungMoeglich,
															}});

			ausgabe = aufgabe.title +' - '+aufgabe.Aufgaben_id;
			itemList.push(ausgabe);
			console.log('Ausgabe: '+ausgabe);
			console.log('JSON-Obj: '+ JSON.stringify(aufgList));
			console.log("aktuelle Klasse: " + aktuelleKlasse);

				}

			res.render('admin_start',{'alleAufgaben': aufgList,
																'aktKl': aktuelleKlasse,
																'alleKlassen': klassen,
																'aktAufg': aktuelleAufgabe,
																'istZeitgest': istZeitgesteuert,
																'DauerAnzeige': anzeigeDauer,
															});
													});
											});

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

	app.get('/lk', isLoggedInAsUser, function (req, res) {
		res.render('mul1',{	title : 'Leistungskontrolle',
									'firstname' : req.user.local.firstname,
								 	'lastname' : req.user.local.lastname,
								 	'user': req.user.local.username,
									'klasse': req.user.local.klasse,
									'aufgabe': aktuelleAufgabe,

									});

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
				console.log('Aus Zeile 156: '+result);
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
		console.log("zu uebernehmendes Object: "+ req.query.ObjID);
		ConfigData.find({},'aktKlasse',{lean:true},function(err, result){
	if(err) throw err;
	if(result){
		aktuelleKlasse = result[0].aktKlasse;
		}
		Ergebnis.findByIdAndUpdate(req.query.ObjID,{$set:{'antworten.insNotenbuch':'true'}}, function(err, ergebnis){
			if(err)throw err;
			if(ergebnis){
			console.log('gespeichert wird: '+ ergebnis);
		}
		});
		res.redirect('/admin?KL='+aktuelleKlasse);
		});
});
///////////////////////////////////////////////////////////////////////////////
//////         Das Notenbuch																						///////
///////////////////////////////////////////////////////////////////////////////

app.get('/notenbuch', function(req, res){
		res.render('notenbuch',{title:'Notenbuch'});

});


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

		app.post('/saveconfigdata', function(req,res){
			console.log('Jetzt werden die configdaten gespeichert');
			var AktKlasse = new ConfigData({aktKlasse:req.body.klasse});
			console.log('akt Klasse: '+AktKlasse);
			var kl = req.body.klasse;
			var aa = req.body.aufgabe;
			var zg = req.body.zeitgesteuert;
			var z  = req.body.zeit;
			ConfigData.updateOne({aktKlasse :{$regex:/[0-9]*[a-zA-Z]/}}, {aktKlasse:kl, aktAufgabe:aa, zeitgesteuert:zg,anzeigedauer:z} ,{upsert:true},function(err,numAffected){
				if(err)throw err;
				if(numAffected){}
			});
			ConfigData.updateOne({aktAufgabe :{$regex:/(json)/}}, {aktAufgabe:aa},{upsert:true}, function(err,numAffected){
				if(err)throw err;
				if(numAffected){}
			});
			res.redirect('/admin?' + 'KL='+kl);
		});

		app.get('/aufgabe_loesen',isLoggedInAsUser, function(req,res){

ConfigData.find({},'aktAufgabe zeitgesteuert anzeigedauer',{lean:true},function(err,aktau){
	if(err){console.log("Ich kann die aktuelle Aufgabe nicht finden")
	}
		else{
			aktuelleAufgabe = aktau[0].aktAufgabe;
			let istZeitgesteuert = aktau[0].zeitgesteuert;
			let anzeigedauer = aktau[0].anzeigedauer;
			let tasks = require('./static'+aktuelleAufgabe);
			console.log('Die aktuelle Aufgabe lautet: '+ aktuelleAufgabe + '   '+__filename);
			console.log('Ob oder nicht '+istZeitgesteuert);
				res.render('mathe_1',{	title : 'Leistungskontrolle',
									'firstname' : req.user.local.firstname,
								 	'lastname' : req.user.local.lastname,
								 	'user': req.user.local.username,
									'klasse': req.user.local.klasse,
									'aufgabenDaten': tasks,
									'zeitgest': istZeitgesteuert,
									'DauerAnzeige': anzeigedauer,
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
