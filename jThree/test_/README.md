# New Test Format

Test with typescript without any built files.

## Usage

To execute all tests under here:

```
mocha --compilers ts:espower-typescript/guess jThree/test_/**/*Test.ts
```

This command is expected to execute directly under the root of project.

## Useful Command

`tsmocha` command in same directory of this file will make you comfortable.

`chmod +x tsmocha` to make it executable, and copy it to directory under $PATH.
