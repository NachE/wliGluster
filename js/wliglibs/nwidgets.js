/*
 *   Copyright (C) 2013 J.A Nache
 *   This file is part of wliGluster.
 *
 *   wliGluster is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   wliGluster is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with wliGluster.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

//hey! here is back!
function guid(){
	return ((new Date()).getTime()).toString() + 
		( Math.round( (1 + Math.random()) * 0x10000 ) )
		.toString();
}

// NWidget Toolkit
// 
//

function Nwidget(nconfig_object, nconnector_object, preset_uid){
	var self = this;

	this.nconfig = typeof nconfig_object !== 'undefined' ? 
				nconfig_object : nconfig
	this.nconnector = typeof nconnector_object !== 'undefined' ? 
				nconnector_object : nconnector

	//always gen unique id
	this.uid = typeof preset_uid !== 'undefined' ? preset_uid : guid();

	//this.uid = guid(); //always gen unique id	
	this.type='nwidget';
	this.content = new Object;

	this.loadContent = function(file){
		this.content = $(this.nconnector.get_widget_file(file));
		this.setWidgetUID();
		return this.content
	}

	this.changeWidgetUID = function(uid){
		this.uid = uid;
		return this;
	}

	this.setWidgetUID = function(){
		this.content.attr("id", this.uid);
		return this;
	}

	this.getContentHTML = function(){
		return String($('<div>').append( this.content.clone() ).remove().html());
	}
	
	this.getContentObject = function(){
		return this.content;
	}
	
	this.append = function(elm_toappend){
		elm_toappend = typeof elm_toappend !== 'undefined' ?
			elm_toappend : String();
		var toappend = typeof elm_toappend.type !== 'undefined' ? 
			elm_toappend.getContentObject() : elm_toappend;
		this.content.find('.'+this.type+'_body').append(toappend);
		return this;
	}

	this.appendm = function(elements_toappend){
		for(var key in elements_toappend) {
			this.append( elements_toappend[key] );
		}
	}

	this.onClick = function(function_to_exec){
		$(document).on('click', '#'+this.uid,function(){
			function_to_exec();
		});
		return this;
	}

	this.showed = function(){
		if( $('#'+this.uid).length > 0 ){
			return true;
		}else{
			return false;
		}
	}

	this.show = function(){
		if ($('#'+this.uid).length > 0){
			//exist, so just show
			$('#'+this.uid).show();
		}else{
			//not exist, put on body
			$('body').append(this.content);
		}
		return this;
	}

	this.hide = function(){
		this.content.hide();
	}

	this.clear = function(){
		$('#'+this.uid).find('.'+this.type+'_body').html("");
		$('#'+this.uid).find('.'+this.type+'_body').text("");
		this.content = $('#'+this.uid);
		return this;
	}

	this.destroy = function(){
		this.content.remove();
	}
}

function Nviewtab(nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='nviewtab';
	this.list_tab = {};
	this.list_tabcontent = {};
	this.loadContent("nviewtab.html");
	
	this.newTab = function(tabname){
		var newguid = guid();		
		this.list_tab[newguid] = 
			( 
				new Ntabbutton(
					nconfig_object, 
					nconnector_object, 
					newguid
				) 
			).append(tabname);

		this.list_tabcontent[newguid+'_content'] = 
			new Ntabcontent(nconfig_object, 
					nconnector_object, 
					newguid+'_content');

		//Put content directly using the tab object
		this.list_tab[newguid].tabcontent = this.list_tabcontent[newguid+'_content'];

		this.content.find('.ntabbuttons').append( 
				this.list_tab[newguid].getContentObject()  );
		this.content.find('.ntabcontents').append( 
				this.list_tabcontent[newguid+'_content']
				.getContentObject()  );

		//TODO: the tabbutton need to have var with content object
		return this.list_tab[newguid];
	}
	
	this.append = function(elm_toappend, thetab){
		var toappend = typeof elm_toappend.type !== 'undefined' ? 
			elm_toappend.getContentObject() : elm_toappend;

		var tabid = typeof thetab !== 'object' ?
			thetab : thetab.uid;
			this.content.find('#'+tabid+'_content '+
					'.ntabcontent_body').append(toappend);
		return this;
	}
	
	this.showTab = function(thetab){
		var tabid = typeof thetab !== 'object' ?
			thetab : thetab.uid;
		$('.ntabcontent').hide();
		//ALERT, prevent # at start
		$('#'+tabid+'_content').show();
		$('.ntabbutton').removeClass('ntabbutton_selected');
		$('#'+tabid).addClass('ntabbutton_selected');
	}



	this.clear = function(thetab){
		var tabid = typeof thetab !== 'object' ?
			thetab : thetab.uid;
		if (typeof this.list_tabcontent[tabid+"_content"] !== 'undefined'){
			this.list_tabcontent[tabid+"_content"].clear();
		}
	}

	var parent = this;
	//specific events
	$(document).on('click', '#'+this.uid+' .ntabbutton',function(){
		parent.showTab( $(this).attr('id') );
	});
}

function Ntabcontent(nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object,nconnector_object,preset_uid);
	this.type='ntabcontent';
	this.loadContent("ntabcontent.html");
	this.tabcontent = {};	
}

function Ntabbutton(nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='ntabbutton';
	this.loadContent("ntabbutton.html");
	this.tabcontent = {}

	this.appendcontent = function(element){
		return this.tabcontent.append(element);
	}
}

function Nwindow(nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='nwindow';
	this.loadContent("nwindow.html");

	this.hideOnClose = function(){
		$(document).on('click', '#'+this.uid+' .nwindow_control_close', function(){
			self.hide();
		});
	}
}

function Nbutton(button_text, nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='nbutton';
	this.loadContent("nbutton.html");
		this.append(button_text);
}

function Nlabel(label_text, nconfig_object, nconnector_object, preset_uid){
        Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
        this.type='nlabel';
        this.content = $('<div/>').html(label_text).contents();
}

function Nlink(link_href, nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='nlink';
	this.loadContent("nlink.html");
	this.content.attr("href",link_href);

	this.append = function(elm_toappend){
		var toappend = typeof elm_toappend.type !== 'undefined' ?
				elm_toappend.getContentHTML() : elm_toappend;
		this.content.text(toappend);
		return this;
	}
}

function Nmenu(parent_text,nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='nmenu';
	this.loadContent("nmenu.html");
	this.elements = {};
	this.content.find('.nmenuparentelement').append(parent_text);

	this.addElement = function(element_text){
		var newuid = guid();
		this.elements[newuid] =
                        new NmenuElement(element_text,nconfig_object, nconnector_object, newuid);
		if(this.showed()){
			$('#'+this.uid).append(
                                this.elements[newuid].getContentObject() );
		}else{
			this.append(this.elements[newuid].getContentObject());
		}
		return this.elements[newuid];
	}
}

function NmenuElement(element_text, nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='nmenuelement';
	this.loadContent("nmenuelement.html");
	this.append(element_text);
}

function Nbox(nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='nbox';
	this.loadContent("nbox.html");
}

function Nboxbuttons(nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='nboxbuttons';
	this.loadContent("nboxbuttons.html");
}

function Nform(nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='nform';
	this.loadContent("nform.html");
}

function Ninput(label_text, input_value, nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='ninput';
	this.loadContent("ninput.html");
	this.content.prepend(label_text);
	this.content.find('.ninput_body').attr("name", this.uid);
	
	this.append = function(){ return false; }
	this.value = function(args){
		return typeof args !== 'undefined' ? 
			this.content.find('.ninput_body').val(args) : 
			this.content.find('.ninput_body').val()
	}
	this.value(input_value);
}

function Nradio(label_text, radio_value, nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='nradio';
	this.loadContent("nradio.html");
	this.content.find('.nradio_body').parent().append(label_text);
	this.content.find('.nradio_body').val(radio_value);
	
	this.group = function(group_name){
		this.content.find('.nradio_body').attr("name",group_name);
		return this;
	}

	this.value = function(args){
		return typeof args !== 'undefined' ?
			this.content.find('.nradio_body').val(args) :
			this.content.find('.nradio_body').val()
	}

}

/***** generic events *****/
$(document).on('click','.nwindow_control .nwindow_control_close', function(){
	$(this).parents('.nwindow').remove();
});

//Draggable windows
$(document).on('mousedown', '.nwindow_control', function(e){
	var thewindow = this;
	var Xdiff = e.pageX - $(thewindow).offset().left;
	var Ydiff = e.pageY - $(thewindow).offset().top;
	e.preventDefault();
	$(document).unbind('mousemove');
	$(document).bind('mousemove', function(e){
		var newleft = (e.pageX - Xdiff) >= 0 ? parseInt(e.pageX - Xdiff) : 0;
		var newtop = (e.pageY - Ydiff) >= 0 ? parseInt(e.pageY - Ydiff) : 0;
		$(thewindow).parents('.nwindow').offset({ top: newtop, left: newleft });
		//$(thewindow).parents('.nwindow').css("left",newleft+"px");
		//$(thewindow).parents('.nwindow').css("top",newtop+"px");
		return false;
	});
	$(document).bind('mouseup',function(){
		$(document).attr('unselectable','off');
		$(document).unbind('mousemove');
		return false;
	});
	return false;
});

//Emergent menu
$(document).on('click', '.nmenu',function(){
	$(this).find('.nmenu_body').toggle();
});
