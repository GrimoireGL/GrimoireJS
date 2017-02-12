# Guideline for contribution[WIP]

Reducing works we need to do manually is very important.  
Please read this guideline for keeping clean repository and keeping developing environment efficiently.

## Got a questions or problem?

Using slack is the best way to ask main contributors.  
Stack overflow is another choice to ask.

## Found bugs?

Please report them with issues. You can write it in English or Japanese.  
If reporter write an issue with Japanese and it is fatal problem of this library,
main contributors would translate them for convenience.

## Contributing to code

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
