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

			var errnum = $(data).find('wlireturna').text();
			alert(errnum);	
			var rawout = $(data).find('raw').text();
			printC("Error num: "+errnum );
			printC("Error command output: "+rawout);

			//alert("Data Loaded: " + data);
		})
		.fail(function() {
			printC("[!] ERROR ON THE WLIGLUSTER SERVER SIDE!");
		 })
		.always(function() { printC("Done"); });

	}

	return false;
});

function printC(msg){
	$("#console").append("<p>"+msg+"</p>");
	$('#console').animate({ scrollTop: $('#console').get(0).scrollHeight}, 15);
}
