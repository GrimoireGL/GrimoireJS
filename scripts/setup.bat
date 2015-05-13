@ECHO OFF

echo "       /$$$$$$$$ /$$                                    "
echo "      |__  $$__/| $$                                    "
echo "      /$$| $$   | $$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$ "
echo "     |__/| $$   | $$__  $$ /$$__  $$ /$$__  $$ /$$__  $$"
echo "      /$$| $$   | $$  \ $$| $$  \__/| $$$$$$$$| $$$$$$$$"
echo "     | $$| $$   | $$  | $$| $$      | $$_____/| $$_____/"
echo "     | $$| $$   | $$  | $$| $$      |  $$$$$$$|  $$$$$$$"
echo "     | $$|__/   |__/  |__/|__/       \_______/ \_______/"
echo "/$$  | $$                                                "
echo "  $$$$$$/                                                "
echo "\______/                                                 "
REM "Has Administrator right or not"
@net session
IF %ERRORLEVEL% NEQ 0 (
  cscript MessageBox.vbs "Administrator right are required.\n管理者権限が必要です。" "Install Error"
  ECHO Administrator right is required
  exit /b 1
) ELSE (
  ECHO ###Administrator right OK ###
)

REM "Check node is really existed."
@WHERE node >nul 2>&1
IF %ERRORLEVEL%==1 (
cscript MessageBox.vbs "Node.js is not installed.\nNode.jsがインストールされていません。\n\nDownload page will be opened.\nダウンロードページを開きます。" "Install Error!!"
  ECHO ###Node.js was not found.###
  START "Node.js Download" "https://nodejs.org/download/"
  exit /b 1
) ELSE (
  ECHO ###      Node.jsOK       ###
)

REM "Check npm is really existed."
@WHERE npm >nul 2>&1
IF %ERRORLEVEL%==1 (
cscript MessageBox.vbs "Npm is not installed.\nNpmがインストールされていません。\n\nDownload page will be opened.\nダウンロードページを開きます。" "Install Error!!"
  ECHO ###Npm was not found.###
  START "Node.js Download" "https://nodejs.org/download/"
  exit /b 1
) ELSE (
  ECHO ###       Npm OK        ###
)

CD ..

ECHO ###Npm Version Update###
call npm install -g npm

ECHO ###Bower Update/Install###
call npm install bower -global

ECHO ###TSD Update/Install###
call npm install tsd -global

ECHO ###GULP Update/Install###
call npm install gulp -global

ECHO ###All Grobal Install were done.###
ECHO ###Npm Package Restore###
call npm install
ECHO Done.
ECHO ###Bower Package Restore###
call bower install
ECHO Done.
ECHO ###Tsd Package Restore###
call tsd reinstall
ECHO Done.

CD scripts
