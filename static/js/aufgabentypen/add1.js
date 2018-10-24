var aufgabenZaehler = 0;
var jsonAufgabenGlobal;
var antworten = {Antwort:[]};
var AnzahlAufgaben = 0;
var Note = '';
$(document).ready(function(){
$("#user").hide();
$("#aufgabe").hide();

var aktAufg = $("#aufgabe").html();
$.getJSON(aktAufg, function(aufgaben){
console.log('Die Aufgabe in add1: '+aktAufg);
	AnzahlAufgaben = Object.keys(aufgaben.Aufgaben).length;
	anzeigeAufgabe();
	$("#rel1").html(aufgaben.Aufgaben[aufgabenZaehler].sum1);
	$("#rel2").html(aufgaben.Aufgaben[aufgabenZaehler].sum2);
	$("#operator").html("&#043;");
	jsonAufgabenGlobal = aufgaben;
	aufgID = aufgaben.Aufgaben_id;
	antworten.user = $("#user").html();
	antworten.Aufgaben_ID = aufgID;
	antworten.Abgegeben = Date.now();
	antworten.firstname = $("#firstname").text();
	antworten.lastname = $("#lastname").text();
	antworten.klasse = $("#klasse").text().trim();
let result_tmp = localStorage.getItem(aufgID+"_"+aufgabenZaehler);
	if(result_tmp != ''){
		$('#result').val(result_tmp);
	}else{
		$("#result").val('');
		}
	});
});
function weiter(){

aufgabenZaehler += 1;

	let result_tmp = localStorage.getItem(aufgID+"_"+aufgabenZaehler);
	if(result_tmp != ''){
		$('#result').val(result_tmp);
	}else{
		$("#result").val('');
	}
	$("#rel1").html(jsonAufgabenGlobal.Aufgaben[aufgabenZaehler].sum1);
	$("#rel2").html(jsonAufgabenGlobal.Aufgaben[aufgabenZaehler].sum2);
	anzeigeAufgabe();
}



function zurueck(){
aufgabenZaehler -= 1;
	$("#rel1").html(jsonAufgabenGlobal.Aufgaben[aufgabenZaehler].sum1);
	$("#rel2").html(jsonAufgabenGlobal.Aufgaben[aufgabenZaehler].sum2);
	var ergebnis = localStorage.getItem(aufgID+"_"+aufgabenZaehler);
	$('#result').val(ergebnis);
	anzeigeAufgabe();

}

function speichern(){
	let a = jsonAufgabenGlobal.Aufgaben[aufgabenZaehler].sum1
	let b = jsonAufgabenGlobal.Aufgaben[aufgabenZaehler].sum2
	if((parseInt(a) + parseInt(b)) == parseInt($("#result").val())){
		localStorage.setItem(aufgID+"_"+aufgabenZaehler+"_korrekt", "1");
	}else{
		localStorage.setItem(aufgID+"_"+aufgabenZaehler+"_korrekt", '0');
	}
	localStorage.setItem(aufgID+"_"+aufgabenZaehler,$("#result").val());
console.log(aufgID);
}

function loesung_abgeben(){
	let korrekteAntworten = 0;
	for(var i = 0; i < AnzahlAufgaben; i++){
		antworten.Antwort.push({"ergebnis":(JSON.parse(localStorage.getItem(aufgID+"_"+i))),
		"korrekt": (JSON.parse(localStorage.getItem(aufgID+"_"+i+"_korrekt")))});
		if(antworten.Antwort[i].korrekt == '1'){
			korrekteAntworten += 1;
		}
	}
	let prozente = korrekteAntworten / AnzahlAufgaben * 100;
	antworten.Korrekt = korrekteAntworten;
	antworten.Note = note(prozente);
	Note = antworten.Note;
	console.log(JSON.stringify(antworten));
	sendData();
	antworten = {Antwort:[]};//leert Variable
	localStorage.clear();
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

function anzeigeAufgabe(){
	$("#aktAufgabe").html(aufgabenZaehler + 1);
	$("#anzahlAufgaben").html(AnzahlAufgaben);

	if((aufgabenZaehler + 1) === AnzahlAufgaben){
		$("#btn_weiter").removeClass("button large secondary cell auto").addClass("button large secondary cell auto disabled");
		$("#btn_weiter").attr("onclick", "");
		$("#btn_abgeben").removeClass("button large secondary cell auto disabled").addClass("button large secondary cell auto");
		$("#btn_abgeben").attr("onclick", "loesung_abgeben()");
	}
	if((aufgabenZaehler + 1) < AnzahlAufgaben){
		$("#btn_weiter").removeClass("button large secondary cell auto disabled").addClass("button large secondary cell auto");
		$("#btn_weiter").attr("onclick", "weiter()");
		$("#btn_abgeben").removeClass("button large secondary cell auto").addClass("button large secondary cell auto disabled");
		$("#btn_abgeben").attr("onclick", "");
	}
	if((aufgabenZaehler + 1) > 1 ){
		$("#btn_zurueck").removeClass("button large secondary cell auto disabled").addClass("button large secondary cell auto");
		$("#btn_zurueck").attr("onclick", "zurueck()");
	}
	if((aufgabenZaehler + 1) === 1 ){
		$("#btn_zurueck").removeClass("button large secondary cell auto").addClass("button large secondary cell auto disabled");
		$("#btn_zurueck").attr("onclick", "");




	}
}
