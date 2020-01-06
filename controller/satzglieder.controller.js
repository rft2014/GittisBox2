var satzglieder = require('../models/satzglieder');

module.exports = {
  satzgliederAction : satzgliederAction
};


function satzgliederAction(req,res){
var x = new satzglieder({'satzglieder':req.body});

x.save(function(err, satzglieder){
			if(err) throw err;
			if(satzglieder){
				console.log('Aus Zeile 14: '+satzglieder);
			}
		});
  console.log("Json-Daten: "+JSON.stringify(req.body));
  res.render('verstehLesen_ende',{title: 'Text beendet'});
}
