<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Create your routes in here. The name is the lowercase name of the controller
 * without the controller part, the stuff after the hash is the method.
 * e.g. page#index -> OCA\OtpManager\Controller\PageController->index()
 *
 * The controller class has to be registered in the application.php file since
 * it's instantiated in there
 */
return [
	'routes' => [
		['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
		
		['name' => 'account#getAll', 'url' => '/accounts', 'verb' => 'GET'],
		['name' => 'account#sync', 'url' => '/accounts/sync', 'verb' => 'POST'],

		['name' => 'account#create', 'url' => '/accounts', 'verb' => 'POST'],
		['name' => 'account#get', 'url' => '/accounts/{id}', 'verb' => 'GET'],
		['name' => 'account#update', 'url' => '/accounts', 'verb' => 'PUT'],
		['name' => 'account#delete', 'url' => '/accounts/{id}', 'verb' => 'DELETE'],

		['name' => 'setting#get', 'url' => '/settings', 'verb' => 'GET'],
		['name' => 'setting#save', 'url' => '/settings', 'verb' => 'POST'],
	]
];
