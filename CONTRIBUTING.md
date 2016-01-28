# Contribution guide
We really appreciate your interest in this project.
Third-party contribution is essential for enhancing jThree.

Now,we are following our coding rule.
Contributors need to follow them.
However some parts of code need refactoring.

## Our goal, our vision, our duty
Our destination of this project is "Import 3DCG technologies and knowledge into Web",not "Import Web technologies and knowledge into Web".

We should keep in mind that most users of this library are **Web engineers, not 3DCG engineer**.

We do not request users to know any 3D graphics skills. All of the work requiring difficult knowledge of mathematics or algorithms should be done by us.

We are going to use some of the features affected by 3DCG technologies(like plugin features,object hierarchies...),but we really believe they will make usage of this library easier.

## Development environment
### Required software to build
* Node.js (v4.2.2LTS is recommended,v4.xx and v5.xx may work as well)
* npm

### Build steps
1 . Clone this repository.

2 . Run the following command to install packages in jThree folder (a root folder of this repository)
```shell
$ npm install
```
3 . Run the following command to activate the development environment and that will be rebuilt automatically when you change codes.
```shell
$ npm run watch
```
4 . Go to http://localhost:8080/debug/ in your browser to see the page to debug for jThree.

### Change the build systems and the packages.
When you need to change the build system or add some packages for your contribution. Please read the followings.

* All of the packages must work on both Mac and Windows.
* Do not change required the required version of Node.js (If you need　to do that, please raise an issue.)
* Do not change the required software. We do not want to make development environment complex for new contributors.


## Coding Style

Most of the code in this project is written with Typescript.
For writing Typescript, we use these coding style below.
There is too much code in this project that is not written by following the coding style, but It will be refactored in the future.

### Names

* Use "PascalCase" for class/enum names and initial character should be capital character.
* Use "IPascalCase" for interface names and I and secound character should be capital character.
```typescript
class FooClassName
{

}

interface IFooInterfaceName
{
}
```

* Use "camelCase" for any public properties including getter/setter,variables and methods in any types.
* Use "_camelCase" for any private properties including getter/setter,variables and methods in any types.
* Use "__camelCase" for any protected properties including getter/setter,variables and methods in any types.
```typescript

public fooPublicMethod():void
{
}

private _fooPrivateMethod():void
{
}

private __fooProtectedMethod():void
{
}

```

## How to use git
We do not request you to do rebase when you push to our repository,provided your comments well to your commits.


We recommend that you use emoji for your comment of commits.

* :fire: **: fire :** When you deleted some of files
* :sparkles: **: sparkles :** When you refactor some of files
* :arrow_up: **: arrow_up :** When you implement some of new features
