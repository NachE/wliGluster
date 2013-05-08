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


function Nconnector(){
	this.get_widget_file = function(filename){
		var htmltoret = nstorage.getvar("widgetfile_" + filename);
		if(htmltoret === null){
			$.ajax({
				url: 'themes/'+nconfig.get("config_theme")+'/nwidgets/'+filename,
				beforeSend: function ( xhr ) {
                                //prevent browser engine to parse content
                                	xhr.overrideMimeType("text/plain; charset=x-user-defined");
				},
				async: false
			}).done(function ( themehtml ) {
				htmltoret=themehtml;
			});

			nstorage.setvar("widgetfile_" + filename, htmltoret);
        	}
        	return htmltoret;
	}
}
