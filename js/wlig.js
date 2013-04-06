var config_theme = "default";
var config_autoinit = true;

$(document).ready(function() {
	printC("Web Line Interface for Gluster");
	if(config_autoinit){
		printC("Auto init enabled, sending first command.");
		send_command("volume list");
	}
	//making tabs events
	$(document).on('click', '.tabitem', function(){
		show_tab($(this).attr('href').replace("#",""));
	});
});

$('form#clicommand').submit(function() {
	var command = $("input#inputtext").val();
	printC(" ");
	printC("[$] "+command);
	if(command.length > 0){
		printC("Ok, wait...");
		console.log("sending: glusterxml.php?command="+command.replace(/ /g,"+"));
		var jqxhr = $.get("glusterxml.php",{ command: command },  function() {
			//printC("Procesing response...");
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
			}else{
				//here we process data
				$(data).find('cliOutput > volStatus').each(function(){
					volumen_status(data); });
				
				$(data).find('cliOutput > volInfo').each(function(){
					volumen_info(data); });

				$(data).find('cliOutput > volList').each(function(){
					volumen_list(data); });

				$(data).find('cliOutput > volStart').each(function(){
					volumen_start(data); });

				$(data).find('cliOutput > volStop').each(function(){
					volumen_stop(data); });

				$(data).find('cliOutput > cliOp').each(function(){
					show_climsg(data);	
				});
			}
		})
		.fail(function() {
			printC("[!] ERROR ON THE WLIGLUSTER SERVER SIDE!");
		 })
		.always(function() { printC("Done "+command);  });

	}

	$("input:first").val("");
	return false;
});



//**********************************
// GUI Util functions
//**********************************
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
		$("#view > #tabs").append("<li id=\"btab"+tabid+"\"><a href=\"#"+tabid+"\" class=\"tabitem\">"+tabid+"</a></li>");
		var tabobj = $("#view").append("<div id=\""+tabid+"\" class=\"viewtab\"></div>").find("#"+tabid);
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
	$('#view > #'+tabid).show();
	 selected_tab(tabid);
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

function put_html_on_popup(thehtml){
	$('#popup > $popupview').html(thehtml);
}
//*** End of GUI Util functions

//**********************************
// Theme functions
//**********************************
function get_theme_file(filename){
	//I dont know how to do it better, but surely exists
	var htmltoret;
	$.ajax({
		url: 'themes/'+config_theme+'/'+filename,
		beforeSend: function ( xhr ) {
			xhr.overrideMimeType("text/plain; charset=x-user-defined"); //the only way I found to ignore html web engine parser
		},
		async: false
	}).done(function ( themehtml ) {
		htmltoret=themehtml;
	});
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
function showform_addbrick(volname){
	alert("no yet implemented");
}

//*** End of Popus

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
	$("#tabvolumelist #volumelist .volumelistelement .volumeonclick").click(function(){
		var volume = $(this).attr('href').replace("#", "");//WARNING, CAN VOLUMES HAVE # IN THEIR NAMES?
		send_command("volume info "+volume);
	});
		
//Maybe we need to make specific functions for each command to do not repeat things like confirmation on volume stop
	$('#tabvolumelist #volumelist .volumelistelement .volumelistmenu').click(function(){
		$(this).find('.volumelistmenugroup').toggle()
	});
	$('#tabvolumelist #volumelist .volumelistelement .volumelistmenu .volumelistmenugroup .opt_volumeinfo').click(function(){
		send_command("volume info "+$(this).attr('href').replace("#",""));
	});
	$('#tabvolumelist #volumelist .volumelistelement .volumelistmenu .volumelistmenugroup .opt_volumestatus').click(function(){
		send_command("volume status "+$(this).attr('href').replace("#",""));
	});
	$('#tabvolumelist #volumelist .volumelistelement .volumelistmenu .volumelistmenugroup .opt_volumestatusdetail').click(function(){
		send_command("volume status "+$(this).attr('href').replace("#","")+" detail");
	});
	$('#tabvolumelist #volumelist .volumelistelement .volumelistmenu .volumelistmenugroup .opt_volumestop').click(function(){
		send_command("volume stop "+$(this).attr('href').replace("#",""));
	});
	$('#tabvolumelist #volumelist .volumelistelement .volumelistmenu .volumelistmenugroup .opt_volumestart').click(function(){
		send_command("volume start "+$(this).attr('href').replace("#",""));
	});
	$('#tabvolumelist #volumelist .volumelistelement .volumelistmenu .volumelistmenugroup .opt_volumeaddbrick').click(function(){
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

		//replace {VAR} with their value
		var rep = {
			"{UID}": divguid,
			"{NAME}": volname,
			"{ID}": $(this).find('id').text(),
			"{TYPE}": volumetype[$(this).find('type').text()],
			"{STATUS}": volumestatus[ $(this).find('status').text()],
			"{MENUVOLNAME}": volname
		};

		themehtml = nreplace(rep,themehtml);

		// Get html for one brick
		var themehtmlbrick = $(themehtml).find(".bricklist").html()

		// Loop to construct html for every brick
		var bricks = "";
		$(this).find('bricks > brick').each(function(){
			bricks = bricks + nreplace({"{BRICKNAME}":$(this).text()}, themehtmlbrick);
		});

		//add tab to view. id = tab+id_arg_passed
		var tabobj = add_tab("volumeinfo");
		//insert html for volume
		//$('#view').html(themehtml);
		tabobj.append(themehtml);
		//insert html brick info for this volume. I dont like this, look later.
		$("#tabvolumeinfo #"+divguid+" .bricklist").html(bricks);

		//add events
		$("#tabvolumeinfo #"+divguid+" .menu_volumen_stop").click(function(){
			if (confirm("Stopping volume will make its data inaccessible. Do you want to continue?")) {
				send_command("volume stop "+$(this).attr('href').replace("#","")); //WARNING. WILL THIS WORK WITH MULTIPLE VOLUMES??
			}
		});						

		$("#tabvolumeinfo #"+divguid+" .menu_volumen_start").click(function(){
			send_command("volume start "+volname); //WARNING. WILL THIS WORK WITH MULTIPLE VOLUMES??
		});

		$("#tabvolumeinfo #"+divguid+" .option_log_rotate").click(function(){
			send_command("volume log rotate  "+volname+" "+$(this).attr('href').replace("#",""));//WARNING, BRICK CAN HAVE # IN THEIR NAME?
		});
	});
}

function volumen_status(data){ 
alert("vol status"); }
//*** End of show and parse Responses



//unused? remove?
function guid(){
	return ((new Date()).getTime()).toString() + (  Math.round( (1 + Math.random()) * 0x10000 )    ).toString();
}
