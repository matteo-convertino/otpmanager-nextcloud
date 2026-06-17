# OTP Manager API

# Table of Contents

- [Description](#description)
  - [Base URL](#base-url)
  - [Headers](#headers)
- [API Endpoints](#api-endpoints)
  - [Account](#account)
  - [Sync](#sync)
  - [Settings](#settings)
  - [Password](#password)
  - [Shared Account](#shared-account)
- [OCS API Structure](#ocs-api-structure)


## Description

### Base URL

Typically, the base URL for each Nextcloud OCS API for this app is:

`/ocs/v2.php/apps/otpmanager/`

Example:

`GET /ocs/v2.php/apps/otpmanager/accounts`

### Headers

It is recommended to add these headers for all requests in order to avoid any issues:

- `OCS-APIRequest: true`
- `Accept: application/json`
- `Content-Type: application/json`

## API Endpoints

### Account

| Method | Endpoint                   | Response                     | Exceptions |
|--------|----------------------------|------------------------------|------------|
| GET    | `/accounts`                | `List<AccountDatatableResponseDto>` | `OCSException` |
| GET    | `/accounts/deleted`        | `List<AccountDatatableResponseDto>` | `OCSException` |
| GET    | `/accounts/{id}`           | `AccountResponseDto \| null` | `OCSBadRequestException` |
| POST   | `/accounts`                | `AccountResponseDto`         | `OCSBadRequestException`, `OCSException` |
| PUT    | `/accounts`                | `AccountResponseDto`         | `OCSBadRequestException`, `OCSException` |
| DELETE | `/accounts/{id}`           | `null`                       | `OCSBadRequestException`, `OCSException` |
| POST   | `/accounts/{id}/restore`   | `AccountResponseDto`         | `OCSBadRequestException`, `OCSException` |
| DELETE | `/accounts/{id}/destroy`   | `null`                       | `OCSBadRequestException`, `OCSException` |
| POST   | `/accounts/import`         | `null`                       | `OCSBadRequestException`, `OCSException` |
| POST   | `/accounts/update-counter` | `AccountResponseDto`         | `OCSBadRequestException`, `OCSException` |

### Sync

| Method | Endpoint         | Response          | Exceptions |
|--------|------------------|-------------------|------------|
| POST   | `/accounts/sync` | `SyncResponseDto` | `OCSBadRequestException`, `OCSException` |

### Settings

| Method | Endpoint    | Response             | Exceptions |
|--------|-------------|----------------------|------------|
| GET    | `/settings` | `SettingResponseDto` | runtime/DB error |
| POST   | `/settings` | `SettingResponseDto` | `OCSBadRequestException`, `OCSException` |

### Password

| Method | Endpoint           | Response                  | Exceptions |
|--------|--------------------|---------------------------|------------|
| POST   | `/password/check`  | `PasswordResponseDto`     | `OCSBadRequestException` |
| GET    | `/password/status` | `PasswordStatusResponseDto` | `OCSException` |
| POST   | `/password`        | `PasswordResponseDto`     | `OCSBadRequestException`, `OCSException` |
| PUT    | `/password`        | `PasswordResponseDto`     | `OCSBadRequestException`, `OCSException` |

### Shared Account

| Method | Endpoint                 | Response                        | Exceptions |
|--------|--------------------------|----------------------------------|------------|
| GET    | `/share/{accountId}`     | `List<SharedAccountResponseDto>` | `OCSBadRequestException`, `OCSException` |
| POST   | `/share`                 | `null`                           | `OCSBadRequestException`, `OCSException` |
| PUT    | `/share`                 | `SharedAccountResponseDto`       | `OCSBadRequestException`, `OCSException` |
| DELETE | `/share/{accountId}`     | `null`                           | `OCSBadRequestException`, `OCSException` |
| GET    | `/get-users/{accountId}` | `List<ReceiverResponseDto>`      | `OCSBadRequestException`, `OCSException` |
| POST   | `/share/unlock`          | `null`                           | `OCSBadRequestException`, `OCSException` |
| POST   | `/share/update-counter`  | `AccountResponseDto`             | `OCSBadRequestException`, `OCSException` |

## OCS API Structure

All API calls use the Nextcloud OCS format: requests and responses are wrapped in the OCS envelope (`ocs`, `meta`, and `data`) to ensure a uniform response structure and consistent error handling.

Typical response structure:

```json
{
  "ocs": {
    "meta": {
      "status": "ok",
      "statuscode": 200,
      "message": "OK"
    },
    "data": {
      "...": "endpoint-specific payload"
    }
  }
}
```

Error response example:

```json
{
  "ocs": {
    "meta": {
      "status": "failure",
      "statuscode": 400,
      "message": "Error description"
    },
    "data": []
  }
}
```

> [!TIP]
> If you're reading this documentation, I assume you want to contribute to the project or develop your own OTP Manager client. In any case, in addition to using this documentation as a reference, I recommend checking how the API requests/responses were developed on the web app.
