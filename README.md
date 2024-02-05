<!--
SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
SPDX-License-Identifier: CC0-1.0
-->

# OTP Manager

*Read this in other languages: [Italian](README.it.md)*

*Official Nextcloud OTP Manager app repository: [otpmanager-app](https://github.com/matteo-convertino/otpmanager-app)*

*Nextcloud App Store: [otpmanager](https://apps.nextcloud.com/apps/otpmanager)*

# Screenshots
<img src="img/screenshots/1.png">

# Description
OTP Manager is useful for those who use two-factor authentication (2FA) and want to manage their OTP codes securely and easily. 
This application allows you to synchronize your OTP codes with your personal Nextcloud server so that you can access them from any device.

With OTP Manager, you no longer have to worry about losing your OTP codes or not having access to them when you need them. 
All you have to do is synchronize your app with your Nextcloud server and you will always have your OTP codes at hand, wherever you are.

OTP Manager offers the convenient feature of importing OTP codes from Google Authenticator by scanning the QR code. 
This means you don't have to worry about having to manually enter every single OTP code, but can simply scan the QR code that the Google app generates when exporting 
accounts, and OTP Manager will automatically import your associated accounts.

This way, the migration from Google Authenticator to OTP Manager will be quick and easy, without having to waste time manually resetting all your OTP codes.

# Manual Installation

If you want to install it manually, you have to run these steps:

- clone repository inside your `custom_apps` folder
- set `'debug' => true` in `config/config.php` file:
```
$CONFIG = array (
    'debug' => true,
    ... configuration goes here ...
);

```
- enable app into Nextcloud apps section

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
    
# Planned Features
- [ ] Implement research
- [ ] Be able to move accounts into the datatable
- [ ] Develop recycle bin
- [ ] Multiple elimination
- [ ] [Folders to organize many OTP-entries](https://github.com/matteo-convertino/otpmanager-nextcloud/issues/12)
- [ ] [[Feature Request] Ability to share OTPs](https://github.com/matteo-convertino/otpmanager-nextcloud/issues/13)

# API Documentation
The URL to the API is: https://nextcloud-url/apps/otpmanager/<api-function>
Here are the different API functions:
| URL | What it does |
| --- | ------------ |
|  /  | This is the main page of the Plugin, this is where you noramlly go to login and get your OTP logins. |
### Account
| URL | What it does |
| --- | ------------ |
| /accounts | This is a GET request, and this is the path to view all accounts in a JSON format. You can also see the secrets of accounts there. |
| /accounts/sync | This is a POST request, currently i do not know what this does. i am guessing it is to do with the mobile app. |
| /accounts | This is a POST request, and this is adding new OTP codes. |
| /accounts/{id} | This is a GET request, and this shows the details of the account with the specified ID. (Replace {id} with the ID of the OTP you are trying to look at, that can be found in /accounts.) |
| /accounts | This is a PUT request, currently i do not know what this does. i am guessing it is something to do with updating OTPs. |
| /accounts/{id} | This is a DELETE request, this deletes accounts by there id, replace {id} with the id of the account you want to delete. |
| /accounts/import | This imports accounts from a JSON file you exported. |

### Settings
| URL | What it does |
| --- | ------------ |
| /settings | This is a GET request, and shows settings for the current nextcloud user. |
| /settings | This is a POST request, and saves the settings the current nextcloud user has set. |
| /settings/key | I currently don't know what this one does, as it causes an internal server error. |

### Password
| URL | What it does |
| --- | ------------ |
| /password | This is a GET request, and shows if the current nextcloud user has a password on the plugin. |
| /password | This is a POST request, and creates a password for the plugin for the current nextcloud user. |
| /password | This is a PUT request, and updates the password for the plugin for the current nextcloud user. |
| /password/check | This is a POST request, and checks if the given password is the same as the one set by the current nextcloud user. |

## Contributors ✨

Special thanks go to these wonderful people:
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/davideserio"><img src="https://avatars.githubusercontent.com/u/90445202?v=4" width="100px;" alt="Davide Serio"/><br /><sub><b>Davide Serio</b></sub></a><br /></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/srijansaxena11"><img src="https://avatars.githubusercontent.com/u/34964694?v=4" width="100px;" alt="Srijan Saxena"/><br /><sub><b>Srijan Saxena</b></sub></a><br /></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/meichthys"><img src="https://avatars.githubusercontent.com/u/10717998?v=4" width="100px;" alt="Meichthys"/><br /><sub><b>Meichthys</b></sub></a><br /></td>
    </tr>
  </tbody>
</table>
