<?php
if(!preg_match("/Type/",implode(" ",$_GET))){
date_default_timezone_set('US/Eastern');
$file = "/home/tltsecure/apache2/htdocs/userData/TeddyBearClinic/tracker.csv";
$name = $_GET['name'];
$address = $_SERVER['REMOTE_ADDR'];
$date = date('l jS \of F Y h:i:s A');
$contents = "$name,$address,\"$date\"\n";

file_put_contents($file, $contents, FILE_APPEND | LOCK_EX);
}
