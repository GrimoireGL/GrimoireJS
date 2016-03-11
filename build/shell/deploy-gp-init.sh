mkdir ci
cd ci
git init
git config --global user.email "admin@jthree.io"
git config --global user.name "CircleCI"
git checkout -b gh-pages
git clone https://github.com/jThreeJS/jThree -b gh-pages
git remote add origin https://github.com/jThreeJS/jThree
git pull origin gh-pages
