npm run semantic-release
if [ $? = "0" ]; then
  echo PRESET_UPDATE
  curl "https://preset-updater.herokuapp.com/?repo=preset-basic&repoURL=https://github.com/GrimoireGL/grimoirejs-preset-basic.git&buildNumber=$CIRCLE_BUILD_NUM&currentPkg=grimoirejs"
fi
exit 0
