mkdir ci
cd ci
git init
git config --global user.email "admin@jthree.io"
git config --global user.name "CircleCI"
git checkout -b gh-pages
git clone https://github.com/GrimoireGL/GrimoireJS -b gh-pages
git remote add origin https://github.com/GrimoireGL/GrimoireJS
git pull origin gh-pages
