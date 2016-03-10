cd ci
git init
git checkout -b gh-pages
git clone https://github.com/jThreeJS/jThree -b gh-pages
git remote add origin https://github.com/jThreeJS/jThree
git pull origin gh-pages
