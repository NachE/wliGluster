<?php
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


$glusterbin="/usr/sbin/gluster";
header('Content-Type: text/xml');
	$output = array();

	$saveconfirmation="";
	if($_GET["saveconfirmation"]){

	}

	$command=$glusterbin." --mode=script ".escapeshellcmd($_GET['command'])." --xml 2>&1";

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
	}

?>
