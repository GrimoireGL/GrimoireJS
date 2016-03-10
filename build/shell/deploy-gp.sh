cd ci
git config --global user.email "admin@jthree.io"
git config --global user.name "CircleCI"
git add -A
git commit -m "auto deploy by CircleCI [ci skip]"
git push origin gh-pages:gh-pages
