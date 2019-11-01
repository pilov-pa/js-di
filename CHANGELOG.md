# Changelog

## [1.1.1] - 2019-11-01
- Increase tests coverage
- Code improvements

## [1.1.0] - 2019-10-30
### Added
- function hasParameter()
- function addParameter()

## [1.0.2] - 2019-10-15
### Changed
- Code improvements, +10% performance
- Updated outdated dependencies

## [1.0.1] - 2019-10-08
### Fixed
- Updated outdated dependencies

### Added
- Examples

### Updated
- Readme

## [1.0.0] - 2019-09-30
### Fixed
- Readme

## [0.4.0] - 2019-09-30
### Added
- Tags
- New `add()` function notation
- New function `addMulti()`
- Update npm dependencies
- Updated readme

### Changed
- Now service as dependency in parameter args should have prefix `:`, e. g. `"di.add("someService", SomeService, [":anotherService"]);`
- Now any value can be passed to service dependencies

## [0.3.2] - 2019-09-26

### Added
- Changelog
- Linter

## [0.3.1] - 2019-09-25

### Changed
- Updated dependencies


## [0.3.0] - 2019-09-25

### Added
- functions remove(), has()
- functions addParameters(), getParameter(), removeParameter()

### Changed
- Now all values except classes show be registered by `addParameters()` function.
All parameters should provide to dependencies parameter of `add()` function with prefix `@`  
