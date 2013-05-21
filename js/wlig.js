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

$(document).ready(function() {

	nstorage = new Nstorage();
	nconfig = new Nconfig();

	nconnector = new Nconnector();

	nconfig.set("config_theme", "default");
	nconfig.set("config_autoinit", true);
	nconfig.set("config_server", "");
	//configure the server side interface
	nconfig.set("config_server_script", "glusterxml.php"); 
	printC("Web Line Interface for Gluster");


	/******* Testing the new libs **********/
	nwindow = new Nwindow();
	nbutton = new Nbutton();
	nbutton.append("This is a button");
	nwindow.append( nbutton );
	nbutton.onClick(function(){alert("asdfasdfasdfasdf");});
	nwindow.show();


	viewtab = new Nviewtab();
	idtab = viewtab.newTab("testing");
	idtab2 = viewtab.newTab("testing2");
	viewtab.append( "fuckoff" , idtab2);
	viewtab.append( nwindow, idtab);
	viewtab.show();

	menu1 = new Nmenu('MENU1');
	menu1.addElement("Elemento 1").onClick(function(){alert("i am a menu")});
	menu1.addElement("Elemento 2");	
	//menu1.show();
	nwindow.append(menu1);

	box1 = new Nbox();

	link1 = new Nlink("#asdf").append(  new Nlabel("Holaaa") ).onClick(function(){ nwindow.show();  });

	box1.append(link1);

	box1.append(new Nlabel("<h1>TExt</h1>"));
	//box1.show();
	viewtab.append( box1, idtab );

	form1 = new Nform();
	cosa1 = new Ninput("cosa");
	cosa2 = new Ninput("csoa2");
	form1.append(cosa1);
	form1.append(cosa2);
	form1.append("asdfff");
	nwindow.append(form1);
	/**** End of testing the new libs ****/


	/***** The new libs to production ****/
	function WliMainGui(){
		this.nconfig = new Nconfig();
		this.viewtab =  new Nviewtab();
		//control common widgets like tabs and windows
		this.nw = {};
		var self = this;
		
		//render the initial interface
		this.renderBasic = function(){
			var configMenu = new Nmenu('Configuration');
			configMenu.addElement("General Config")
				.onClick(function(){self.windowConfig()});
			configMenu.addElement("Export Config");
			configMenu.addElement("Import Config");
			configMenu.content.css("float", "right");
			configMenu.show();
			this.viewtab.show();
		}

		//the common menu used for each volume
		this.menuVolume = function(volumename){
			var volumeMenu = new Nmenu("Actions");
			volumeMenu.addElement("Volume Start")
				.onClick(function(){send_command("volume start "+volumename)});
			volumeMenu.addElement("Volume Stop")
				.onClick(function(){self.volumeStop(volumename)});
			volumeMenu.addElement("Volume Info")
				.onClick(function(){send_command("volume info "+volumename)});
			volumeMenu.addElement("Volume Status")
				.onClick(function(){send_command("volume status "+volumename)});
			volumeMenu.addElement("Volume Status Detail");
			volumeMenu.addElement("-");
			volumeMenu.addElement("Volume Add Brick")
				.onClick(function(){ self.windowAddbrick(volumename) });
			return volumeMenu;
		}

		this.tabVolumeinfo = function(gxml){
			return false;
		}

		//I dont like this way to manage tab widget, see later
		//this func show the "volume list" command in a graphical way
		this.tabVolumelist = function(gxml){
			//create the tab if not exist
			if(typeof this.nw['tabVolumelist'] == 'undefined' ){
				this.nw['tabVolumelist'] = this.viewtab.newTab("Volume list");
			}
			
			//clear the tab content
			this.viewtab.clear(this.nw['tabVolumelist']);

			//foreach the xml returned from gluster command on server
		        $(gxml).find('cliOutput > volList > volume').each(function(){
				//the follow is for each volume name
				var volumename = $(this).text();

				var box = new Nbox();
				box.content.addClass("volumelistbox");
				box.append(
					(new Nlink("#")).append(
						new Nlabel( volumename )
					).onClick(function(){
						send_command("volume info "+volumename)
					}) 
				);
				box.append(self.menuVolume(volumename));
				self.viewtab.append(box, self.nw['tabVolumelist']);
			});
			this.viewtab.showTab(this.nw['tabVolumelist']);
		}

		//the window to add new brick to volume
		this.windowAddbrick = function(volumename){
			//Type: Stripe, replica
			//Count:
			//Brick Path
			var windowAddbrick = new Nwindow();
			var radio_stripe  = new Nradio("Stripe","stripe").group("type");
			var radio_replica = new Nradio("Replica","replica").group("type");
			var input_count = new Ninput("Count");
			var input_brick_path = new Ninput("Brick Path");
			var button_send = new Nbutton("Do it!")
				.onClick(function(){
					alert(windowAddbrick.content.find('input[name=type]:radio:checked').val());
				});
			var form = new Nform();
			form.append(new Nlabel("<h1>Add brick to "+volumename+"</h1>"))
				.append(radio_stripe)
				.append(radio_replica)
				.append(input_count)
				.append(input_brick_path)
				.append( new Nboxbuttons().append(button_send) );
			windowAddbrick.append(form);
			windowAddbrick.show();
			return windowAddbrick;
		}

		//the window with general parameters. Configuration.
		this.windowConfig = function(){
			var configWindow = new Nwindow();
			var input_address = new Ninput("Server Address", this.nconfig.get("config_server"));
			var input_script = new Ninput("Server Script", this.nconfig.get("config_server_script"));
			var button_send = (new Nbutton("OK, let's go"))
				.onClick(function(){
					self.nconfig.set("config_server", input_address.value());
					self.nconfig.set("config_server_script", input_script.value());
					configWindow.destroy();
				});
			var form1 = new Nform();
			form1.append(new Nlabel("<h1>General Configuration</h1>"))
				.append(input_address)
				.append(input_script)
				.append( new Nboxbuttons().append(button_send) );
					
			configWindow.append(form1);
			configWindow.show();
			return configWindow;
		}

		this.volumeStop = function(volume){
			if (confirm("Stopping volume will make its data inaccessible."+
					" Do you want to continue?"))
			{
				send_command("volume stop "+volume);
                        }
		}

	}
	mainGui = new WliMainGui();
	mainGui.renderBasic();
		

	/**** End of new libs to production ****/


	//load theme files to free server load
	printC("Loading interface...");
	var themefiles = 
		["volume_info.html",
		"volume_list.html",
		"form_addbrick.html",
		"form_config_wligluster.html"];

	for(var i in themefiles){
		printC("Loading theme file "+themefiles[i]+"...");
		get_theme_file(themefiles[i]);
	}
	
	if(nconfig.get("config_autoinit")){
		printC("Auto init enabled, sending first command.");
		send_command("volume list");
	}

	//making tabs events
	$(document).on('click', '.tabitem', 
	function(){
		return show_tab($(this).attr('href').replace("#",""));
	});

	//making popup events
	$('#popup #popupcontrol .close').click(
	function(){
		$('#popup').hide();
	});

	//making menu events
	$(document).on('click', '.menufirstitem', 
	function(){
		$(this).find('.menufirstgroup').toggle();
	});

	//events for config menu
	$(document).on('click', '#config a[href="#config_wligluster"]', 
	function(){
		showform_config_wligluster();
	});

	$(document).on('click', '#config a[href="#config_wligluster_export"]',
	function(){
		nconfig.export();
		return false;
	});
});

$('form#clicommand').submit(function() {
	var command = $("form#clicommand #inputtext").val();
	$("form#clicommand #inputtext").val("");
	printC(" ");
	printC("[$] "+command);
	if(command.length > 0)
	{
	
		printC("Ok, wait...");
		console.log("sending: "+
			nconfig.get("config_server_script")+
			"?command="+command.replace(/ /g,"+"));

		var jqxhr = $.get(nconfig.get("config_server")+ 
		nconfig.get("config_server_script"),
		{ command: command },
		function(){

			console.log("Recived data from server, procesing...")
		})
		.done(function(data) 
		{     
			console.log("Received data: " + data);
			//control error
			var errnum = $(data).find('wlireturn').text();
			if(errnum > 0){
				var rawout = $(data).find('raw').text();
				printC("Error num: "+errnum );
				printC("Error command output: "+rawout);
				alert_error(rawout);
				console.log("Error: "+rawout);
			}else{
				//here we process data
				$(data).find('cliOutput > volStatus').each(
				function(){
					volumen_status(data); });
				
				$(data).find('cliOutput > volInfo').each(
				function(){
					volumen_info(data); });

				$(data).find('cliOutput > volList').each(
				function(){
					volumen_list(data); mainGui.tabVolumelist(data); });

				$(data).find('cliOutput > volStart').each(
				function(){
					volumen_start(data); });

				$(data).find('cliOutput > volStop').each(
				function(){
					volumen_stop(data); });

				$(data).find('cliOutput > cliOp').each(
				function(){
					show_climsg(data);	
				});
			}
		})
		.fail(function() {
			printC("[!] ERROR ON THE WLIGLUSTER SERVER SIDE!");
		 })
		.always(function() { printC("Done "+command); });
	}
	return false;
});




/**************WARNING, BELOW YOU HAVE OLD FUNCTIONS, IT WILL BE REMOVED SOON*****************/






//**********************************
// GUI Util functions
//**********************************
function alert_error(msg){
	alert("Error:\n\n"+msg);
}

function printC(msg){
	$('#console').append("<p>"+msg+"</p>");
	$('#console').animate({ scrollTop: $('#console').get(0).scrollHeight}, 100);
}

function send_command(command){
	$('input#inputtext').val(command);
	$("form#clicommand").submit();
}

function add_tab(id){//LOOK if we can improve this. themable?
	var tabid="tab"+id;
	if ($("#view > #"+tabid).length > 0){
		var tabobj = $("#view > #"+tabid);
		show_tab(tabid);
	}else{
		$("#view > #tabs").append("<li "+
			"id=\"btab"+tabid+"\"><a href=\"#"+tabid+"\" "+
			"class=\"tabitem ntabbutton\">"+tabid+"</a></li>");

		var tabobj = $("#view").append("<div "+
			"id=\""+tabid+"\" class=\"viewtab ntabcontent\">"+
			"</div>").find("#"+tabid);
		show_tab(tabid);
	}
	return tabobj;
}

function clear_tab(tabid){
	$('#view > #tab'+tabid).empty();
}

function selected_tab(tabid){
	$('#view > #tabs > li').removeClass("selectedtab");
	$('#view > #tabs > #btab'+tabid).addClass("selectedtab");
}

function show_tab(tabid){
	$('#view > .viewtab').hide();
	$('.ntabcontent').hide();
	$('#view > #'+tabid).show();
	selected_tab(tabid);
	return false;
}

function show_climsg(gxml){
	//TODO: SEE opRet to determine if error or not
	if( $(gxml).find('cliOutput > opRet').text() < 0  ){
		var msgtype="[!!] Error ("
			+$(gxml).find('cliOutput > opRet').text()+" | "
			+$(gxml).find('cliOutput > opErrno').text()+"):\n\n\n";
			alert(msgtype+$(gxml).find('cliOutput > output').text());
	}else{
		printC("Info: "+$(gxml).find('cliOutput > output').text());
	}
}

function close_popup(){
	$('#popup').hide();
}

function open_popup(){
	$('#popup').show();
}

function put_file_on_popup(filename){
	$('#popup > #popupview').html(get_theme_file(filename));
	$('#popup').show();
}

function put_html_on_popup(thehtml){
	$('#popup > $popupview').html(thehtml);
	$('#popup').show();
}
//*** End of GUI Util functions

//**********************************
// Theme functions
//**********************************

function get_theme_file(filename){
	var htmltoret = nstorage.getvar("themefile_" + filename);
	if(htmltoret === null){
		$.ajax({
			url: 'themes/'+nconfig.get("config_theme")+'/'+filename,
			beforeSend: function ( xhr ) {
				//the only way I found to ignore html web engine parser
				xhr.overrideMimeType("text/plain; charset=x-user-defined"); 
			},
			async: false
		}).done(function ( themehtml ) {
			htmltoret=themehtml;
		});
		nstorage.setvar("themefile_" + filename, htmltoret);
	}
	return htmltoret;
}

function nreplace(rep,thehtml){
// I dont like loop, but...
	for(key in rep) {
		console.log("replacing "+key+" for "+rep[key])
		thehtml = thehtml.replace( new RegExp(key, "g"),rep[key]);	
	}
	return thehtml;
}
//*** End of Theme functions

//**********************************
// Popups and forms
//**********************************
function showform_config_wligluster(){
	put_file_on_popup('form_config_wligluster.html');

	$('form#config_wligluster '+
	'input[name="config_server_address"]').val(nconfig.get("config_server"));

	$('form#config_wligluster '+
	'input[name="config_server_script"]').val(nconfig.get("config_server_script"));

	$('form#config_wligluster').submit(function(){
		nconfig.set(
			"config_server", 
			String(
				$('form#config_wligluster '+
				'input[name="config_server_address"]').val() 
			)
		);

		nconfig.set(
			"config_server_script", 
			String(
				$('form#config_wligluster '+
				'input[name="config_server_script"]').val()
			)
		);
		close_popup();
		return false;
	});
}

function showform_addbrick(volname){
	put_file_on_popup('form_addbrick.html');

	//events
	$("#addbrickform .bricksinputsbox input").focus(function(){
		$(this).addClass('inputbricksfocused');
	});
	$("#addbrickform .bricksinputsbox input").focusout(function(){
		 $(this).removeClass('inputbricksfocused');
	});

	$('form#addbrickform').submit(function(){

		var ftype=String($('form#addbrickform '+
				'select[name="type"] option:selected').val());

		var fcount=String($('form#addbrickform input[name="count"]').val());
		var fbrickpath=String($('form#addbrickform input[name="brickpath"]').val());

		var options="";
		if(ftype.length > 0 || fcount.length > 0){
			if(fcount.length > 0 && ftype.length > 0){
				options = options +" "+ftype+" "+fcount;
			}else{
				alert("Specify \"Type\" and \"Count\" "+
						"or leave two options empty");
				return false;
			}
		}

		if(fbrickpath.length <= 0){
			alert("Specify brick(s) path");
			return false;
		}
		options = options+" "+fbrickpath
		
		var command ="volume add-brick "+volname+" "+options;
		send_command(command);
		close_popup();

		//prevent page reload
		return false;
	});
}

//*** End fo Popups and forms

//**********************************
// Parse and show Responses
//**********************************
function volumen_start(gxml){
	$(gxml).find('cliOutput > volStart').each(function(){
		var volname = $(this).find('volname').text();
	});
	send_command("volume info");
}	

function volumen_stop(gxml){
	$(gxml).find('cliOutput > volStop').each(function(){
		var volname = $(this).find('volname').text();
	});
	send_command("volume info");
}

function volumen_list(gxml){
	themehtml = get_theme_file('volume_list.html');
	var volumelistshtml="";
	$(gxml).find('cliOutput > volList > volume').each(function(){
		//for each volume
		var rep = {
			"{NAME}": $(this).text(),
			"{VOLID}": $(this).text(),
			"{HREFNAME}": $(this).text(),
			"{VOLNAME}": $(this).text()
		};
		volumelistshtml = volumelistshtml + nreplace(rep,themehtml);
	});

	var rep = {
		"{NAME}": "ALL",
		"{VOLID}": "all",
		"{HREFNAME}": "all",
		"{VOLNAME}": "all"
	};
	volumelistshtml = volumelistshtml + nreplace(rep,themehtml);

	//add new info tab
	var tabobj = add_tab("volumelist");
	//add html to tab
	tabobj.html(themehtml);
	//add the list of volumes to id=volumelist
	$("#tabvolumelist #volumelist").html(volumelistshtml);

	//adding events
	$('#tabvolumelist #volumelist .volumelistelement '+
	'.volumeonclick').click(function(){
		//WARNING, CAN VOLUMES HAVE # IN THEIR NAMES?
		var volume = $(this).attr('href').replace("#", "");
		send_command("volume info "+volume);
		return false;
	});
		
	//Maybe we need to make specific functions for each 
	//command to do not repeat things like confirmation 
	//on volume stop
	$('#tabvolumelist #volumelist .volumelistelement '+
	'.volumelistmenu .opt_volumeinfo').click(function(){
		send_command("volume info "
			+$(this).attr('href').replace("#",""));
	});
	
	$('#tabvolumelist #volumelist .volumelistelement '+
	'.volumelistmenu .opt_volumestatus').click(function(){
		send_command("volume status "
			+$(this).attr('href').replace("#",""));
	});

	$('#tabvolumelist #volumelist .volumelistelement '+
	'.volumelistmenu .opt_volumestatusdetail').click(function(){
		send_command("volume status "
			+$(this).attr('href').replace("#","")+" detail");
	});

	$('#tabvolumelist #volumelist .volumelistelement '+
	'.volumelistmenu .opt_volumestop').click(function(){
		send_command("volume stop "
			+$(this).attr('href').replace("#",""));
	});

	$('#tabvolumelist #volumelist .volumelistelement '+
	'.volumelistmenu .opt_volumestart').click(function(){
		send_command("volume start "
			+$(this).attr('href').replace("#",""));
	});

	$('#tabvolumelist #volumelist .volumelistelement '+
	'.volumelistmenu .opt_volumeaddbrick').click(function(){
		showform_addbrick($(this).attr('href').replace("#",""));
	});
}

function volumen_info(gxml){
	//get theme file
	themehtmlorig = get_theme_file('volume_info.html');
	//clear content of tab. On a future improve this.
	clear_tab("volumeinfo");
	//parse every volume section
	$(gxml).find('cliOutput > volInfo > volumes > volume').each(function(){
		
		var themehtml = themehtmlorig;
		var volname = $(this).find('name').text()
		var divguid = "volinfobox"+volname;

		// Translate numeric values for Type of gluster
		// 2 = Rplicate
		var volumetype = new Array();
		volumetype[2] = "Replicate";
		volumetype[0] = "Distribute"

		// Translate numeric status to human readable
		// 1 = Started
		// 0 = Stoped?
		var volumestatus = new Array();
		volumestatus[1] = "Started";
		volumestatus[2] = "Stopped";
		volumestatus[0] = "Created";

		themehtml = 
			nreplace(
				{
				"{UID}": divguid,
				"{NAME}": volname,
				"{ID}": $(this).find('id').text(),
				"{TYPE}": volumetype[$(this).find('type').text()],
				"{STATUS}": volumestatus[ $(this).find('status').text()],
				"{MENUVOLNAME}": volname
				},
			themehtml );

		// Get html for one brick
		var themehtmlbrick = $(themehtml).find(".bricklist").html()

		// Loop to construct html for every brick
		var bricks = "";
		$(this).find('bricks > brick').each(function(){
			bricks = bricks +
					nreplace(
						{ "{BRICKNAME}":$(this).text() }, 
						themehtmlbrick
					);
		});

		//add tab to view. id = tab+id_arg_passed
		var tabobj = add_tab("volumeinfo");
		tabobj.append(themehtml); //insert html for volume
		//insert html brick info for this volume. I dont like this, look later.
		$("#tabvolumeinfo #"+divguid+" .bricklist").html(bricks);

		//add events
		$("#tabvolumeinfo #"+divguid+" .menu_volumen_stop").click(function(){
			if (confirm("Stopping volume will make its data inaccessible."+
					" Do you want to continue?"))
			{
				send_command("volume stop "+
					$(this).attr('href').replace("#",""));
			}
		});						

		$("#tabvolumeinfo #"+divguid+" .menu_volumen_start").click(function(){
			send_command("volume start "+volname);
		});

		$("#tabvolumeinfo #"+divguid+" .option_log_rotate").click(function(){
			send_command("volume log rotate  "+volname+" "+
				$(this).attr('href').replace("#",""));
			//WARNING, BRICK CAN HAVE # IN THEIR NAME?
		});
	});
}

function volumen_status(data){ 
	alert("vol status not implemented yet"); }
//*** End of show and parse Responses



