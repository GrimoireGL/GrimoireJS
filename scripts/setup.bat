REM "Check node is really existed."
WHERE node
IF %ERRORLEVEL% EQ 1
(
  ECHO "###　　　Node.js未検出    ###"
  ECHO "###Node.js was not found.###"
  exit /b 1
)
ELSE
(

)
