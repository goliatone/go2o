# Go2o

[![Build Status](https://secure.travis-ci.org/goliatone/go2o.png)](http://travis-ci.org/goliatone/go2o)

Simple Object to Object transformation library

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/emiliano/go2o/master/dist/go2o.min.js
[max]: https://raw.github.com/emiliano/go2o/master/dist/go2o.js

## Development
`npm install && bower install`

If you need to `sudo` the `npm` command, you can try to fix that annoyance:

```terminal
sudo chown $(whoami) ~/.npm
sudo chown $(whoami) /usr/local/share/npm/bin
sudo chown -R $(whoami) /usr/local/lib/node_modules
```


If you bump versions, remember to update:
- package.json
- bower.json
- component.json
- etc.


## Bower
>Bower is a package manager for the web. It offers a generic, unopinionated solution to the problem of front-end package management, while exposing the package dependency model via an API that can be consumed by a more opinionated build stack. There are no system wide dependencies, no dependencies are shared between different apps, and the dependency tree is flat.

To register go2o in the [bower](http://bower.io/) [registry](http://sindresorhus.com/bower-components/):
`bower register go2o git://github.com/goliatone/go2o.git`

Then, make sure to tag your module:

`git tag -a v0.1.0 -m "Initial release."`

And push it:

`git push --tags`


## Travis
In order to enable Travis for this specific project, you need to do so on your Travi's [profile](https://travis-ci.org/profile). Look for the entry `goliatone/go2o`, activate, and sync.


## Documentation
_(Coming soon)_
https://www.tbray.org/ongoing/When/201x/2014/05/05/Fat-JSON

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_

## TODO:
- ~~Build in default pre/post processes:~~
    - ~~pre: flattenPaths~~
    - ~~post mergeOrphans, unflattenPaths~~
- ~~Implement conflict resolution. If we collapse one object into its parent and they have conflicting properties, who do we handle that?~~ NOTE: Per case is not defined.
- Each transformer should have it's own scope.
- Merge validation. Have a handler for config key `transforms` and one for `validations`.
- Use expression filters: https://github.com/joewalnes/filtrex

### Template Functions
Consider using templated Function accessors:

```javascript
var get = new Function("obj", "return obj.payload.committee.amendments[1];");
var out = get(go.source);
console.log(out) //{_id:"5323423523452352", name:"Pet Control"...}
```

TODO:
Integrate libraries:
http://highlandjs.org/