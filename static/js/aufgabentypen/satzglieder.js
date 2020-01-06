var aufgabenZaehler = 0;
var json_aufgaben=0;
var antworten = {Antwort:[]};
var AnzahlAufgaben = 0;
var Note = '';
var Satzglieder = ["Subjekt","Prädikat","Genitivobjekt","Akkusativobjekt","Dativobjekt"];


$(document).ready(function(){
$("#user").hide();
$("#maxAufgabenAnzahl").hide();
$(".korrekteLoesung").hide();
$("#alleAufg").hide()


var today = new Date();
anzeigeAufgabeInNav();
	antworten.user = $("#user").html();
	antworten.Abgegeben = today.toLocaleString('de-DE');
	antworten.Aufgaben_ID = $("#aufg_id").text();
	antworten.firstname = $("#firstname").text();
	antworten.lastname = $("#lastname").text();
	antworten.klasse = $("#klasse").text().trim();
	antworten.insNotenbuch = false;




  document.querySelector('ons-carousel').addEventListener('postchange', function(){
	anzeigeAufgabeInNav();
	checkResults();
  });

var AUFGABEN = $('#alleAufg').html();
json_aufgaben=JSON.parse(AUFGABEN);




});

function checkResults(){
  let maxAufgabenAnzahl = json_aufgaben.Aufgaben.length;
  let aktIndex = document.querySelector('ons-carousel').getActiveIndex();
  if(aktIndex  == maxAufgabenAnzahl + 1){
  for (var j=0;j<maxAufgabenAnzahl;j++){
  	for(var i=0;i<json_aufgaben.Aufgaben[j].option_2.length;i++){
  var e = document.getElementById('auswahl'+j+i);
  var antw = e.options[e.selectedIndex].value;
  var loesung = json_aufgaben.Aufgaben[j].option_2[i];
  console.log('gewaehlt: '+antw+' richtig waere: '+loesung);
  if(antw == loesung){
		korrekt =  true;
		}else {
			korrekt = false}
      antworten.Antwort.push({'ergebnis': antw,
								'korrekt' : korrekt});
                      }
                  }
              }
}

function loesung_abgeben(){
	let maxAufgaben = parseInt($("#maxAufgabenAnzahl").text());
	let korrekteAntworten = 0;

	for(var i = 0; i < maxAufgaben; i++){

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
	}else if ((aufgIndex > 0) && (aufgIndex == (parseInt(maxAufgaben) + 1))){
		$("#aktAufgabe").html('');
		$("#bezeichnung").html('L&ouml;sungen abgeben');
		$("#slash").html('');
		$("#anzahlAufgaben").html('');
	}else{
		$("#aktAufgabe").html('');
		$("#bezeichnung").html('Auswertung');
		$("#slash").html('');
		$("#anzahlAufgaben").html('');
  }
}

function antworten_pruefen(){
kar_weiter();

let anzahl = json_aufgaben.Aufgaben.length
$('#antwortTabelle').append('<ons-row><ons-col width=\'10%\'></ons-col><ons-col style=\'font-weight:bold\'width=\'40%\'>Antwort</ons-col><ons-col style=\'font-weight:bold\' width=\'40%\'>Lösung</ons-col><ons-col style=\'font-weight:bold\'>ok</ons-col></ons-row>');
  for (let k = 0;k<anzahl;k++){
  	for(let l = 0;l<json_aufgaben.Aufgaben[k].option_2.length;l++){
		var e = document.getElementById('auswahl'+k+l);
		var antw = e.options[e.selectedIndex].value;
		if(antw === json_aufgaben.Aufgaben[k].option_2[l]){
		$('#antwortTabelle').append('<ons-row><ons-col width=\'10%\' style=\'font-weight:bold; color:green\'>'+(parseInt(k)+1)+'.'+(parseInt(l)+1)+'</ons-col><ons-col style=\'color:green\' width=\'40%\'>'+antw+'</ons-col><ons-col style=\'color:green\' width=\'40%\'>'+ json_aufgaben.Aufgaben[k].option_2[l] +'</ons-col><ons-col><ons-icon style=\'color:green; text-align:right\' icon=\'md-check\'></ons-icon></ons-col></ons-row>');
	}else{$('#antwortTabelle').append('<ons-row><ons-col  width=\'10%\' style=\'font-weight:bold; color:red\'>'+(parseInt(k)+1)+'.'+(parseInt(l)+1)+'</ons-col><ons-col style=\'color:red\' width=\'40%\'>'+antw+'</ons-col><ons-col style=\'color:red\' width=\'40%\'>'+ json_aufgaben.Aufgaben[k].option_2[l] +'</ons-col><ons-col><ons-icon style=\'color:red\' icon=\'md-close\'></ons-icon></ons-col></ons-row>');
}



  }}

}


function kar_zurueck(){
	document.getElementById("kar").prev();
}

function kar_weiter(){
	document.getElementById("kar").next();
}

