<!--
SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
SPDX-License-Identifier: CC0-1.0
-->

# OTP Manager

If you want to install it manually, you have to run these steps:

- clone repository inside your `custom_apps` folder
- set `'debug' => true` in `config/config.php` file:
```
$CONFIG = array (
    'debug' => true,
    ... configuration goes here ...
);

```
- enable app into nextcloud apps section

- run this command to create all the tables: 
```
php ./occ migrations:execute <app-folder-name> <version-number>
```
> To get the `<version-number>` you can run this command:
> ```
> php ./occ migrations:status <app-folder-name>
> ```
> and check the `Latest Version`.

- Finally run these commands to install all dependencies:
```
npm install
make composer
```
