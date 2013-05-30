function publishWallPost() {
    
    FB.ui({
		method: 'feed',
		link: 'http://www.sismobile.com.br/',
		picture: 'http://www.sismobile.com.br/images/sismobile.jpg',
		name: 'Sys Mobi Le',
		caption: 'Snake Xtreme',
		description: 'Venha competir com seus amigos do Facebook!'
    });
}
function carregando(){}
function dump(arr,level) {
   var dumped_text = "";
   if(!level) level = 0;
 
   //The padding given at the beginning of the line.
   var level_padding = "";
   for(var j = 0;j < level+1;j++)
     level_padding += "    ";
 
   if(typeof(arr) == 'object') //Array/Hashes/Objects
   {
     for(var item in arr)
     {
        var value = arr[item];
 
        if(typeof(value) == 'object') //If it is an array,
        {
           dumped_text += level_padding + "'" + item + "' ...<p>";
           dumped_text += dump(value,level+1);
        }
        else
        {
           dumped_text += level_padding + "'" + item + "' => \"" + value + "\"<p>";
        }
     }
   }
   else //Stings/Chars/Numbers etc.
   {
     dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
   }
   return dumped_text;
}
var Configuracao = {
	velocidade: 100,
	tempoBombaAtiva: 15000,
	tempoFrutaAtiva: 5000,
	tempoEstrelaAtiva:2000,
	largura:10
}


var contexto;
var Canvas = {
	_init:function(){
		
		// Defindindo canvas
		var objCanvas = document.getElementById('canvas');
		contexto = objCanvas.getContext("2d");
		
		Canvas.maxWidth = parseInt(objCanvas.width);
		Canvas.maxHeight = parseInt(objCanvas.height);		
		Canvas._bg();
	},
	_bg:function(){
		contexto.clearRect(0,0,Canvas.maxWidth,Canvas.maxHeight);

		/* Criando um retangulo com degrade */
		contexto.beginPath();
		var gradient = contexto.createLinearGradient(Canvas.maxWidth, 0, 0, Canvas.maxHeight);
		gradient.addColorStop(0,'#447bb1');
		gradient.addColorStop(1,'#447bb1');
		contexto.fillStyle = gradient;
		contexto.fillRect(0, 0, Canvas.maxWidth, Canvas.maxHeight);			
		contexto.closePath();
	},
	_preencher:function(){

		Canvas._bg();
		var tiles = [];

		if(Snake.god==1){

			for(i=0;i<Snake.tamanho;i++){
				var imageObj = new Image();
				imageObj.src = "./image/snake.png";
				tiles.push(imageObj);
			}

			for(j=0;j<Snake.tamanho;j++){

			    var eixoX = Snake.corpo[j].x * Configuracao.largura;
			    var eixoY = Snake.corpo[j].y * Configuracao.largura;
			    contexto.drawImage(tiles[j], eixoX, eixoY);				
			}
			Snake.tempoGod += 1;
			document.getElementById('star').innerHTML = "Stars: " + (100 - Snake.tempoGod);
			if(Snake.tempoGod==100){
				Snake.tempoGod=0;
				Snake.god=0;
			}

		}else{

			for(i=0;i<Snake.tamanho;i++){

				contexto.fillStyle = "#000";;
				contexto.beginPath();
				contexto.fillRect(Snake.corpo[i].x * Configuracao.largura, Snake.corpo[i].y * Configuracao.largura, Configuracao.largura, Configuracao.largura);			
				contexto.closePath();
								
			}
		}
		
		Snake._mover();
		
		Jogo.tempo += Configuracao.velocidade;
		if(Jogo.tempo % (Configuracao.velocidade*50) ==0){ 
			/***A cada movimento da cobra jogo.tempo soma 100!***/
			/*** Se jogo.tempo/5000 for igual a ZERO adicionar estrela!***/
			/***Resumindo a cada 5 segundos uma estrela Ã© adicionada!***/			
			Bombas._adicionar();
			Frutas._adicionar();
			Estrela._adicionar();
		}
		
		Bombas._preencher();
		Frutas._preencher();
		Estrela._preencher();
		Bombas._capturar();
		Frutas._capturar();
		Estrela._capturar();
	}
}	
var Estrela = {
	lista:new Array(),
	_adicionar:function(){
	
		var lugar_ocupado = true;
		var estrela_x, estrela_y;
		
		while(lugar_ocupado==true){
			lugar_ocupado = false;
			estrela_x = parseInt(Math.random()* (Canvas.maxWidth / Configuracao.largura));
			estrela_y = parseInt(Math.random()* (Canvas.maxHeight / Configuracao.largura));
			for(i=0;i<Snake.tamanho;i++){
				if(Snake.corpo[i].x == estrela_x && Snake.corpo[i].y == estrela_y){
					//O lugar esta ocupado pela cobra!				
					lugar_ocupado = true;				
				}
			}				
		}	
			
		Estrela.lista.push({
			x:estrela_x,
			y:estrela_y,
			inicio:Jogo.tempo
		});
		
	},
	_preencher:function(){
		
		
		var tiles = [];
		for(i=0;i<Estrela.lista.length;i++){
				
				var imageObj = new Image();
				imageObj.src = "./image/estrela.png";
        			tiles.push(imageObj);
				
		}
		for(j=0;j<Estrela.lista.length;j++){

			var eixoX = Estrela.lista[j].x * Configuracao.largura;
			var eixoY = Estrela.lista[j].y * Configuracao.largura;
			
			
			contexto.drawImage(tiles[j], eixoX, eixoY);
							
		}	
		if(Estrela.lista.length>0){
			if(Estrela.lista[0].inicio + Configuracao.tempoEstrelaAtiva < Jogo.tempo){
				/*Caso a lista de Bombas seja maior que ZERO, retirar 1 elemento*/
				/*a cada 5 segundos!*/
 				Estrela.lista.shift();
			}
		}	
	},
	_capturar:function(){
		for(i=0;i<Estrela.lista.length;i++){
			/*FÃ³rmula da distancia entre 2 pontos no plano!*/
			/*D = sqrt( (x2 â€“ x1)^2 + (y2 â€“ y1) ^2)*/
			var distancia = Math.ceil(Math.sqrt((Estrela.lista[i].x-(Snake.corpo[Snake.tamanho-1].x))*(Estrela.lista[i].x-(Snake.corpo[Snake.tamanho-1].x)) + (Estrela.lista[i].y-(Snake.corpo[Snake.tamanho-1].y))*(Estrela.lista[i].y-(Snake.corpo[Snake.tamanho-1].y))));

			if(distancia<=1){
				Snake.god=1;
				Snake._crescer();
				Jogo.pontos += 1000;
				return Estrela._remover(i);
			}
		}	
	},
	_remover:function(Indice){
		for(i=Indice;i + 1<Estrela.lista.length;i++){
			Estrela.lista[i].x = Estrela.lista[i+1].x;
			Estrela.lista[i].y = Estrela.lista[i+1].y;
		}
		/*Percorre a lista de Estrelas de retira a que colidiu com a cobra!*/	
		Estrela.lista.pop();
	}

}
var Frutas = {
	lista:new Array(),
	_adicionar:function(){
	
		var lugar_ocupado = true;
		var frutas_x, frutas_y;
		
		while(lugar_ocupado==true){
			lugar_ocupado = false;
			frutas_x = parseInt(Math.random()* (Canvas.maxWidth / Configuracao.largura));
			frutas_y = parseInt(Math.random()* (Canvas.maxHeight / Configuracao.largura));
			for(i=0;i<Snake.tamanho;i++){
				if(Snake.corpo[i].x == frutas_x && Snake.corpo[i].y == frutas_y){
					//O lugar esta ocupado pela cobra!				
					lugar_ocupado = true;				
				}
			}				
		}	
		if(Frutas.lista.length<7){	
			Frutas.lista.push({
				x:frutas_x,
				y:frutas_y,
				inicio:Jogo.tempo
			});
		}
	},
	_preencher:function(){
		
		
		var tiles = [];
		for(i=0;i<7;i++){
				
				var imageObj = new Image();
				imageObj.src = "./image/fruit"+i+".png";
        		tiles.push(imageObj);
				
		}
		for(j=0;j<Frutas.lista.length;j++){

			var eixoX = Frutas.lista[j].x * Configuracao.largura;
			var eixoY = Frutas.lista[j].y * Configuracao.largura;
			
			//imageObj.onload = function() {
			contexto.drawImage(tiles[j], eixoX, eixoY);
			//};
			
			//contexto.fillStyle = "#1D9F53";
			//contexto.beginPath();
			//contexto.fillRect(Bombas.lista[i].x * Configuracao.largura, Bombas.lista[i].y * Configuracao.largura, Configuracao.largura, Configuracao.largura);			
			//contexto.closePath();					
		}	
		if(Frutas.lista.length>0){
			if(Frutas.lista[0].inicio + Configuracao.tempoFrutaAtiva < Jogo.tempo){
				/*Caso a lista de Bombas seja maior que ZERO, retirar 1 elemento*/
				/*a cada 5 segundos!*/
 				//Frutas.lista.shift();
			}
		}	
	},
	_capturar:function(){
		for(i=0;i<Frutas.lista.length;i++){
			/*FÃ³rmula da distancia entre 2 pontos no plano!*/
			/*D = sqrt( (x2 â€“ x1)^2 + (y2 â€“ y1) ^2)*/
			var distancia = Math.ceil(Math.sqrt((Frutas.lista[i].x-(Snake.corpo[Snake.tamanho-1].x))*(Frutas.lista[i].x-(Snake.corpo[Snake.tamanho-1].x)) + (Frutas.lista[i].y-(Snake.corpo[Snake.tamanho-1].y))*(Frutas.lista[i].y-(Snake.corpo[Snake.tamanho-1].y))));

			if(distancia<=1){
				Snake._crescer();
				Jogo.pontos += 100;
				return Frutas._remover(i);
			}
		}	
	},
	_remover:function(Indice){
		for(i=Indice;i + 1<Frutas.lista.length;i++){
			Frutas.lista[i].x = Frutas.lista[i+1].x;
			Frutas.lista[i].y = Frutas.lista[i+1].y;
		}
		/*Percorre a lista de Bombas de retira a que colidiu com a cobra!*/	
		Frutas.lista.pop();
	}

}

var Bombas = {
	lista:new Array(),
	_adicionar:function(){
	
		var lugar_ocupado = true;
		var bomba_x, bomba_y;
		
		while(lugar_ocupado==true){
			lugar_ocupado = false;
			bomba_x = parseInt(Math.random()* (Canvas.maxWidth / Configuracao.largura));
			bomba_y = parseInt(Math.random()* (Canvas.maxHeight / Configuracao.largura));
			for(i=0;i<Snake.tamanho;i++){
				if(Snake.corpo[i].x == bomba_x && Snake.corpo[i].y == bomba_y){
					//O lugar esta ocupado pela cobra!				
					lugar_ocupado = true;				
				}
			}				
		}		
		Bombas.lista.push({
			x:bomba_x,
			y:bomba_y,
			inicio:Jogo.tempo
		});
	},
	_preencher:function(){
		
		
		var tiles = [];
		for(i=0;i<Bombas.lista.length;i++){
				
				var imageObj = new Image();
				imageObj.src = "./image/ghost4.png";
        		tiles.push(imageObj);
				
		}
		
		for(j=0;j<Bombas.lista.length;j++){

			var eixoX = Bombas.lista[j].x * Configuracao.largura;
			var eixoY = Bombas.lista[j].y * Configuracao.largura;
			
			//imageObj.onload = function() {
			contexto.drawImage(tiles[j], eixoX, eixoY);
			//};
			
			//contexto.fillStyle = "#1D9F53";
			//contexto.beginPath();
			//contexto.fillRect(Bombas.lista[i].x * Configuracao.largura, Bombas.lista[i].y * Configuracao.largura, Configuracao.largura, Configuracao.largura);			
			//contexto.closePath();					
		}	
		if(Bombas.lista.length>0){
			if(Bombas.lista[0].inicio + Configuracao.tempoBombaAtiva < Jogo.tempo){
				/*Caso a lista de Bombas seja maior que ZERO, retirar 1 elemento*/
				/*a cada 5 segundos!*/
 				Bombas.lista.shift();
			}
		}	
	},
	_capturar:function(){
		for(i=0;i<Bombas.lista.length;i++){
			/*FÃ³rmula da distancia entre 2 pontos no plano!*/
			/*D = sqrt( (x2 â€“ x1)^2 + (y2 â€“ y1) ^2)*/
			var distancia = Math.ceil(Math.sqrt((Bombas.lista[i].x-(Snake.corpo[Snake.tamanho-1].x))*(Bombas.lista[i].x-(Snake.corpo[Snake.tamanho-1].x)) + (Bombas.lista[i].y-(Snake.corpo[Snake.tamanho-1].y))*(Bombas.lista[i].y-(Snake.corpo[Snake.tamanho-1].y))));

			if(distancia<=1 && Snake.god==1){
				Snake._crescer();
				Jogo.pontos += 500;
				return Bombas._remover(i);
			}else if(distancia<=1){
				return Jogo._gameOver();
			}
		}	
	},
	_remover:function(Indice){
		for(i=Indice;i + 1<Bombas.lista.length;i++){
			Bombas.lista[i].x = Bombas.lista[i+1].x;
			Bombas.lista[i].y = Bombas.lista[i+1].y;
		}
		/*Percorre a lista de Bombas de retira a que colidiu com a cobra!*/	
		Bombas.lista.pop();
	}
}




var Snake = {
	tamanho: 0, /* binario */
	direcao: 0, /* estilo css */
	god: 0, /* poder de comer as bombas */
	tempoGod: 0,
	ultimaDirecao: 0, /* ultima direcao do snake na funcao mover */
	corpo: new Array(),
	_mover:function(){
		Jogo._placar();
		
		var novo_x = Snake.corpo[Snake.tamanho-1].x;
		var novo_y = Snake.corpo[Snake.tamanho-1].y;
		if(Snake.direcao==0) novo_y--; // CIMA
		if(Snake.direcao==1) novo_x++; // DIREITA
		if(Snake.direcao==2) novo_y++; // BAIXO
		if(Snake.direcao==3) novo_x--;; // ESQUERDA
		Snake.ultimaDirecao = Snake.direcao;
		
		for(i=0;i<Snake.tamanho-1;i++){
			Snake.corpo[i].x = Snake.corpo[i+1].x;
			Snake.corpo[i].y = Snake.corpo[i+1].y;
			if(Snake.corpo[i].x==novo_x && Snake.corpo[i].y==novo_y){
				if(Snake.god==0){
					//A cobra colidiu contra ela mesma!
 					return Jogo._gameOver();
				}
			}			
		}
		//document.getElementById('dump').innerHTML = dump(Snake.corpo);
		Snake.corpo[Snake.tamanho-1].x = novo_x;
		Snake.corpo[Snake.tamanho-1].y = novo_y;
		//document.getElementById('dump').innerHTML = dump(Snake.corpo);
		// Verificando se bateu na parede
		if( (Snake.corpo[Snake.tamanho-1].x * Configuracao.largura >= Canvas.maxWidth || Snake.corpo[Snake.tamanho-1].x < 0) && Snake.god==0){
			return Jogo._gameOver();
		}else if( (Snake.corpo[Snake.tamanho-1].x * Configuracao.largura >= Canvas.maxWidth || Snake.corpo[Snake.tamanho-1].x < 0) && Snake.god==1){
			if(Snake.ultimaDirecao==0) Snake.direcao = 2; 
			if(Snake.ultimaDirecao==2) Snake.direcao = 0; 
			if(Snake.ultimaDirecao==1) Snake.direcao = 3; 
			if(Snake.ultimaDirecao==3) Snake.direcao = 1; 
		}
		if( (Snake.corpo[Snake.tamanho-1].y * Configuracao.largura >= Canvas.maxHeight || Snake.corpo[Snake.tamanho-1].y < 0) && Snake.god==0){
			return Jogo._gameOver();
		}else if( (Snake.corpo[Snake.tamanho-1].y * Configuracao.largura >= Canvas.maxHeight || Snake.corpo[Snake.tamanho-1].y < 0) && Snake.god==1){
			if(Snake.ultimaDirecao==0) Snake.direcao = 2; 
			if(Snake.ultimaDirecao==2) Snake.direcao = 0; 
			if(Snake.ultimaDirecao==1) Snake.direcao = 3; 
			if(Snake.ultimaDirecao==3) Snake.direcao = 1; 
		}
	},
	_crescer:function(){
		//document.getElementById('dump').innerHTML = dump(Snake.corpo);
		/***Aumenta o tamanho da cobra em 3 unidades***/
		/***consequentemente adiciona ao corpo da cobra 3 novas coordenadas!***/
		Snake.corpo.unshift({
			x:Snake.corpo[0].x-1,
			y:Snake.corpo[0].y
		},{
			x:Snake.corpo[0].x-1,
			y:Snake.corpo[0].y
		},{
			x:Snake.corpo[0].x-1,
			y:Snake.corpo[0].y
		});
		//document.getElementById('dump').innerHTML = dump(Snake.corpo);
		Snake.tamanho += 3;
	}
}



var Jogo = {
	play:'',
	pontos: 0,
	tempo: 0,
	_iniciar:function(){
		Snake.tamanho = 5;
		Snake.direcao = 1;
		Jogo.tempo = 0;
		Jogo.pontos = 0;
		Bombas.lista = new Array();
		Frutas.lista = new Array();
		for(i=0;i<Snake.tamanho;i++){ Snake.corpo[i]={ x:i, y:0 } }	
		Jogo._play();
		document.getElementById('pontos').innerHTML = '<b>Points: 0</b>';
      
	},
	_placar:function(){
		Jogo.pontos++;
		if(Jogo.pontos%10==0) document.getElementById('pontos').innerHTML = '<b>Points: </b>'+Jogo.pontos;
	},
	_play:function(){
		if(Jogo.play!='') clearInterval(Jogo.play);
		Jogo.play = setInterval(Canvas._preencher, Configuracao.velocidade);	
	},
	_gameOver:function(){
		if(Jogo.play!=''){
			var url = 'salvaPlacar.php';
		  	var parametros = 'usuario='+$("usuario").value+'&pontos='+Jogo.pontos;
		  	var myAjax = new Ajax.Request( url, { method: 'post', parameters: parametros, onLoading: carregando, 
				onComplete: function(transport){
					document.getElementById('dump').innerHTML = transport.responseText;				
			} });
			Canvas._bg();
			publishWallPost();
			clearInterval(Jogo.play);
		}
	},
	_pausar:function(){
		if(Jogo.play!=''){
			clearInterval(Jogo.play);
			Jogo.play = '';
		} else {
			Jogo._play();
		}	
	},
	_controles:function(e, event){
		if (window.event){  e = window.event; }
		switch(e.keyCode){
			case 73:
				Jogo._iniciar();
				e.preventDefault();
				break;
			case 80:
				Jogo._pausar();
				e.preventDefault();
				break;
			case 38:
				if(Snake.ultimaDirecao!=2) Snake.direcao = 0; // SETA PRA CIMA
				e.preventDefault();
				break;
			case 39:
				if(Snake.ultimaDirecao!=3) Snake.direcao = 1; // SETA PRA DIREITA
				e.preventDefault();
				break;
			case 40:
				if(Snake.ultimaDirecao!=0) Snake.direcao = 2; // SETA PRA BAIXO
				e.preventDefault();
				break;
			case 37:
				if(Snake.ultimaDirecao!=1) Snake.direcao = 3; // SETA PRA ESQUERDA
				e.preventDefault();
				break;
		}
	}
}



window.onload = Canvas._init;
document.onkeydown = Jogo._controles;