<!--
SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
SPDX-License-Identifier: CC0-1.0
-->

# OTP Manager

*Leggilo anche in altre lingue: [Inglese](README.md)*

*Repositore dell'app ufficiale di Nextcloud OTP Manager [otpmanager-app](https://github.com/matteo-convertino/otpmanager-app)*

*Nextcloud App Store: [otpmanager](https://apps.nextcloud.com/apps/otpmanager)*

# Screenshots
<img src="img/screenshots/1.png">

# Descrizione
OTP Manager è utile per chi utilizza l'autenticazione a due fattori (2FA) e desidera gestire i propri codici OTP in modo sicuro e semplice. 
Questa applicazione consente di sincronizzare i codici OTP con il proprio server Nextcloud personale, in modo da potervi accedere da qualsiasi dispositivo.

Con OTP Manager non dovrete più preoccuparvi di perdere i codici OTP o di non potervi accedere quando ne avete bisogno. 
Tutto ciò che dovete fare è sincronizzare la vostra app con il server Nextcloud e avrete sempre a portata di mano i vostri codici OTP, ovunque vi troviate.

OTP Manager offre la comoda funzione di importare i codici OTP da Google Authenticator tramite la scansione del codice QR. 
Ciò significa che non dovrete preoccuparvi di inserire manualmente ogni singolo codice OTP, ma potrete semplicemente scansionare il codice QR che l'app di Google genera durante l'esportazione degli account e OTP Manager importerà automaticamente gli account associati.

In questo modo, la migrazione da Google Authenticator a OTP Manager sarà semplice e veloce, senza dover perdere tempo a reimpostare manualmente tutti i codici OTP.

# Installazione Manuale

Se vuoi installare l'estensione manualmente, esegui questi comandi:

- clona il progetto all'interno della tua cartella `custom_apps`
- imposta `'debug' => true` nel file `config/config.php`:
```
$CONFIG = array (
    'debug' => true,
    ... la tua configurazione ...
);

```
- abilita l'app dalla sezione apps di Nextcloud

- Esegui questi comandi per creare le tabelle: 
```
php ./occ migrations:execute <nome-cartella-app> <numero-versione>
```
> Per sapere il `<numero-versione>` puoi eseguire questo comando:
> ```
> php ./occ migrations:status <nome-cartella-app>
> ```
> e controllare `Latest Version`.

- Infine esegui questi comandi per installare tutte le dipendenze:
```
npm install
make composer
```
