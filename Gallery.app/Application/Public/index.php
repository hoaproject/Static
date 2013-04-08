<?php

require_once '/usr/local/lib/Hoa/Core/Core.php';

from('Hoa')
-> import('File.Read')
-> import('Xyl.~')
-> import('Dispatcher.Basic')
-> import('Router.Http');

$dispatcher = new \Hoa\Dispatcher\Basic(array(
    'asynchronous.action' => '(:%synchronous.action:)'
));
$router     = new \Hoa\Router\Http(array(
    'prefix' => '/Image/Gallery'
));

$router
    ->get('g', '/(?<gallery>[\w\d\-_]+)\.html', 'gallery', 'list')
    ->get('p', '/(?<gallery>[\w\d\-_]+)/(?<picture>[\w\d\-_]+)\.html', 'gallery', 'picture')
    ->get('v', '/(?<gallery>[\w\d\-_]+)/(?<picture>[\w\d\-_]+)\.jpg', 'gallery', 'verbatim')
    ->get('i', '/', 'gallery', 'index')

    ->_get('_resource', 'http://static.hoa-project.net/(?<resource>)');

try {

    $dispatcher->dispatch($router);
}
catch ( \Hoa\Core\Exception $e ) {

    echo 'Damned…', "\n";
    var_dump($e->raise(true));

    exit;
}
