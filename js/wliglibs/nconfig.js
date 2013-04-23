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


//uses ntorage lib

function nconfig () {

	this.Nstorage = new ntorage();

	this.set = function (param, value){
		return this.Nstorage.setvar("_nconfig_"+param, value);
	};

	this.get = function (param){
		return this.Nstorage.getvar("_nconfig_"+param);
	};

	this.export = function(){
		location.href="data:application/octet-stream;base64,"+base64_encode(JSON.stringify(this.Nstorage.getall("_nconfig_")));
		return false;
	};

	this.import = function(data){
		//not implemented
		//JSON.parse( serialized object );
		return false;
	};
}
