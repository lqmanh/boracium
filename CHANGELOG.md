# CHANGELOG

## v1.4.0

## v1.3.0

### Features

- Add `SnmpClient.walk()`
- Add `MibParser.parseRawVarbind()`
- Improve typings

### PATCHES

- Fix a bug when parsing multiline varbinds

## v1.2.0

### Features

- Add `RawTrapMessage.timestamp` and `ParsedTrapMessage.timestamp`
- Export everything under main entry

## v1.1.0

### Features

- `TrapHandler` supports serverless mode

## v1.0.0

### Features

- Require Node.js >= 10
- Support trap listening via `TrapHandler`
- Start writing examples

## v0.3.0

### Features

- Add `MibParser` and move `SnmpClient.translate()` to `MibParser.translate()`
- `MibParser.translate()` support translating between any 2 OID formats: textual, numeric and full
- Officially support SNMP v3
- Export all types/interfaces

## v0.2.0

### Features

- Rename the project to `boracium`

## v0.1.0, v0.1.1

### Features

- Add `SnmpClient`
- Support sending GET, GETNEXT, GETBULK requests
- Support translating OIDs
