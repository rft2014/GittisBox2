var aufgabenZaehler = 0;
var jsonAufgabenGlobal;
var antworten = {Antwort:[]};
var AnzahlAufgaben = 0;
var Note = '';

$(document).ready(function(){
$("#user").hide();
$("#maxAufgabenAnzahl").hide();
$(".korrekteLoesung").hide();

anzeigeAufgabeInNav();
//var aktAufg = $("#aufgabe").html();
//$.getJSON(aktAufg, function(aufgaben){
//console.log('Die Aufgabe in add1_ons: '+aktAufg);
//	AnzahlAufgaben = Object.keys(aufgaben.Aufgaben).length;
	//$("#rel1").html(aufgaben.Aufgaben[aufgabenZaehler].sum1);
	//$("#rel2").html(aufgaben.Aufgaben[aufgabenZaehler].sum2);
	//$("#operator").html("&#043;");
	//jsonAufgabenGlobal = aufgaben;
	//aufgID = aufgaben.Aufgaben_id;
	antworten.user = $("#user").html();
	antworten.Abgegeben = Date.now();
	antworten.Aufgaben_ID = $("#aufg_id").text();
	antworten.firstname = $("#firstname").text();
	antworten.lastname = $("#lastname").text();
	antworten.klasse = $("#klasse").text().trim();


  document.querySelector('ons-carousel').addEventListener('postchange', function(){
	anzeigeAufgabeInNav();
	setzeFocus();
	checkResults();
  });
});


function checkResults(){
	let korrekt;
	let c = '';
	let cc ='';
	let maxAufgaben = parseInt($("#maxAufgabenAnzahl").text());
	let aktIndex = document.querySelector('ons-carousel').getActiveIndex();
	if(aktIndex  == maxAufgaben + 1){
	for (let i = 0; i<maxAufgaben;i++){
		c = document.getElementsByClassName('loesung')[i].value;
		cc = document.getElementsByClassName('korrekteLoesung')[i].textContent;
		console.log('c: '+ c + ' cc: '+cc);
		if(c == cc){
		korrekt =  true;
		}else {
			korrekt = false}
		console.log('Resultat '+i+': '+document.getElementsByClassName('loesung')[i].value);
		console.log('Korrekt: '+ korrekt + c);
		antworten.Antwort.push({'ergebnis': c,
														'korrekt' : korrekt});
		}
	}
}

function loesung_abgeben(){
	let maxAufgaben = parseInt($("#maxAufgabenAnzahl").text());
	let korrekteAntworten = 0;

	for(var i = 0; i < maxAufgaben; i++){
		//antworten.Antwort.push({"ergebnis":document.getElementsByClassName('loesung')[i].value
		//"korrekt": (JSON.parse(localStorage.getItem(aufgID+"_"+i+"_korrekt"))
	//});
		if(antworten.Antwort[i].korrekt){
			korrekteAntworten += 1;
		}
	}

	let prozente = korrekteAntworten /maxAufgaben * 100;
	antworten.Korrekt = korrekteAntworten;
	antworten.Note = note(prozente);
	Note = antworten.Note;
	console.log('aus zeile 80'+JSON.stringify(antworten));
	sendData();
	antworten = {Antwort:[]};//leert Variable

	window.document.location.href = '/lk_abgegeben?note='+Note;
	}

function sendData(){
	$.ajax({
		url:'/save',
		type: 'POST',
		data: JSON.stringify(antworten),
		contentType: 'application/json; charset=utf-8',
	});
}

function anzeigeAufgabeInNav(){
	let maxAufgaben = $("#maxAufgabenAnzahl").text();
	let aufgIndex = document.querySelector('ons-carousel').getActiveIndex();
	if(document.querySelector('ons-carousel').getActiveIndex() == 0){
		$("#aktAufgabe").html('');
		$("#bezeichnung").html('Begr&uuml;&szlig;ung');
		$("#slash").html('');
		$("#anzahlAufgaben").html('');
	}else if ((aufgIndex > 0) && (aufgIndex <= maxAufgaben)) {
		$("#aktAufgabe").html(aufgIndex);
		$("#bezeichnung").html('Aufgabe&nbsp;');
		$("#slash").html('/');
		$("#anzahlAufgaben").html(maxAufgaben);
	}else {
		$("#aktAufgabe").html('');
		$("#bezeichnung").html('L&ouml;sungen abgeben');
		$("#slash").html('');
		$("#anzahlAufgaben").html('');
	}
}

function setzeFocus(){
	let maxAufgaben = $("#maxAufgabenAnzahl").text();
	let indexActiveItem = document.querySelector('ons-carousel').getActiveIndex();
	if(indexActiveItem > 0 && indexActiveItem <= maxAufgaben){
	document.getElementById('ergebnis_'+(indexActiveItem - 1))._input.focus();
	}
}

function kar_zurueck(){
	document.getElementById("kar").prev();
}

function kar_weiter(){
	document.getElementById("kar").next();
}
