var config_theme = "default";

$('form#clicommand').submit(function() {
	printC(" ");
	printC("[$] "+$("input:first").val());
	if($("input:first").val().length > 0){
		printC("Ok, wait...");
		var jqxhr = $.get("glusterxml.php",{ command: $("input:first").val() },  function() {
			printC("Procesing response...");
		})
		.done(function(data) 
		{     
			printC("Received data: " + data);
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

				$(data).find('cliOutput > volStart').each(function(){
					volumen_start(data); });

				$(data).find('cliOutput > volStop').each(function(){
					volumen_stop(data); });

			}
		})
		.fail(function() {
			printC("[!] ERROR ON THE WLIGLUSTER SERVER SIDE!");
		 })
		.always(function() { printC("Done"); });

	}

	$("input:first").val("");
	return false;
});

function printC(msg){
	$('#console').append("<p>"+msg+"</p>");
	$('#console').animate({ scrollTop: $('#console').get(0).scrollHeight}, 15);
}

function send_command(command){
	$('input#inputtext').val(command);
	$("form#clicommand").submit();
}

function add_tab(id){//LOOK if we can improve this. themable?

	var tabid="tab"+id;
	if ($("#view > #"+tabid).length > 0){
		return $("#view > #"+tabid);
	}else{
		return $("#view").append("<div id=\""+tabid+"\" class=\"viewtab\"></div>").find("#"+tabid);
	}
	
}

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


function volumen_info(gxml){

	//get theme file
	$.get('themes/'+config_theme+'/volume_info.html', function (themehtml) {
		//parse every volume section
		$(gxml).find('cliOutput > volInfo > volumes > volume').each(function(){

			var volname = $(this).find('name').text()
			var divguid = "volinfobox"+volname;	
			//replace {VAR} with their value
			themehtml = themehtml.replace("{UID}", divguid );
			themehtml = themehtml.replace("{NAME}", volname);
			themehtml = themehtml.replace("{ID}", $(this).find('id').text());

			// Translate numeric values for Type of gluster
			// 2 = Rplicate
			var volumetype = new Array();
			volumetype[2] = "Replicate";
			//replace {TYPE} var with human readable info
			themehtml = themehtml.replace("{TYPE}", volumetype[$(this).find('type').text()]);

			// Translate numeric status to human readable
			// 1 = Started
			// 0 = Stoped?
			var volumestatus = new Array();
			volumestatus[1] = "Started";
			volumestatus[2] = "Stopped";
			themehtml = themehtml.replace("{STATUS}",volumestatus[ $(this).find('status').text() ]);

			// Get html for one brick
			var themehtmlbrick = $(themehtml).find(".bricklist").html()

			// Loop to construct html for every brick
			var bricks = "";
			$(this).find('bricks > brick').each(function(){
				bricks = bricks + themehtmlbrick.replace("{BRICKNAME}", $(this).text());
			});

			//add tab to view
			var tabobj = add_tab("volumeinfo");
			
			//insert html for volume
			//$('#view').html(themehtml);
			tabobj.html(themehtml);
			//insert html brick info for this volume. I dont like this, look later.
			$("#"+divguid+" .bricklist").html(bricks);

			//add events
			$("#"+divguid+" .menu_volumen_stop").click(function() {
				send_command("volume stop "+volname); //WARNING. WILL THIS WORK WITH MULTIPLE VOLUMES??
			});						

			$("#"+divguid+" .menu_volumen_start").click(function() {
				send_command("volume start "+volname); //WARNING. WILL THIS WORK WITH MULTIPLE VOLUMES??
			});


		});
	});
}

function volumen_status(data){ alert("vol status"); }

//unused? remove?
function guid(){
	return ((new Date()).getTime()).toString() + (  Math.round( (1 + Math.random()) * 0x10000 )    ).toString();
}
