<?php
$glusterbin="/usr/sbin/gluster";
header('Content-Type: text/xml');
	$output = array();


	$command=$glusterbin." ".escapeshellcmd($_GET['command'])." --xml 2>&1";

	exec
	(
		$command,
		$output, 
		$retval
	);


	if ($retval != 0){
		echo "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><root><wlireturn>$retval</wlireturn><raw>".htmlspecialchars(implode("\n",$output))."</raw></root>";
	}else{
		echo implode("", $output);
		echo $command;
	}

?>
