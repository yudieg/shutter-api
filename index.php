<?php
ini_set('display_errors',1);
error_reporting(E_ALL);


require_once 'ShutterApi.php';

$api = new ShutterApi('/arduino/api');

$api->route();