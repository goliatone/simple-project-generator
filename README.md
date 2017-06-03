
```
$ lbr new app
```

```
$ lbr new goliatone/app
```

```
$ lbr new goliatone/app ./target/
```

```
$ lbr new goliatone/app ./target/ --context ./path/context.json
```

```
$ ./bin/cli add goliatone/core.io-starter-template core     
```

-> search template:
    * local cache
        * download from github
    ø option: skip-cache
-> copy template to /temp:
    * temp-dir-cp
-> collect config
    * look for prompt file in template
    ø option: skipt if -c config.json is set
-> clean output dir
    ø option: skip-clean
-> collect-files
-> expand-files
-> file-processor:
    * solve template
-> copy into target

<!--
https://github.com/ironSource/node-config-prompt
https://www.npmjs.com/package/configstore
https://github.com/jstransformers/jstransformer
https://github.com/egoist/majo  
https://github.com/egoist/kopy
-->

TODO:
 - Ensure we pass context across all middleware
 - Ensure we return context across all middleware
 - Handle errors in middleware in a sane way:
    - either return context with an error or return error with ref to context.
- Copy/write file should preserve file permissions (for executables/scripts)

Middleware (tasks):
* Should take in a context object.
* Should return a promise
    * Should resolve the same context object, but augmented/transformed.
    * Should reject with the same context but adding an error in the form:
        context.errors[middleware.id] = [err1, err2... errN];
