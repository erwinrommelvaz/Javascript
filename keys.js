var Chaveiro = {
 
		"conjuntoChaves" : [],
		"elementosEditaveis" : [],
		
		"empacotaChave" : function(elementoHtml){
	
			 for (var i=0; i < Chaveiro.conjuntoChaves.length; i++) {
 
			 	var pecasDaChave = Chaveiro.conjuntoChaves[i].html;
			
				if(pecasDaChave==elementoHtml){
 
					var chave  = "tabela="+Chaveiro.conjuntoChaves[i].tabela;
					    chave += "&campo="+Chaveiro.conjuntoChaves[i].campo;
					    chave += "&id1="+Chaveiro.conjuntoChaves[i].id1;
					    chave += "&id2="+Chaveiro.conjuntoChaves[i].id2;
					    chave += "&id3="+Chaveiro.conjuntoChaves[i].id3;
					    chave += "&id4="+Chaveiro.conjuntoChaves[i].id4;
					    chave += "&id5="+Chaveiro.conjuntoChaves[i].id5;
					    chave += "&id6="+Chaveiro.conjuntoChaves[i].id6;
					    chave += "&id7="+Chaveiro.conjuntoChaves[i].id7;
					    chave += "&id8="+Chaveiro.conjuntoChaves[i].id8;
 
					return chave;
				}
 
			 }
		},
		"encontraChaveChaveiro" : function(elementoHtml){
			
			 for (var i=0; i < Chaveiro.conjuntoChaves.length; i++) {
			
			 	var pecasDaChave = Chaveiro.conjuntoChaves[i].html;
			
				if(pecasDaChave==elementoHtml){
 
					return Chaveiro.conjuntoChaves[i];
				}
 
			 }
		},
		"pecasDaChave" : function elementoHtml,tabela,campo,id1,id2,id3,id4,id5,id6,id7,id8){
		
			var _chave = this;
 
		  	_chave.html = elementoHtml;
		  	_chave.tabela = tabela;
			_chave.campo = campo;
		  	_chave.id1 = id1;
			_chave.id2 = id2;
			_chave.id3 = id3;
			_chave.id4 = id4;
			_chave.id5 = id5;
			_chave.id6 = id6;
			_chave.id7 = id7;
			_chave.id8 = id8;
		 	Chaveiro.conjuntoChaves.push(_chave);
		
			_chave = null;
		
			Chaveiro.elementosEditaveis.push(elementoHtml);	
 
		}
	}