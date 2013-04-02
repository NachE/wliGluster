$(document).ready(function() {


	$("#inputtext").focus();

	//add event to exist and future elements
	$(document).on('click', '.volmenu', function(){
		$(this).find('.volmenuopts').toggle();
	});

});
