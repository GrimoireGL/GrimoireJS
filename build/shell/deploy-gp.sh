mkdir ./ci
cd ./ci
git add -A
git commit -m "auto deploy by CircleCI [ci skip]"
git push origin gh-pages:gh-pages
