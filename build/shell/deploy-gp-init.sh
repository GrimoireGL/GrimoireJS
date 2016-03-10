cd ci
if git rev-parse 2> /dev/null; then
 # git有効
 echo "git already initialized"
else
 git init
 git clone https://github.com/jThreeJS/jThree -b gh-pages
fi
