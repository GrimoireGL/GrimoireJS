npm install typescript@beta
case $CIRCLE_NODE_INDEX in
  0)
    npm run compiler-version
    npm run build -- --branch=$CIRCLE_BRANCH
    npm run lint -- --branch=$CIRCLE_BRANCH;;
  1)
    npm run doc -- --branch=$CIRCLE_BRANCH;;
  2)
    npm run cover -- --branch=$CIRCLE_BRANCH;;
esac
