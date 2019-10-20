var lesenverstehen = {Fehler:[]};

$(document).ready(function(){
$("#user").hide();
$("#maxAufgabenAnzahl").hide();
$(".korrekteLoesung").hide();
$("#istZeitgest").hide();
$("#anzeigedauer").hide();
$("#firstname").hide();
$("#lastname").hide();
$("#klasse").hide();
$("#aufg_id").hide();
$("#aufgabenFile").hide();
$("#aktAufgabe").hide();
$("#slash").hide();
$("#anzahlAufgaben").hide();
$("#bezeichnung").hide();
lesenverstehen.user = $("#user").html();
lesenverstehen.Aufgaben_ID = $("#aufg_id").text();
lesenverstehen.firstname = $("#firstname").text();
lesenverstehen.lastname = $("#lastname").text();
lesenverstehen.klasse = $("#klasse").text().trim();
});

var startzeit;
var endzeit;
function kar_zurueck(){
	document.getElementById("kar").prev();
	$("#aktAufgabe").html(document.querySelector('ons-carousel').getActiveIndex());
	if(document.querySelector('ons-carousel').getActiveIndex() == '0'){
		$("#aktAufgabe").hide();
		$("#slash").hide();
		$("#anzahlAufgaben").hide();
		$("#bezeichnung").hide();
	}else{
		$("#bezeichnung").show();
		$("#aktAufgabe").show();
		$("#slash").show();
		$("#anzahlAufgaben").show();
	}
}

function kar_weiter(){
	document.getElementById("kar").next();
	$("#aktAufgabe").html(document.querySelector('ons-carousel').getActiveIndex());
	$("#bezeichnung").show();
	$("#aktAufgabe").show();
	$("#slash").show();
	$("#anzahlAufgaben").show();
}

function checkAntworten(){
	var status = true;
	let Seitenindex = document.querySelector('ons-carousel').getActiveIndex() - 1;
	var bibi = $("#aufgabenFile").html();
	var baba = JSON.parse(bibi);
	var fragenAnzahl = baba.Aufgaben[Seitenindex].Fragen.length;
	var gewaehlteAntworten = $("input:checked").length;

	for(var i = 0; i < fragenAnzahl; i++){//fuer jede Frage
		var anzahlGewaehlt = 0;
		for(var j = 0; j < baba.Aufgaben[Seitenindex].Fragen[i].Antworten.length; j++){//fuer jede Antwort
			let antwort = document.getElementById('item'+Seitenindex + i + j).value;
			let gewaehlt = document.getElementById('item'+Seitenindex + i + j).checked;
			if (gewaehlt == true){
				anzahlGewaehlt ++;
				if (baba.Aufgaben[Seitenindex].Fragen[i].korrekteAntwort.includes(antwort))
					{} //wenn antwort korrekt nichts tun				}
				else
				{
				status = false;// bei falscher Antwort status aendern
				console.log('Aufgabe: '+Seitenindex+i+j+' ist falsch');
				Aufgabe = 'Aufgabe'+Seitenindex+i+j;
				lesenverstehen.Fehler.push({"fehler" : Aufgabe});
				};
			}
		}
		if (anzahlGewaehlt == baba.Aufgaben[Seitenindex].Fragen[i].korrekteAntwort.length)
			{}
		else
			{
			status=false;
			console.log('Aufgabe: '+Seitenindex+i+j+' ist falsch x');
			Aufgabe = 'Aufgabe'+Seitenindex+i+j;
			lesenverstehen.Fehler.push({"fehler" : Aufgabe});
		};
	}
	console.log(status);
	if (status == true){
		kar_weiter();
	}
	else
		{
		alert('Lies den Text noch einmal und beantworte die Fragen korrekt!');
	};
}

function starteAufgabe(){
	kar_weiter();

	console.time('aufgabe');
	startzeit = new Date().getTime();
	console.log('Gestartet: '+ startzeit);
	start = new Date();

}
function beendeAufgabe(){
	console.timeEnd('aufgabe');
	let zielzeit = new Date().getTime();
	let dauer = zielzeit - startzeit;
	let hours = Math.floor(dauer/(1000*60*60));
	dauer = dauer - (hours *60*1000*60);
	let minutes = Math.floor(dauer/(1000*60));
	dauer = dauer - (minutes *60*1000);
	let seconds = Math.floor(dauer/1000);
	console.log('Dauer: '+hours + ' : '+ minutes + ' : '+seconds) ;
	lesenverstehen.Begonnen = startzeit;
	lesenverstehen.Abgegeben = zielzeit;
	lesenverstehen.Dauer = dauer;
	sendData();
	window.document.location.href = '/save_lesenverstehen';
}
function sendData(){
	$.ajax({
		url:'/save_lesenverstehen',
		type: 'POST',
		data: JSON.stringify(lesenverstehen),
		contentType: 'application/json; charset=utf-8',
	});
}
