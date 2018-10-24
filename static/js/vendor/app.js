



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
