git add -A ./ci
git commit -m "auto deploy by CircleCI [ci skip]" ./ci
git push origin gh-pages:gh-pages ./ci
