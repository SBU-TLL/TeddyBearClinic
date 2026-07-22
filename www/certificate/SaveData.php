<?php
if(!preg_match("/Type/",implode(" ",$_GET))){
date_default_timezone_set('US/Eastern');
$file = "/home/tltsecure/apache2/htdocs/userData/TeddyBearClinic/players.csv";
$name = $_GET['name'];
$institution = $_GET['institution'];
$date = date('l jS \of F Y h:i:s A');
$contents = "$name,$institution,\"$date\"\n";

file_put_contents($file, $contents, FILE_APPEND | LOCK_EX);
}