cd ci
git add -A
git commit -m "auto deploy by CircleCI [ci skip]"
git remote add origin https://github.com/jThreeJS/jThree
git push origin gh-pages
