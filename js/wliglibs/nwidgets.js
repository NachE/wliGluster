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
		var toappend = typeof elm_toappend.type !== 'undefined' ? 
			elm_toappend.getContentObject() : elm_toappend;
		this.content.find('.'+this.type+'_body').append(toappend);
		return this;
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

	this.clear = function(){
		$('#'+this.uid).html("");
		$('#'+this.uid).text("");
		this.loadContent();
		return this;
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
			new Ntabbutton(nconfig_object, nconnector_object, newguid);
		this.list_tab[newguid].append(tabname);
		this.list_tabcontent[newguid+'_content'] = 
			new Ntabcontent(nconfig_object, 
					nconnector_object, 
					newguid+'_content');

		if(this.showed()){
			$('#'+this.uid+' .ntabbuttons').append( 
				this.list_tab[newguid].getContentObject() );
			$('#'+this.uid+' .ntabcontents').append( 
				this.list_tabcontent[newguid].getContentObject() );
		}else{
			this.content.find('.ntabbuttons').append( 
				this.list_tab[newguid].getContentObject()  );
			this.content.find('.ntabcontents').append( 
				this.list_tabcontent[newguid+'_content'].getContentObject()  );
		}

		return newguid;
	}
	
	this.append = function(elm_toappend, tabid){
		var toappend = typeof elm_toappend.type !== 'undefined' ? 
			elm_toappend.getContentObject() : elm_toappend;
		if(this.showed()){
			$('#'+this.uid+' #'+tabid+'_content .ntabcontent_body').append(toappend);
		}else{
			this.content.find('#'+tabid+'_content .ntabcontent_body').append(toappend);
		}
		return this;
	}
	
	this.showTab = function(tabid){
		$('.ntabcontent').hide();
		//ALERT, prevent # at start
		$('#'+tabid+'_content').show();
		$('.ntabbutton').removeClass('ntabbutton_selected');
		$('#'+tabid).addClass('ntabbutton_selected');
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
}

function Ntabbutton(nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='ntabbutton';
	this.loadContent("ntabbutton.html");
}

function Nwindow(nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='nwindow';
	this.loadContent("nwindow.html");
}

function Nbutton(button_text, nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='nbutton';
	this.loadContent("nbutton.html");
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

function Nform(nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='nform';
	this.loadContent("nform.html");
}

function Ninput(label_text, nconfig_object, nconnector_object, preset_uid){
	Nwidget.call(this,nconfig_object, nconnector_object, preset_uid);
	this.type='ninput';
	this.loadContent("ninput.html");
	this.content.prepend(label_text);
	this.content.find('.ninput_body').attr("name", this.uid);
	
	this.append = function(){ return false; }
	this.value = function(args){
		return this.content.find('.ninput_body').val();
	}
}



/***** generic events *****/
$(document).on('click','.nwindow_control .nwindow_control_close', function(){
	$(this).parents('.nwindow').hide();
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