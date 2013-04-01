<?php
$glusterbin="/usr/sbin/gluster";
header('Content-Type: text/xml');
echo system
	(
		$glusterbin
		." ".
		escapeshellcmd($_GET['command'])
		." --xml".
		, 
		$retval
	);
?>
