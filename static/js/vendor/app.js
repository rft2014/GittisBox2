



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
