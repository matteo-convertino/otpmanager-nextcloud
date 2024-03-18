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
		
		['name' => 'sync#update', 'url' => '/accounts/sync', 'verb' => 'POST'],

		['name' => 'account#getAll', 'url' => '/accounts', 'verb' => 'GET'],
		['name' => 'account#create', 'url' => '/accounts', 'verb' => 'POST'],
		['name' => 'account#get', 'url' => '/accounts/{id}', 'verb' => 'GET'],
		['name' => 'account#update', 'url' => '/accounts', 'verb' => 'PUT'],
		['name' => 'account#delete', 'url' => '/accounts/{id}', 'verb' => 'DELETE'],
		// ['name' => 'account#destroy', 'url' => '/accounts/destroy/{id}', 'verb' => 'DELETE'],
		['name' => 'account#import', 'url' => '/accounts/import', 'verb' => 'POST'],
		['name' => 'account#updateCounter', 'url' => '/accounts/update-counter', 'verb' => 'POST'],

		['name' => 'setting#get', 'url' => '/settings', 'verb' => 'GET'],
		['name' => 'setting#save', 'url' => '/settings', 'verb' => 'POST'],

		['name' => 'password#get', 'url' => '/password', 'verb' => 'GET'],
		['name' => 'password#create', 'url' => '/password', 'verb' => 'POST'],
		['name' => 'password#update', 'url' => '/password', 'verb' => 'PUT'],
		['name' => 'password#check', 'url' => '/password/check', 'verb' => 'POST'],

		['name' => 'sharedAccount#getByUser', 'url' => '/share', 'verb' => 'GET'],
		['name' => 'sharedAccount#getByAccount', 'url' => '/share/{id}', 'verb' => 'GET'],
		['name' => 'sharedAccount#create', 'url' => '/share', 'verb' => 'POST'],
		['name' => 'sharedAccount#update', 'url' => '/share', 'verb' => 'PUT'],
		['name' => 'sharedAccount#unlock', 'url' => '/share/unlock', 'verb' => 'POST'],
		['name' => 'sharedAccount#delete', 'url' => '/share/{accountId}', 'verb' => 'DELETE'],
		['name' => 'sharedAccount#getUsers', 'url' => '/get-users/{accountId}', 'verb' => 'GET'],
		['name' => 'sharedAccount#updateCounter', 'url' => '/share/update-counter', 'verb' => 'POST'],
		// ['name' => 'info#get', 'url' => '/info', 'verb' => 'GET'],
	]
];
