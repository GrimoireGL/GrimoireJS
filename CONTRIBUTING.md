# Guideline for contribution[WIP]

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

Currently the version of this package is managed by `semantic-release`.  
To generate changelog and release new version automatically, please follow this rule.

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
