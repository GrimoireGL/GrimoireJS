# Contribution guide
We really appreciate you to be interesting in this project. 
Third-party contribution is essential for keeping and enhancing jThree great.

Now, our code is not following the rule completely. These code should be refactored,but we need contributors to follow our rules.

## Our goal, our vision, our duty
Destination of this project is "Import 3DCG technologies and knowledge into Web",not "Import Web technologies and knowledge into Web".

We should know most of users of this library are **Web engineer, not 3DCG engineer**.

We don't demands users to know any 3D graphics skills. All of the work requireing any difficult mathmatics or algorithm should be done by us, not users.

We are going to import some of features affected by 3DCG technologies(like plugin feature,object hierarchies...),but we really believe they makes usage of this library easier.

## Build envirnoment
### Required softwares to build
* Node.js (v4.2.2LTS is recommended,v4.xx and v5.xx may work well)
* npm

### Build steps
1 . Clone this repository.

2 . Run this code to install packages in jThree folder (root folder of this repository)
```shell
npm install
```
3 . Run this code to build job and this build envirnoment will build automatically when you change codes.
```shell
npm run watch
```
4 . Go to http://localhhost:8080/debug/ in your own browser to see debug page for jThree.

### Change build systems and packages
When you need to change this build system or add some of packages for your contribution. Please read below.

* All of the packages should works on Mac and Windows.
* Don't change required Node.js version (If you need, please rise an issue)
* Don't change required software. We don't want complex build envirnoment for new contributors.

## Git usage
We don't demand you to do rebase when you push to our repository,provided you comments well to your commits.
We


We recommend to use emoji for your comment of commits.

* :fire: **: fire :** When you deleted some of files
* :sparkles: **: sparkles :** When you refactor some of files
* :arrow_up: **: arrow_up :** When you implement some of new features


