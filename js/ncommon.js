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

function includeScript(scriptPath){
	var body = document.getElementsByTagName('body')[0];
	var script= document.createElement('script');
	script.type= 'text/javascript';
	script.src= scriptPath;
	body.appendChild(script);
}

includeScript("js/jquery.js");
includeScript("js/extra.js");
includeScript("js/wliglibs/nstorage.js");
includeScript("js/wliglibs/nconfig.js");
includeScript("js/wliglibs/nconector.js");
includeScript("js/wliglibs/nwidgets.js");
includeScript("js/wlig.js");

