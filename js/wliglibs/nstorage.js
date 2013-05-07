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

function Nstorage () {

	this.storagesupport = false; //To not call supports_html5_storage every time
	this.badstorage = {} //Obj. JavaScript just have int on array index

	// Check if browser support html5 storage
	// We keep the function
	this.supports_html5_storage = function() {
		if(typeof(Storage)!=="undefined"){
			return true;
		}else{
			return false;
		}
	};
	this.storagesupport = this.supports_html5_storage();
	if(!this.storagesupport){alert("Your Web Browser does not support web storage.\nMaybe you get some troubles.\nIt's recomended to use the latest version of modern web browser.");}

	this.setvar = function(varname,value){
		if(this.storagesupport){
			return sessionStorage.setItem(varname, value);
		}else{
			return this.badstorage[varname] = value;
		}
	};


	this.getvar = function(varname){
		if(this.storagesupport){
			return sessionStorage.getItem(varname);
		}else{
			if(typeof( this.badstorage[varname]  )!=="undefined"){
				return this.badstorage[varname];
			}else{
				return null; //undefined var with getItem return null. So we need to return null.
			}
		}
	};

	this.getall = function(filter){
		filter = typeof filter !== 'undefined' ? filter : String("");
		if(this.storagesupport){
			var toret = {};
			if (filter.length > 0) {
				for (i=0;i < sessionStorage.length;i++) {
					var key = sessionStorage.key(i);
					if (key.indexOf(filter) >= 0){
						toret[key] = sessionStorage.getItem(key);
					}
				}
			}else{
				for (i=0;i < sessionStorage.length;i++) {
					var key = sessionStorage.key(i);
					toret[key] = sessionStorage.getItem(key);
				}
			}
			return toret;
		}else{
			return this.badstorage;
		}
	};

}
