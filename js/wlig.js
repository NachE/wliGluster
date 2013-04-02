var config_theme = "default";

$("#clicommand").submit(function() {
	printC(" ");
	printC("[$] "+$("input:first").val());
	if($("input:first").val().length > 0){
		var jqxhr = $.get("glusterxml.php",{ command: $("input:first").val() },  function() {
			printC("Ok, wait...");
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
	$("#console").append("<p>"+msg+"</p>");
	$('#console').animate({ scrollTop: $('#console').get(0).scrollHeight}, 15);
}

function volumen_info(gxml){

	$.get('themes/'+config_theme+'/volume_info.html', function (themehtml) {
		$(gxml).find('cliOutput > volInfo > volumes > volume').each(function(){

			themehtml = themehtml.replace("{NAME}", $(this).find('name').text());
			themehtml = themehtml.replace("{ID}", $(this).find('id').text());


			$(this).find('bricks > brick').each(function(){
				//alert($(this).text());
			});
		});

		$('#view').html(themehtml);
	});

}

function volumen_status(data){ alert("vol status"); }
