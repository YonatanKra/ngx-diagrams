## [2.13.2](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.13.1...v2.13.2) (2020-02-09)

### Bug Fixes

- **imports:** coords interface import ([7b649a7](https://github.com/DanielNetzer/ngx-diagrams/commit/7b649a7e69ad7b570d05cfe9f12842fe43098f00))

## [2.13.1](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.13.0...v2.13.1) (2020-02-09)

### Bug Fixes

- **imports:** bad imports naming ([014f17a](https://github.com/DanielNetzer/ngx-diagrams/commit/014f17a4f3dbd8e4b166e072a67918a46c9760c3))

# [2.13.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.12.1...v2.13.0) (2019-12-25)

### Features

- **node model:** remove, update, add ports ([e334267](https://github.com/DanielNetzer/ngx-diagrams/commit/e3342674a5aad82d2e5e4c0839a989c2d371abb0))

## [2.12.1](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.12.0...v2.12.1) (2019-12-25)

### Bug Fixes

- **base event:** null reference in options for event ([8a69a51](https://github.com/DanielNetzer/ngx-diagrams/commit/8a69a51f16a172514030c20f2c628fd5aec31206))

# [2.12.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.11.2...v2.12.0) (2019-12-25)

### Features

- **base entity:** passing options to constructor ([5cd07d9](https://github.com/DanielNetzer/ngx-diagrams/commit/5cd07d956528d4a26c708ab45ae8b933ad76ebda))

## [2.11.2](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.11.1...v2.11.2) (2019-12-19)

### Bug Fixes

- **on entity destroyed:** reverted the filtering ([2b92467](https://github.com/DanielNetzer/ngx-diagrams/commit/2b92467c29907c489b958abef84e47c1470a5265))

## [2.11.1](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.11.0...v2.11.1) (2019-12-19)

### Performance Improvements

- **destroy options:** moved interface to a their right place ([c032bd5](https://github.com/DanielNetzer/ngx-diagrams/commit/c032bd5e0829d734ed125dd4c4d093a391a54132))

# [2.11.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.10.0...v2.11.0) (2019-12-19)

### Features

- **destroy options:** allowing to pass options to destroy method ([06373bf](https://github.com/DanielNetzer/ngx-diagrams/commit/06373bf193f8fcf42b4156bdb651dae42698ec85))
- **destroy-options:** emit property ([16a4a2e](https://github.com/DanielNetzer/ngx-diagrams/commit/16a4a2e7585b680aff81fb70bfae29cba55a8bad))

# [2.10.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.9.0...v2.10.0) (2019-11-21)

### Features

- **port:** added getters and setters for width and height ([ba2c6c5](https://github.com/DanielNetzer/ngx-diagrams/commit/ba2c6c581bd3f5a586dd44bb286f6a5c7351f1a4))

# [2.9.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.8.3...v2.9.0) (2019-11-21)

### Features

- **port:** get x,y coords ([5162334](https://github.com/DanielNetzer/ngx-diagrams/commit/5162334b1005b3a557e3363d414148c5e2bb3a13))

## [2.8.3](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.8.2...v2.8.3) (2019-09-16)

### Bug Fixes

- **actions:** links created action ([f031475](https://github.com/DanielNetzer/ngx-diagrams/commit/f031475))

## [2.8.2](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.8.1...v2.8.2) (2019-09-15)

### Bug Fixes

- **defaults:** default link coords binding ([1f54ccd](https://github.com/DanielNetzer/ngx-diagrams/commit/1f54ccd))
- **links:** maximum links ([554e76e](https://github.com/DanielNetzer/ngx-diagrams/commit/554e76e))
- **points:** bad coords observable for points ([1936d62](https://github.com/DanielNetzer/ngx-diagrams/commit/1936d62)), closes [#13](https://github.com/DanielNetzer/ngx-diagrams/issues/13)

## [2.8.1](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.8.0...v2.8.1) (2019-09-11)

### Bug Fixes

- **actions:** link connection action now trigger when link is valid ([60d413e](https://github.com/DanielNetzer/ngx-diagrams/commit/60d413e))

# [2.8.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.7.1...v2.8.0) (2019-09-09)

### Features

- **actions:** on link connected between two ports ([55f492e](https://github.com/DanielNetzer/ngx-diagrams/commit/55f492e))

## [2.7.1](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.7.0...v2.7.1) (2019-09-09)

### Bug Fixes

- **selection:** multiple selection ([49ab712](https://github.com/DanielNetzer/ngx-diagrams/commit/49ab712)), closes [#12](https://github.com/DanielNetzer/ngx-diagrams/issues/12)

# [2.7.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.6.4...v2.7.0) (2019-09-04)

### Features

- **auto arrange:** dagre based auto arrange engine ([4e6263a](https://github.com/DanielNetzer/ngx-diagrams/commit/4e6263a))

## [2.6.4](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.6.3...v2.6.4) (2019-09-03)

### Bug Fixes

- **custom links:** outport can now define their links type per port ([68d0b95](https://github.com/DanielNetzer/ngx-diagrams/commit/68d0b95)), closes [#10](https://github.com/DanielNetzer/ngx-diagrams/issues/10) [#11](https://github.com/DanielNetzer/ngx-diagrams/issues/11)

## [2.6.3](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.6.2...v2.6.3) (2019-07-11)

### Bug Fixes

- **defauls:** changed exports to point to index file ([c3032e0](https://github.com/DanielNetzer/ngx-diagrams/commit/c3032e0))

## [2.6.2](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.6.1...v2.6.2) (2019-07-11)

### Bug Fixes

- **defaults:** exporting all default components ([3bb0ec8](https://github.com/DanielNetzer/ngx-diagrams/commit/3bb0ec8))

## [2.6.1](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.6.0...v2.6.1) (2019-07-08)

### Bug Fixes

- **security:** updated packages to remove security issues ([6643aa5](https://github.com/DanielNetzer/ngx-diagrams/commit/6643aa5))

### Performance Improvements

- **default components:** exported as individual modules ([2a4bff6](https://github.com/DanielNetzer/ngx-diagrams/commit/2a4bff6))

# [2.6.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.5.1...v2.6.0) (2019-07-04)

### Features

- **labels:** links can now have a label ([4359cb5](https://github.com/DanielNetzer/ngx-diagrams/commit/4359cb5))

## [2.5.1](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.5.0...v2.5.1) (2019-06-26)

### Bug Fixes

- **change detection:** on widget created run change detection ref check ([05f1eec](https://github.com/DanielNetzer/ngx-diagrams/commit/05f1eec))

# [2.5.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.4.0...v2.5.0) (2019-06-25)

### Features

- **default port:** custom ids ([6e7772a](https://github.com/DanielNetzer/ngx-diagrams/commit/6e7772a))

# [2.4.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.3.0...v2.4.0) (2019-06-25)

### Features

- **default node:** support for custom ids ([0e3ff7f](https://github.com/DanielNetzer/ngx-diagrams/commit/0e3ff7f))

# [2.3.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.2.0...v2.3.0) (2019-06-25)

### Features

- **default node:** support for custom ID ([ddd8b92](https://github.com/DanielNetzer/ngx-diagrams/commit/ddd8b92))

# [2.2.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.1.1...v2.2.0) (2019-06-24)

### Features

- **ports:** support for different types of ports ([9c9af1e](https://github.com/DanielNetzer/ngx-diagrams/commit/9c9af1e))

## [2.1.1](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.1.0...v2.1.1) (2019-06-24)

### Bug Fixes

- **util:** exporting utils ([eed447d](https://github.com/DanielNetzer/ngx-diagrams/commit/eed447d))

# [2.1.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.0.4...v2.1.0) (2019-06-24)

### Bug Fixes

- **storybook:** imports are now from the library and not the dist ([9a487cf](https://github.com/DanielNetzer/ngx-diagrams/commit/9a487cf))

### Features

- **exports:** exporting all relevant apis ([0d24b42](https://github.com/DanielNetzer/ngx-diagrams/commit/0d24b42))

## [2.0.4](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.0.3...v2.0.4) (2019-06-24)

### Bug Fixes

- **main module:** declared all components inside self ([80a55b3](https://github.com/DanielNetzer/ngx-diagrams/commit/80a55b3))

## [2.0.3](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.0.2...v2.0.3) (2019-06-23)

### Bug Fixes

- **public api:** fixed exposed public apis ([9861bda](https://github.com/DanielNetzer/ngx-diagrams/commit/9861bda))

## [2.0.2](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.0.1...v2.0.2) (2019-06-23)

### Bug Fixes

- **ci:** fixed issue with ci ([ff380d6](https://github.com/DanielNetzer/ngx-diagrams/commit/ff380d6))
- **package lock:** updated package lock ([fb0d604](https://github.com/DanielNetzer/ngx-diagrams/commit/fb0d604))

## [2.0.1](https://github.com/DanielNetzer/ngx-diagrams/compare/v2.0.0...v2.0.1) (2019-06-23)

### Bug Fixes

- **public api:** exporting all required modules ([69a80de](https://github.com/DanielNetzer/ngx-diagrams/commit/69a80de))

# [2.0.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v1.5.0...v2.0.0) (2019-06-23)

### Bug Fixes

- **base entity:** removed unused import ([24a366b](https://github.com/DanielNetzer/ngx-diagrams/commit/24a366b))
- **default-factories:** use renderer2 instead direct DOM ([c10970d](https://github.com/DanielNetzer/ngx-diagrams/commit/c10970d))
- **layers overlapping:** layers wont overlap each ([045cffb](https://github.com/DanielNetzer/ngx-diagrams/commit/045cffb))

### Features

- **rxstate:** move all library and engine to rx style [WIP](<[24d2b03](https://github.com/DanielNetzer/ngx-diagrams/commit/24d2b03)>)

### BREAKING CHANGES

- **rxstate:** CHANGES

# [1.5.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v1.4.0...v1.5.0) (2019-05-18)

### Features

- **selection:** links, points selection ([ad6e1dd](https://github.com/DanielNetzer/ngx-diagrams/commit/ad6e1dd))

# [1.4.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v1.3.0...v1.4.0) (2019-05-12)

### Features

- **multiple selection:** selection box, multiple entities selection ([ef6677a](https://github.com/DanielNetzer/ngx-diagrams/commit/ef6677a))

# [1.3.0](https://github.com/DanielNetzer/ngx-diagrams/compare/v1.2.0...v1.3.0) (2019-05-11)

### Bug Fixes

- **actions:** once action stop firing, clear the action from the state ([c77571e](https://github.com/DanielNetzer/ngx-diagrams/commit/c77571e))
- **build:** clean build errors ([adf7bf8](https://github.com/DanielNetzer/ngx-diagrams/commit/adf7bf8))
- **build:** expose props to be used in html ([4a11834](https://github.com/DanielNetzer/ngx-diagrams/commit/4a11834))
- **configs:** configurations and node models ([a545c2c](https://github.com/DanielNetzer/ngx-diagrams/commit/a545c2c))
- **engine:** missed refactoring parent prop ([4de3a63](https://github.com/DanielNetzer/ngx-diagrams/commit/4de3a63))
- **merge:** correct merge conflict glitch ([115eb19](https://github.com/DanielNetzer/ngx-diagrams/commit/115eb19))
- **merge:** merged all branches to master ([64fdb92](https://github.com/DanielNetzer/ngx-diagrams/commit/64fdb92))
- **release:** change semantic release prepare stage ([89131f8](https://github.com/DanielNetzer/ngx-diagrams/commit/89131f8))

### Features

- **abstract factories:** node, links, ports abstract factories added ([ad58aa9](https://github.com/DanielNetzer/ngx-diagrams/commit/ad58aa9))
- **component:** default link component impl ([f870137](https://github.com/DanielNetzer/ngx-diagrams/commit/f870137))
- **data attribs:** entities id, name data attribs, get mouse element ([a847af9](https://github.com/DanielNetzer/ngx-diagrams/commit/a847af9))
- **data attributes:** nodes, ports id and name data attributes ([56ddcca](https://github.com/DanielNetzer/ngx-diagrams/commit/56ddcca))
- **default models:** node, port, link default models added ([3378b34](https://github.com/DanielNetzer/ngx-diagrams/commit/3378b34))
- **default models:** node, port, link default models created ([ecbadf3](https://github.com/DanielNetzer/ngx-diagrams/commit/ecbadf3))
- **engine service:** all core functionality implemented ([123010e](https://github.com/DanielNetzer/ngx-diagrams/commit/123010e))
- **links:** links are rendered, port coords inaccurate ([54b99a0](https://github.com/DanielNetzer/ngx-diagrams/commit/54b99a0))
- **links:** mid work on links, change detection issue ([84b292f](https://github.com/DanielNetzer/ngx-diagrams/commit/84b292f))
- **links:** mid work on ports position ([1c285cc](https://github.com/DanielNetzer/ngx-diagrams/commit/1c285cc))
- **merge:** branch feature/links merged ([52a9fa4](https://github.com/DanielNetzer/ngx-diagrams/commit/52a9fa4))
- **models:** added models for all entities ([04a5f65](https://github.com/DanielNetzer/ngx-diagrams/commit/04a5f65))
- **models:** change props to private and expose with get/set ([cdf10d4](https://github.com/DanielNetzer/ngx-diagrams/commit/cdf10d4))
- **ports:** factory ports implemented ([c148aaf](https://github.com/DanielNetzer/ngx-diagrams/commit/c148aaf))
- **ports:** mid work on ports factory ([b748bc9](https://github.com/DanielNetzer/ngx-diagrams/commit/b748bc9))
- **rendering:** programmatic rendering of links ([58eabe4](https://github.com/DanielNetzer/ngx-diagrams/commit/58eabe4))
- **zoom to fit:** canvas zoom level fit to elements in it ([5fbd783](https://github.com/DanielNetzer/ngx-diagrams/commit/5fbd783))
