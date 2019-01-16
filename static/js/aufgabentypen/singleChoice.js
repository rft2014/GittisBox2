var aufgabenZaehler = 0;
var json_aufgaben=0;
var antworten = {Antwort:[]};
var AnzahlAufgaben = 0;
var Note = '';



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
  var e = document.getElementById('capital_'+j);
  var antw = e.options[e.selectedIndex].value;
  var loesung = json_aufgaben.Aufgaben[j].option_2;
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
	}else {
		$("#aktAufgabe").html('');
		$("#bezeichnung").html('L&ouml;sungen abgeben');
		$("#slash").html('');
		$("#anzahlAufgaben").html('');
	}
}




function kar_zurueck(){
	document.getElementById("kar").prev();
}

function kar_weiter(){
	document.getElementById("kar").next();
}
