# Guideline for contribution

This contribution guide is not only for core package, also for plugins of grimoire.js maintained by our organization.
It is not necessary, but we encourage the other plugins made by third party should use same contribution guide line if possible.

## Got a questions or problem?

Using slack is the best way to ask main contributors.  
Stack overflow is another choice to ask.

## Found bugs?

Please report them with issues. You can write it in English or Japanese.  
If reporter write an issue with Japanese and it is fatal problem of this library,
main contributors would translate them for convenience.

## Contributing to translation

We prepare to translate all of our documents written in Japanese to English.
Currently official site and most of documents are written in Japanese, but we will move the main language as English.
This is including a lot of stuff to do, we need contributors. Even if you correct our English syntax, we are welcome.

## Contributing to code

Reducing works we need to do manually is very important.  
Please read this guideline for keeping clean repository and keeping developing environment efficiently.

### Build library

You need to use npm to setup project build environment.(You can use yarn also)

```sh
$ git clone <Path to this repository> .
$ npm install
$ npm start
```

`npm start` trigger watch task to rebuild when you changed the codes in `src` folder.
This command will change `register/index.js` only.

If you want to generate `grimoire.js` or `grimoirejs-<library-name>.js` to link these script with `<script>` tag, you can use `env.browser` configuration with the following command.

```sh
$ npm start -- --env.browser
```

If you need to build with all build configurations, you can use `npm run build -- --env.prod` to generate all codes.

`npm test` will execute unit testing included in `test` folder.

If you need to use with the other plugins, `npm link` would be useful to use generated new codes.

### E2E testing

Several plugins of Grimoire.js are using E2E testing for maintaining same rendering result.
If e2e testing are enabled on a repository, the repository should have e2e folder.
E2E folder has several folder containing test case to render.

CI would capture screen shot to compare last rendering result. If the compare result was different from last build, CI will send us notification on `#e2e` channel in our slack(See official site for more detail).

When the build was triggered with PR, CI would automatically make a comment containing rendering result.

### Coding rule

Most of the coding rules are checked with `TSLint`. You can run `npm run lint` to check whether your code is fitting to coding rule.  
Lint task would run on CI also.

But, there are some coding rule not listed in tslint configurations. These rules are listed below.

#### Rules of methods

```ts
   public publicMethod(): void;
   private _privateMethod(): void;
   protected __protectedMethod(): void;
```

Public method name must begin with lower case and should following names are `camelCase`.
Private method name must begin with `_`, and following characters are same as public method name.
Protected method name must begin with two `__`, and following characters are same as public method name.

### Commit message guideline

The version of this package uses `semantic-release`.  
To generate changelog and release new version automatically, please follow this rule.

### When the commit is only changing comments(Anything no effect for logics)

```
chore: COMMIT MESSAGE HERE
```

#### When the commit is bug fix,refactor or chore (Anything no effect for API).

```
fix: COMMIT MESSAGE HERE
```

#### When the commit contains new feature not containing breaking change.

```
feat: COMMIT MESSAGE HERE
```

#### When the commit contains breaking change

But, keeping in mind that we should not break public API.

```
perf: COMMIT MESSAGE HERE
```
