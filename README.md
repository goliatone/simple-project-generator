# Simple Project Generator

Simple command line utility to create projects from project templates.

This project is inspired by the awesome [Cookiecutter][cookiecutter].

### Installing Templates

```
$ spg add goliatone/core.io-starter-template core
$ spg add goliatone/core.io-module-template module --skip-cache
```

### Create a new project

```
$ spg new core ./myProject/ --context ./path/context.json
```


```
$ spg new app
```

```
$ spg new goliatone/app
```

```
$ spg new goliatone/app ./target/
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
- [x] Conditional files:
    - [x] When an option is selected some files get added
- [x] Create a random port number for REPL
- [x] When we copy a template project, we might need to npm install dependencies
      form the prompt file.
- [ ] Add update command
- [ ] Add list-remote command
- [ ] Ensure we pass context across all middleware
- [ ] Ensure we return context across all middleware
- [ ] Handle errors in middleware in a sane way:
    - either return context with an error or return error with ref to context.
- [ ] Copy/write file should preserve file permissions (for executables/scripts)
- [ ] Normalize logging, add -verbose flag
- [ ] Take a configuration object to skip prompt
- [ ] Add option to symlink template on `add` command
- [ ] Dry run should:
    - not clean directory (delete files/folders)
    - create new directories

Middleware (tasks):
* Should take in a context object.
* Should return a promise
    * Should resolve the same context object, but augmented/transformed.
    * Should reject with the same context but adding an error in the form:
        context.errors[middleware.id] = [err1, err2... errN];

## Templates

If you want to add template filters from a task you should set it in the context:

```js
KeyPath.set(context, 'config.template.options.filters', { formatDate });
```

Then it would be used as:

```ejs
%{date.raw | formatDate }%
```

### Conditional files
In some instances we might include some files, directories, or `npm` dependencies based on some user input. For those cases we can use **optional files**.


### Engine

It uses the [jstransformer][jstransformer] [jstransformer-swig][jstransformer-swig] for [swig][swig]


[swig]:https://node-swig.github.io/swig-templates
[jstransformer]:https://github.com/jstransformers/jstransformer
[jstransformer-swig]:https://github.com/jstransformers/jstransformer-swig
[cookiecutter]:https://github.com/audreyr/cookiecutter
