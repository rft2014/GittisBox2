var lesenVerstehen = require('../models/lesenverstehen');

module.exports = {
  lesen_verstehenAction : lesen_verstehenAction
};


function lesen_verstehenAction(req,res){
var x = new lesenVerstehen({'lesenverstehen':req.body});

x.save(function(err, lesenverstehen){
			if(err) throw err;
			if(lesenverstehen){
				console.log('Aus Zeile 14: '+lesenverstehen);
			}
		});
  console.log("Json-Daten: "+JSON.stringify(req.body));
  res.render('verstehLesen_ende',{title: 'Text beendet'});
}
