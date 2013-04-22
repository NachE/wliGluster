<?php 
	$config_theme ="default";
?>
<html><head><title>Web Line Interface for GlusterFS (WLI Gluster)</title>
<link rel="stylesheet" href="<?php echo "themes/".$config_theme."/";?>style/main.css" />
</head>
<body>
<div id="wrapp">
   <div id="popup">
      <div id="popupcontrol"><p class="close">Close</p></div>
      <div id="popupview"></div>
   </div>
   <div id="config">
      <ul>
         <li class="menufirstitem">Config
            <ul class="menufirstgroup">
               <li><a href="#config_wligluster">Server Address</a></li>
            </ul>
         </li>
      </ul>
   </div>
   <div id="view">
      <ul id="tabs"></ul>
   </div>
   <div id="console"></div>
   <div id="cliinput">
      <form id="clicommand" action="" method="post">
         <input id="inputtext" type="text" name="command" />
         <input type="submit" value="Send" />
      </form>
   </div>
</div>
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="<?php echo "themes/".$config_theme."/";?>js/style.js"></script>
<script type="text/javascript" src="js/wliglibs/nstorage.js"></script>
<script type="text/javascript" src="js/wlig.js"></script>
</body>
</html>
