/*
     * Autosuggest
     * Autor: Erwin Rommel O Vaz
     * Site:  http://www.sismobile.com.br
     */
        
    
    var Autosugest = function() { };
    
    Autosugest.defaults = {
        
        id:					false,
        div:				'autosuggest',
        size_id:			'',
        size_div:			'',
        div_class:			'',
        timer:				false,
        delay:				2000,
        load_url:           'pessoas.php',
        escape_function:	encodeURIComponent,	// or escape
        on_blur:			'',
        mouseover_class:	'auto_mouseover',
        message_text:		'Pesquisando...',
        message_class:		'auto_pesquisando',
        message_title:		'Digite o que voçê esta procurando!',
        keyUp:				'keyup',
        keyDow:				'keydown',
        ajax_data:			 false,
        eligible:			 Array(),
        highlighted:		 -1,
        TAB: 				  9,
        ESC: 				 27,
        KEYUP: 				 38,
        KEYDN: 				 40,
        ENTER:				 13,
        loadfailed_text:                 'Ooops, algo deu errado!',
    
        // Private options that are managed for you.
        // PLEASE DO NOT TOUCH THESE.
        is_empty:			false,
        orig_text:			'',
        mouseover_observer:		false,
        mouseout_observer:		false,
        key_observer:			false
    };
    
    Autosugest.options = { };
    
    Autosugest.sugest = function(args) {
    
        var id = args['id'];
        
        var id_opt = Autosugest._getOptionsReference(id);
    
        for(var i in Autosugest.defaults) {
            id_opt[i] = Autosugest.defaults[i];
        }
    
        for(var i in args) {
            id_opt[i] = args[i];
        }
    
        if($(id).value == '') {
            id_opt['is_empty'] = true;
        }
    
        id_opt['mouseover_observer'] = Autosugest._mouseOver.bindAsEventListener();
        id_opt['mouseout_observer'] = Autosugest._mouseOut.bindAsEventListener();
        id_opt['keyUp_observer'] = Autosugest._keyUp.bindAsEventListener();
        id_opt['keyDow_observer'] = Autosugest._keyDow.bindAsEventListener();
    
        
        Event.observe(id, 'mouseover', id_opt['mouseover_observer']);
        Event.observe(id, 'mouseout', id_opt['mouseout_observer']);
        Event.observe(id, id_opt['keyUp'], id_opt['keyUp_observer']);
        Event.observe(id, id_opt['keyDow'], id_opt['keyDow_observer']);
    
        $(id).title = id_opt['message_title'];
    
        $(id).size = id_opt['size_id'];
    
        $(id).setAttribute("autocomplete","off");
    
        $(id_opt['div']).style.display = 'none';
    
        return(id_opt);
    };
    Autosugest._getOptionsReference = function(id) {
        
        if(!Autosugest.options[id]) {
            Autosugest.options[id] = { };
        }
    
        return(Autosugest.options[id]);
    };
    Autosugest._mouseOver = function(event) {
        var id = Event.element(event).id;
        var id_opt = Autosugest._getOptionsReference(id);
    
        Element.addClassName(id, id_opt['mouseover_class']);
    };
    
    Autosugest._mouseOut = function(event) {
        var id = Event.element(event).id;
        var id_opt = Autosugest._getOptionsReference(id);
    
        Element.removeClassName(id, id_opt['mouseover_class']);
    };
    Autosugest._keyUp = function(event) {
        
        var id = Event.element(event).id;
        var id_opt = Autosugest._getOptionsReference(id);
        var key = Autosugest.getKeyCode(event);
        switch(key){
        
            case id_opt['ENTER']:
            case id_opt['TAB']:
            case id_opt['ESC']:
            case id_opt['KEYUP']:
            case id_opt['KEYDN']:
                return;
            default:
            
                return;
        }
    }
    Autosugest._keyDow = function(event) {
    
        var id = Event.element(event).id;
        var id_opt = Autosugest._getOptionsReference(id);
        var key = Autosugest.getKeyCode(event);
        
        switch(key){
            
            case id_opt['ENTER']:
            //Autosugest.useSuggestion();
            break;
    
            case id_opt['TAB']:
            //Autosugest.useSuggestion();
            break;
    
            case id_opt['ESC']:
            Autosugest.hideDiv(id);
            break;
    
            case id_opt['KEYUP']:
            //Autosugest.changeHighlight(key);
            break;
    
            case id_opt['KEYDN']:
            //Autosugest.changeHighlight(key);
            break;
    
            default:
            if (id_opt['timer']) {
                window.clearTimeout(id_opt['timer']);
            }
            id_opt['timer'] = window.setTimeout('Autosugest.pesquisar("'+id+'")', id_opt['delay']);
            break;
        }
    }
    Autosugest.pesquisar = function(id){
    
        var id_opt = Autosugest._getOptionsReference(id);
        var new_text = id_opt['escape_function']($F(id));
        var params = 'id=' + id + '&content=' + new_text;
        if(id_opt['ajax_data']) {
            for(var i in id_opt['ajax_data']) {
                var url_data = id_opt['escape_function'](id_opt['ajax_data'][i]);
                params += '&' + i + '=' + url_data;
            }
        }
        var saving = '' + id_opt['message_text'] + '\n';
    
        var ajax_req = new Ajax.Request(
            id_opt['load_url'],
            {
                method: 'post',
                postBody: params,
                onSuccess: function(t) { Autosugest._loadComplete(id, t); },
                onFailure: function(t) { Autosugest._loadFailed(id, t); }
            }
        );
    
    }
    
    Autosugest._loadComplete = function(id, t) {
    
        var id_opt = Autosugest._getOptionsReference(id);
        id_opt['eligible']=Array();
        
        if(t.status=='200'){
    
            var myObj = t.responseText.evalJSON(true);
            if(myObj.length>0){
    
                for (var i=0;i< myObj.length; ++i){
    
                    if(myObj[i].nome.toLowerCase().indexOf($F(id).toLowerCase()) != "-1"){
                      id_opt['eligible'].push(myObj[i]);
                    }
                }
        
            }else{
                
                var resposta = [{"id":"","imagem":"","nome":"Nenhum elemento encontrado!","email":"","aniversario":"","sexo":"","cidade":"","pais":""}];
                alert(resposta[0].nome);
                id_opt['eligible'].push(resposta[0]);
                
            }
            
            Autosugest.createDiv(id);
            Autosugest.positionDiv(id);
            Autosugest.showDiv(id);
            Autosugest.cancelEvent();
    
        }else{
            
            Autosugest._loadFailed(id, t);
        }
    }
    Autosugest._loadFailed = function(id, t) {
    
        var id_opt = Autosugest.getOptionsReference(id);
    
        alert(id_opt['loadfailed_text']);
    
        Event.observe(id, 'mouseover', id_opt['mouseover_observer']);
        Event.observe(id, 'mouseout', id_opt['mouseout_observer']);
        Event.observe(id, id_opt['keyUp'], id_opt['keyUp_observer']);
        Event.observe(id, id_opt['keyDow'], id_opt['keyDow_observer']);
    }
    Autosugest.getKeyCode = function(ev){
        if(ev)			//Moz
        {
            return ev.keyCode;
        }
        if(window.event)	//IE
        {
            return window.event.keyCode;
        }
    }
    Autosugest.useSuggestion = function(word,id,id_elem){
    
        var id_opt = Autosugest._getOptionsReference(id);
        $(id_opt['id']).value = word;
        alert(id_elem);
    } 
    Autosugest.createDiv = function(id){
    
        var id_opt = Autosugest._getOptionsReference(id);
        var ul = document.createElement('ul');
        
        for (var i=0;i< id_opt['eligible'].length; ++i){
    
            var word = id_opt['eligible'][i].nome;
            var li = document.createElement('li');
            li.id = id_opt['eligible'][i].id;
            li.name = id_opt['eligible'][i].nome;
            var a = document.createElement('a');
            a.innerHTML = word;
            li.appendChild(a);
            li.style.cursor="pointer";
            li.onclick = function(event){
                var target = Autosugest.getEventTarget(event);
                Autosugest.useSuggestion(this.id,this.name,id);
                Autosugest.hideDiv(id);
                Autosugest.cancelEvent(event);
                return false;
            };
    
            ul.appendChild(li);
        }
        
        $(id_opt['div']).replaceChild(ul,$(id_opt['div']).childNodes[0]);
        
        //Element.addClassName(id_opt['div'], id_opt['div_class']);
    
        $(id_opt['div']).style.width = id_opt['size_div'];
        $(id_opt['div']).align = "left";
        
        //$(id_opt['div']).className="suggestion_list";
        //$(id_opt['div']).style.position = 'absolute';
    
    }
    Autosugest.cancelEvent = function(ev){
    
        if(ev)			//Moz
        {
            ev.preventDefault();
            ev.stopPropagation();
        }
        if(window.event)	//IE
        {
            window.event.returnValue = false;
        }
    }
    Autosugest.hideDiv = function(id){
    
        var id_opt = Autosugest._getOptionsReference(id);
        $(id_opt['div']).style.display = 'none';
        id_opt['highlighted'] = -1;
    }
    Autosugest.showDiv = function(id){
    
        var id_opt = Autosugest._getOptionsReference(id);
        $(id_opt['div']).style.display = 'block';
    }
    Autosugest.positionDiv = function(id){
    
    
        var id_opt = Autosugest._getOptionsReference(id);
        var el = id_opt['id'];
        var x = 0;
        var y = el.offsetHeight;
    
        while (el.offsetParent && el.tagName.toUpperCase() != 'BODY')
        {
            x += el.offsetLeft;
            y += el.offsetTop;
            el = el.offsetParent;
        }
    
        x += el.offsetLeft;
        y += el.offsetTop;
    
        $(id_opt['div']).style.left = x + 'px';
        $(id_opt['div']).style.top = y + 'px';
    }
    Autosugest.getEventTarget = function (e) {
        e = e || window.event;
        return e.target || e.srcElement; 
    }