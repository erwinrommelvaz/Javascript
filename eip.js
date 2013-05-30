	/*
	 * Edit In Place
	 * http://josephscott.org/code/js/eip/
	 * Version 0.3.3
	 * License http://josephscott.org/code/js/eip/license.txt
	 * Adaptado por Erwin Rommel O Vaz
	 * Site:  http://www.sismobile.com.br
	 */
 
	// Fake a EditInPlace.* name space.
	var EditInPlace = function() { };
 
	// Default settings for editable ids.
	EditInPlace.defaults = {
		// Default options that you can over write.
		id:				false,
		save_url:			'edit.php',
		load_url:                       'load_option.php',
		type:				'text',
		select_text:			false,	// doesn't work in Safari
		size:				false,  // will be calculated at run time
		max_size:			100,
		rows:				false,  // will be calculated at run time
		cols:				50,
		options:			false,
		escape_function:		encodeURIComponent,	// or escape
		on_blur:			'',
		mascara:                        '',
		validacao:                      '',
		button_type:                    'buttons',
		mouseover_class:		'eip_mouseover',
		editfield_class:		'eip_editfield',
		savebutton_text:		'Salvar',
		savebutton_class:		'eip_savebutton',
		cancelbutton_text:		'Cancelar',
		cancelbutton_class:		'eip_cancelbutton',
		saving_text:			'Salvando...',
		saving_class:			'eip_saving',
		empty_text:			'Click para Editar',
		empty_class:			'eip_empty',
		full_class:			'eip_full',
		edit_title:			'Clique para Editar',
		click:				'click',  // or dblclick 
		savefailed_text:		'Ocorreu um erro ao tentar savar alterações.',
		ajax_data:			 false,
 
		// Private options that are managed for you.
		// PLEASE DO NOT TOUCH THESE.
		is_empty:			false,
		orig_text:			'',
		mouseover_observer:		false,
		mouseout_observer:		false,
		mouseclick_observer:		false
	};
 
	// Place to keep individual option sets.
	EditInPlace.options = { };
 
	// Make an id editable.
	EditInPlace.makeEditable = function(args) {
 
		var id = args['id'];
		//alert($(id).innerHTML);
		var id_opt = EditInPlace._getOptionsReference(id);
 
		// Start the option set with the defaults.
		for(var i in EditInPlace.defaults) {
			id_opt[i] = EditInPlace.defaults[i];
		}
 
		// Over write defaults with provided arguments.
		for(var i in args) {
			id_opt[i] = args[i];
		}
 
		// Store the current (original) value of the editable id.
		id_opt['orig_text'] = $(id).innerHTML;
 
		// Check for empty values.
		if($(id).innerHTML == '') {
			id_opt['is_empty'] = true;
			$(id).innerHTML = id_opt['empty_text'];
			Element.addClassName(id, id_opt['empty_class']);
		}
 
		// Build event observers.
		id_opt['mouseover_observer'] = EditInPlace._mouseOver.bindAsEventListener();
		id_opt['mouseout_observer'] = EditInPlace._mouseOut.bindAsEventListener();
		id_opt['mouseclick_observer'] = EditInPlace._mouseClick.bindAsEventListener();
 
		// Watch for events.
		Event.observe(id, 'mouseover', id_opt['mouseover_observer']);
		Event.observe(id, 'mouseout', id_opt['mouseout_observer']);
		Event.observe(id, id_opt['click'], id_opt['mouseclick_observer']);
 
		$(id).title = id_opt['edit_title'];
 
		// Return a reference the option set
		// just in case someone is interested.
		return(id_opt);
	};
 
	// **************  Private Functions ***************** 
 
	// Get a reference to the option set for a specific editable id.
	EditInPlace._getOptionsReference = function(id) {
		// If an option set doesn't exist for the id
		// then create an empty one.
		if(!EditInPlace.options[id]) {
			EditInPlace.options[id] = { };
		}
 
		return(EditInPlace.options[id]);
	};
 
	// Process mouseover events.
	EditInPlace._mouseOver = function(event) {
		var id = Event.element(event).id;
		var id_opt = EditInPlace._getOptionsReference(id);
 
		Element.addClassName(id, id_opt['mouseover_class']);
	};
 
	// Process mouseout events.
	EditInPlace._mouseOut = function(event) {
		var id = Event.element(event).id;
		var id_opt = EditInPlace._getOptionsReference(id);
 
		Element.removeClassName(id, id_opt['mouseover_class']);
	};
 
	// Process mouseclick events.
	EditInPlace._mouseClick = function(event) {
		var id = Event.element(event).id;
		var id_opt = EditInPlace._getOptionsReference(id);
		var form = EditInPlace._formField(id) + EditInPlace._formButtons(id,id_opt['button_type']);
 
		// Hide the original id and show the edit form and set the focus.
		Element.hide(id);
		new Insertion.After(id, form);
		Field.focus(id + '_edit');
 
		// Watch for button clicks.
		Event.observe(id + '_save', 'click', EditInPlace._saveClick);
		Event.observe(id + '_cancel', 'click', EditInPlace._cancelClick);
		Event.observe(id + '_edit', 'blur', function(event) {
			switch(id_opt['on_blur']) {
				case 'cancel':
					EditInPlace._cancelClick(false, id);
					break;
				case 'save':
					EditInPlace._saveClick(false, id);
					break;
				default:
					break;
			}
		});
	};
 
	// Process save button clicks.
	EditInPlace._saveClick = function(event, id) {
		if(!id) {
			id = Event.element(event).id.replace(/_save$/, '');
		}
		var id_opt = EditInPlace._getOptionsReference(id);
 
		// Package data for the AJAX request.
		var new_text = id_opt['escape_function']($F(id + '_edit'));
		if(id_opt['type'] != 'checkbox' && id_opt['type'] != 'radio'){
			var params = 'id=' + id + '&content=' + new_text + '&' + Chaveiro.empacotaChave(id);
		}else{
			var params = 'id=' + id + '&' + Chaveiro.empacotaChave(id);
		}
		if(id_opt['type'] == 'select') {
			params += '&option_name=' + $(id + '_option_' + new_text).innerHTML;
		}
		if(id_opt['type'] == 'checkbox') {
 
			var aChk = document.getElementsByName("item_checkbox");
			for (var i=0;i< aChk.length;i++){  
				if (aChk[i].checked == true){  
					// CheckBox Marcado... Faça alguma coisa... Ex:
					params += '&content'+i+'='+aChk[i].value;
				}  else {
					// CheckBox Não Marcado... Faça alguma outra coisa...
				}
			}
			if(id_opt['valida_checkBox']){
				if(params.toLowerCase().indexOf("content") == "-1"){alert("Escolha um item!");return false;}
			}
		}
 
		if(id_opt['type'] == 'radio') {
 
			var aRdi = document.getElementsByName("item_radio");
			for (var j=0;j< aRdi.length;j++){  
				if (aRdi[j].checked == true){  
					// Radio Marcado... Faça alguma coisa... Ex:
					params += '&content'+j+'='+aRdi[j].value;
				}  else {
					// Radio Não Marcado... Faça alguma outra coisa...
				}
			}
			if(id_opt['valida_radio']){
				if(params.toLowerCase().indexOf("content") == "-1"){alert("Escolha um item!");return false;}
			}
		}
 
		// If additional data was provided to be sent, add it on.
		if(id_opt['ajax_data']) {
			for(var i in id_opt['ajax_data']) {
				var url_data = id_opt['escape_function'](id_opt['ajax_data'][i]);
				params += '&' + i + '=' + url_data;
			}
		}
 
		// Build saving message.
		var saving = '' + id_opt['saving_text'] + '\n';
 
		// Turn off event watching while saving changes.
		Event.stopObserving(id, 'mouseover', id_opt['mouseover_observer']);
		Event.stopObserving(id, 'mouseout', id_opt['mouseout_observer']);
		Event.stopObserving(id, id_opt['click'], id_opt['mouseclick_observer']);
 
		// Remove the form editor and display the saving message.
		Element.remove(id + '_editor');
		$(id).innerHTML = saving;
		Element.show(id);
 
		// Send the changes via AJAX.
		var ajax_req = new Ajax.Request(
			id_opt['save_url'],
			{
				method: 'post',
				postBody: params,
				onSuccess: function(t) { EditInPlace._saveComplete(id, t); },
				onFailure: function(t) { EditInPlace._saveFailed(id, t); }
			}
		);
	};
 
	// Proces cancel button clicks.
	EditInPlace._cancelClick = function(event, id) {
		if(!id) {
			id = Event.element(event).id.replace(/_cancel$/, '');
		}
		var id_opt = EditInPlace._getOptionsReference(id);
 
		// Remove the edit form and mouseover class.
		Element.remove(id + '_editor');
		Element.removeClassName(id, id_opt['editfield_class']);
 
		// Display empty edit text if the id was empty.
		if($(id).innerHTML == '') {
			id_opt['id_empty'] = true;
			$(id).innerHTML = id_opt['empty_text'];
			Element.addClassName(id, id_opt['empty_class']);
		}
		Element.addClassName(id, id_opt['full_class']);
		// Show the original id again.
		Element.show(id);
	};
 
	// Complete the successful AJAX request.
	EditInPlace._saveComplete = function(id, t) {
		var id_opt = EditInPlace._getOptionsReference(id);
 
		// Check to see if the user deleted all of the text.
		if(t.responseText == '') {
			id_opt['is_empty'] = true;
			$(id).innerHTML = id_opt['empty_text'];
			Element.addClassName(id, id_opt['empty_class']);
		} else {
			id_opt['is_empty'] = false;
			Element.removeClassName(id, id_opt['empty_class']);
			$(id).innerHTML = t.responseText;
			Element.addClassName(id, id_opt['full_class']);
		}
 
		// Save the new text as the original text.
		id_opt['orig_text'] = t.responseText;
 
		// Turn on event watching again.
		Event.observe(id, 'mouseover', id_opt['mouseover_observer']);
		Event.observe(id, 'mouseout', id_opt['mouseout_observer']);
		Event.observe(id, id_opt['click'], id_opt['mouseclick_observer']);
	};
 
	// Complete the failed AJAX request.
	EditInPlace._saveFailed = function(id, t) {
		var id_opt = EditInPlace.getOptionsReference(id);
 
		// Restore the original text, remove the editfield class
		// and alert the user that the save failed.
		$(id).innerHTML = id_opt['orig_text'];
		Element.removeClassName(id, id_opt['editfield_class']);
		Element.addClassName(id, id_opt['full_class']);
		alert(id_opt['savefailed_text']);
 
		// Turn on event watching again.
		Event.observe(id, 'mouseover', id_opt['mouseover_observer']);
		Event.observe(id, 'mouseout', id_opt['mouseout_observer']);
		Event.observe(id, id_opt['click'], id_opt['mouseclick_observer']);
	};
 
	// Build the form field to edit.
	EditInPlace._formField = function(id) {
		var id_opt = EditInPlace._getOptionsReference(id);
 
		// If the original text value was empty then
		// make it empty again before we allow editing.
		if(id_opt['is_empty'] == true) {
			Element.removeClassName(id, id_opt['empty_class']);
			$(id).innerHTML = '';
		}
 
		// Every form is wrapped in a span.
		var field = "< span id="' + id + '_editor">\n';
 
		// Text input edit.
		if(id_opt['type'] == 'text') {
 
			var size = id_opt['orig_text'].length + 15;
			// Don't let the size get bigger than the maximum.
			if(size > id_opt['max_size']) {
				size = id_opt['max_size'];
			}
 
			// Use a specific size if one was provided.
			size = (id_opt['size'] ? id_opt['size'] : size);
 
			field += '< input id="' + id + '_edit" class="'
				+ id_opt['editfield_class'] + '" name="' + id
				+ '_edit" type="text" size="' + size + '" value="'
				+ id_opt['orig_text'] + '" '+ id_opt['mascara'] +' '+ 
				id_opt['validacao'] +'';
 
			if(id_opt['select_text']) {
				field += 'onfocus="this.select();"';
			}
 
			field += ' />< br/>\n';
 
		}else if(id_opt['type'] == 'textarea') {
 
			// Calculate the number of rows to use.
			var rows = (id_opt['orig_text'].length / id_opt['cols']) + 4;
 
			// Use a specific rows is fone was provided.
			rows = (id_opt['rows'] ? id_opt['rows'] : rows);
 
			field += '< textarea id="' + id + '_edit" '+ id_opt['mascara'] +' class="'
				+ id_opt['editfield_class'] + '" name="' + id + '_edit" rows="'
				+ rows + '"cols="' + id_opt['cols'] + '"'
 
			if(id_opt['select_text']) {
				field += 'onfocus="this.select();"';
			}
 
			field += '>' + id_opt['orig_text'] + '< /textarea>
			< div id="caracteresrestantes">< /div>
			< br/>\n';
 
		}else if(id_opt['type'] == 'select') {
 
			field += '< select id="' + id + '_edit" class="'
				+ id_opt['editfield_class'] + '" name="' + id + '_edit">\n';
 
			for(var i in id_opt['options']) {
				field += '< option id="' + id + '_option_' + i + '" name="' + id
					+ '_option_' + i + '" value="' + i + '"';
 
				if(id_opt['options'][i] == $(id).innerHTML) {
					field += ' selected="selected"';
				}
 
				field += '>' + id_opt['options'][i] + '< /option>\n';
			}
 
			field += '< /select>\n';
 
		}else if(id_opt['type'] == 'select_bd'){
 
		/*********
	
		By default, all requests initiated using Ajax.
		Request are sent asynchronously, meaning that the 
		JavaScript doesn't wait for a response. If, for some 
		reason, you need to send a request synchronously, which 
		locks the JavaScript code execution and the user interface, 
		it can be accomplished by setting the asynchronous property 
		to false:
 
		var oOptions = {
		    asynchronous: false
		};
 
		In this case, there is no need for onSuccess() or onFailure(), 
		because the next line of code after the request is sent can 
		handle all conditions. After the call has been completed, the 
		XHR object can be accessed directly via Ajax.Request.transport.
 
		Remember, synchronous requests should be used sparingly and only 
		for small amounts of data, since they lock the user interface while 
		the request is being processed.
		http://www.wrox.com/WileyCDA/Section/Ajax-in-Prototype.id-306214.html
 
		**********/
 
			var result_combo;
 
			var ajax_req = new Ajax.Request(
				id_opt['load_url'],
				{
					method: 'post',
					asynchronous:  false, 
					postBody: '',
					onSuccess: function(t) { 
					
						var myObj = t.responseText.evalJSON(true);
						field += '< select id="' + id + '_edit" class="'
						+ id_opt['editfield_class'] + '" name="' + id + '_edit">\n';
 
						for(var i=0;i\n';
						}
	
						field += '< /select>\n';	
						result_combo = field;
				
					},
					onFailure: function(t) { EditInPlace._saveFailed(id, t); }
				}
			);
	
			return(result_combo);
		}else if(id_opt['type'] == 'checkbox') {
			field += '< fieldset align=left>';
    			field += '< legend>Escolha:< /legend>';
			for(var i in id_opt['checkboxs']) {
				field += '< input id="' + id + '_edit" class="'
					+ id_opt['editfield_class'] + '" name="item_checkbox" '
					+ ' type="checkbox" value="' + i + '" ';
				if(id_opt['checkboxs'][i] == $(id).innerHTML) {
					field += ' checked="true"';
				}
				field += ' />' + id_opt['checkboxs'][i] + '\n';
			}
			field += '< /fieldset>';
		}else if(id_opt['type'] == 'radio') {
			field += '< fieldset align=left>';
    			field += '< legend>Escolha:< /legend>';
			for(var i in id_opt['radios']) {
				field += '< input id="' + id + '_edit" class="'
					+ id_opt['editfield_class'] + '" name="item_radio" '
					+ ' type="radio" value="' + i + '" ';
				if(id_opt['radios'][i] == $(id).innerHTML) {
					field += ' checked="true"';
				}
				field += ' />' + id_opt['radios'][i] + '\n';
			}
			field += '< /fieldset>';
		}
		return(field);
	};
	// Build form buttons.
	EditInPlace._formButtons = function(id,type) {
		var id_opt = EditInPlace._getOptionsReference(id);
	
		if(type=="buttons"){
			return(
				'< span>< input id="' + id + '_save" class="' + id_opt['savebutton_class']
				+ '" type="button" value="' + id_opt['savebutton_text']
				+ '" /> OR < input id="' + id + '_cancel" class="'
				+ id_opt['cancelbutton_class'] + '" type="button" value="'
				+ id_opt['cancelbutton_text'] + '" />< /span>< /span>'
			);
		}else{
			return(
				'< span>< img src="./images/salvar.jpg" id="' + id + '_save" />
				   ou   
				< img src="./images/deletar.jpg" id="' + id + '_cancel" />< /span>< /span>'
			);
		}
	
	};
	
	//Os métodos abaixo podem ser usados caso o parâmetro 
	//asynchronous:false do id_opt[type] == select_bd
	//esteja causando travamentos do navegador, ou outros 
	//erros desconhecidos!!! 
	
	EditInPlace._busca_dados_no_bd = function(id) {
	
			var parametros = '';
			var myAjax = new Ajax.Request( 
				id_opt['load_url'], { 
					method: 'post', 
					parameters: parametros, 
					onLoading: carregando, 
					onComplete: function(t) { 
						EditInPlace._preenchecombo(id, t);
					}
				}
			);
	}
	EditInPlace._preenchecombo = function(id, t) {
	
		if (200 == t.status){
			var id_opt = EditInPlace._getOptionsReference(id);
			// If the original text value was empty then
			// make it empty again before we allow editing.
			if(id_opt['is_empty'] == true) {
				Element.removeClassName(id, id_opt['empty_class']);
				$(id).innerHTML = '';
			}
			var myObj = t.responseText.evalJSON(true);
			var field = '< span id="' + id + '_editor">\n';
			field += '< select id="' + id + '_edit" class="'
			+ id_opt['editfield_class'] + '" name="' + id + '_edit">\n';
			for(var i=0;i\n';
			}
			field += '< /select>\n';
			    
			var form =  field + EditInPlace._formButtons(id,id_opt['button_type']);
			Element.hide(id);
			new Insertion.After(id, form);
			Field.focus(id + '_edit');
			//Watch for button clicks.
			Event.observe(id + '_save', 'click', EditInPlace._saveClick);
			Event.observe(id + '_cancel', 'click', EditInPlace._cancelClick);
			Event.observe(id + '_edit', 'blur', function(event) {
			    switch(id_opt['on_blur']) {
				    case 'cancel':
					    EditInPlace._cancelClick(false, id);
					    break;
				    case 'save':
					    EditInPlace._saveClick(false, id);
					    break;
				    default:
					    break;
			    }
			});
		}else{
			EditInPlace._saveFailed(id, t);
		}
	
	};
	