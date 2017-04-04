npm run semantic-release
if [ $? = "0" ]; then
  echo PRESET_UPDATE
  curl "https://preset-updater.herokuapp.com/?repo=preset-basic&repoURL=https://github.com/GrimoireGL/grimoirejs-preset-basic.git&buildNumber=$CIRCLE_BUILD_NUM&currentPkg=grimoirejs"
  echo DOCUMENT_GENERATING
  npm run doc
  echo DOCUMENT_UPLOADING
  aws s3 cp ./docs/ s3://grimoire-api-document/$CIRCLE_PROJECT_REPONAME --recursive --acl public-read
fi
exit 0
