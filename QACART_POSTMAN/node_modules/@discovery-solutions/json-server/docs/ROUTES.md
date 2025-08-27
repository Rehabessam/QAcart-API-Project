# Routes Reference

| URL Path         | Method | Description |
| :--------------- | :----- | :---------- |
| [/{entity}](#list-all-records-by-entity) | GET | List all records |
| [/{entity}](#insert-single-or-multiple-records) | POST   | Insert single or multiple records |
| [/{entity}/{id}](#get-single-record-by-ID) | GET | Get single record by ID |
| [/{entity}/{id}](#update-single-record-by-ID) | PATCH  | Update single record by ID |
| [/{entity}/{id}](#delete-single-record-by-ID) | DELETE | Delete single record by ID |
| [/{entity}/latest](#list-records-by-oldest) | GET | List records by latest |
| [/{entity}/oldest](#list-records-by-oldest) | GET | List records by oldest |
| ------- | ------- | -------- |
| [/system/search](#system-search) | GET | Search |
| [/system/auth](#system-login) | POST | Login |
| [/system/](#system-status) | GET | System Status |
| [/](#system-status) | GET | System Status |

## List all records by entity

```
GET /{entity}
```

## Insert single or multiple records

```
POST /{entity}
```

## Get single record by ID

```
GET /{entity}/{id}
```

## Update single record by ID

```
PATCH /{entity}/{id}
```

## Delete single record by ID

```
DELETE /{entity}/{id}
```

## List records by latest

```
GET /{entity}/latest
```

## List records by oldest

```
GET /{entity}/oldest
```
