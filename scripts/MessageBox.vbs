Set objArgs = WScript.Arguments
messageText = objArgs(0)
messageTitle = objArgs(1)
messageText = Replace(messageText,"\n",Chr(13) & Chr(10))
MsgBox messageText,0,messageTitle
