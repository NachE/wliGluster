
$("form #clicommand").submit(function() {
	var jqxhr = $.get("glusterxml.php",{ command: $("input:first").val() },  function() {
		alert("success");
	})
	.done(function(data) { alert("second success"); })
	.fail(function() { alert("error"); })
	.always(function() { alert("finished"); });
});
