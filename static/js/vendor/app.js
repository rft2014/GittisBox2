



function note(prozente){

	let note = 0;

	if(prozente <= 100 && prozente >= 96){
		note = 1;
		return note;
	}
	if(prozente < 96 && prozente >= 80){
		note = 2;
		return note;
	}
	if(prozente < 80 && prozente >= 60){
		note = 3;
		return note;
	}
	if(prozente < 60 && prozente >= 40){
		note = 4;
		return note;
	}
  if(prozente < 40 && prozente >= 20){
    note = 5;
    return note;
  }
  if(prozente < 20){
    note = 6;
    return note;
  }
};

function kloneKlasse(){
        var itm = document.getElementById('neueMatheAufgabe_1');
        var cln = itm.cloneNode(true);
				//cln.addEventListener('click',alert('Trallala'));
        document.getElementById('abc').appendChild(cln);
				console.log('abc: '+document.getElementById('abc').firstChild.innerHTML)
        var max = document.getElementsByClassName('grid-x grid-margin-x').length;
				cln.id='neueMatheAufgabe_'+max;
				cln.id='Hallotri';
				console.log('Kinners: '+document.body.childNodes[1].textContent);
				$('#lfdnr').html(max);
        console.log('Anzahl Elemente im DOM: '+ max);
    		for (let i=1;i<=max;i++){
					//document.getElementById('lfdnr').innerHTML=i;
					console.log('Ich lebe');
				}

        };

function antworten_pruefen(){
kar_weiter();

let anzahl = json_aufgaben.Aufgaben.length
$('#antwortTabelle').append('<ons-row><ons-col width=\'10%\'></ons-col><ons-col style=\'font-weight:bold\'width=\'40%\'>Antwort</ons-col><ons-col style=\'font-weight:bold\' width=\'40%\'>Lösung</ons-col><ons-col style=\'font-weight:bold\'>ok</ons-col></ons-row>');
  for (let k = 0;k<anzahl;k++){
		var e = document.getElementById('capital_'+k);
		var antw = e.options[e.selectedIndex].value;
		if(antw === json_aufgaben.Aufgaben[k].option_2){
		$('#antwortTabelle').append('<ons-row><ons-col width=\'10%\' style=\'font-weight:bold; color:green\'>'+(parseInt(k)+1)+'</ons-col><ons-col style=\'color:green\' width=\'40%\'>'+antw+'</ons-col><ons-col style=\'color:green\' width=\'40%\'>'+ json_aufgaben.Aufgaben[k].option_2 +'</ons-col><ons-col><ons-icon style=\'color:green; text-align:right\' icon=\'md-check\'></ons-icon></ons-col></ons-row>');
	}else{$('#antwortTabelle').append('<ons-row><ons-col  width=\'10%\' style=\'font-weight:bold; color:red\'>'+(parseInt(k)+1)+'</ons-col><ons-col style=\'color:red\' width=\'40%\'>'+antw+'</ons-col><ons-col style=\'color:red\' width=\'40%\'>'+ json_aufgaben.Aufgaben[k].option_2 +'</ons-col><ons-col><ons-icon style=\'color:red\' icon=\'md-close\'></ons-icon></ons-col></ons-row>');
}



  }

}

function texteingabe_antworten_pruefen(){
kar_weiter();

let anzahl = json_aufgaben.Aufgaben.length
$('#antwortTabelle').append('<ons-row><ons-col width=\'10%\'></ons-col><ons-col style=\'font-weight:bold\'width=\'40%\'>Antwort</ons-col><ons-col style=\'font-weight:bold\' width=\'40%\'>Lösung</ons-col><ons-col style=\'font-weight:bold\'>ok</ons-col></ons-row>');
  for (let k = 0;k<anzahl;k++){
		var e = document.getElementById('capital_'+k);
		var antw = e.value;
		if(antw === json_aufgaben.Aufgaben[k].option_2){
		$('#antwortTabelle').append('<ons-row><ons-col width=\'10%\' style=\'font-weight:bold; color:green\'>'+(parseInt(k)+1)+'</ons-col><ons-col style=\'color:green\' width=\'40%\'>'+antw+'</ons-col><ons-col style=\'color:green\' width=\'40%\'>'+ json_aufgaben.Aufgaben[k].option_2 +'</ons-col><ons-col><ons-icon style=\'color:green; text-align:right\' icon=\'md-check\'></ons-icon></ons-col></ons-row>');
	}else{$('#antwortTabelle').append('<ons-row><ons-col  width=\'10%\' style=\'font-weight:bold; color:red\'>'+(parseInt(k)+1)+'</ons-col><ons-col style=\'color:red\' width=\'40%\'>'+antw+'</ons-col><ons-col style=\'color:red\' width=\'40%\'>'+ json_aufgaben.Aufgaben[k].option_2 +'</ons-col><ons-col><ons-icon style=\'color:red\' icon=\'md-close\'></ons-icon></ons-col></ons-row>');
}



  }

}

function logout(){
	window.location.href = '/logout';
}
