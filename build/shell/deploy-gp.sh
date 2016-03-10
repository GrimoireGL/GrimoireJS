git add -A --separate-git-dir=./ci
git commit -m "auto deploy by CircleCI [ci skip]" --separate-git-dir=./ci
git push origin gh-pages:gh-pages --separate-git-dir=./ci
