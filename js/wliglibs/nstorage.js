function ntorage () {

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

}
