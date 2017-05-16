
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
