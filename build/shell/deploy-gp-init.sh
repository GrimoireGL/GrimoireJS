if git rev-parse 2> /dev/null; then
 # git有効
else
 git init
 git clone https://github.com/jThreeJS/jThree -b gh-pages
fi
