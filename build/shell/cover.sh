npm run cover -- --report-dir=ci/cover/$CIRCLE_BRANCH
rc=$?;
if [[ $rc != 0 ]]; then
  npm run rebuild
  npm run cover -- --report-dir=ci/cover/$CIRCLE_BRANCH
  exit $?
else
  exit rc
fi
