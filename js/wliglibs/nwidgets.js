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

function Nwidget(nconfig_object, nconnector_object){
	this.nconfig = typeof nconfig_object !== 'undefined' ? nconfig_object : nconfig
	this.nconnector = typeof nconnector_object !== 'undefined' ? nconnecotr_object : nconnector
	
	this.type='nwidget';
	this.uid = guid(); //always gen unique id
	this.content = new Object;

	this.loadContent = function(file){
		this.content = $(this.nconnector.get_widget_file(file));
		this.setWidgetUID();
		return this.content
	}

	this.setWidgetUID = function(){
		this.content.attr("id", this.uid);
	}

	this.getContentHTML = function(){
		return String($('<div>').append( this.content.clone() ).remove().html());
	}
	
	this.getContentObject = function(){
		return this.content;
	}
	
	this.append = function(elm_toappend){
		toappend = typeof elm_toappend.type !== 'undefined' ? elm_toappend.getContentObject() : elm_toappend
		this.content.find('.'+this.type+'_body').append(toappend);
	}

}

function Nwindow(nconfig_object, nconnector_object){
	Nwidget.call(this);
	this.type='nwindow';
	this.loadContent("nwindow.html");
}

function Nbutton(button_text, nconfig_object, nconnector_object){
	Nwidget.call(this);
	this.type='nbutton';
	this.loadContent("nbutton.html");
}

function Nlabel(label_text, nconfig_object, nconnector_object){
        Nwidget.call(this);
        this.type='nlabel';
        this.loadContent("nlabelhtml");
}
