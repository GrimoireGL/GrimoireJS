class JThreePreviewController
  @loadedScriptCount = 0;

  @initJThree:(config,codeKey)->
   JThreePreviewController.loadj3Script config,codeKey
    .then ()=>
     JThreePreviewController.checkFinalize config,codeKey
     promise = Promise.resolve()
     config.codes[codeKey].js.forEach (v,i)=>
       url = v
       if !/https?\:\/\//.exec(v)
         url = config.codes[codeKey].root + v
       promise = promise
        .then ()=>
          JThreePreviewController.loadjsScript url
        .then ()=>
          JThreePreviewController.checkFinalize config,codeKey
      promise

  @loadj3Script:(config,codeKey)->
    new Promise (resolve,reject)=>
      j3Tag = document.createElement('script');
      code = config.codes[codeKey]
      if codeKey? && code # Cookieに選択対象が残っていた場合
          j3Tag.setAttribute('x-goml',code.root+code.goml);
      else # Cookieに選択対象が残っていなかった場合、最初を選択とする
        for k,v of config.codes
          codeKey = k
          j3Tag.setAttribute('x-goml',v.root+v.goml)
          break
      j3Tag.setAttribute('type','text/javascript');
      j3Tag.setAttribute 'src',"/j3.js"
      j3Tag.setAttribute 'x-lateLoad','true'
      j3Tag.onload = ()->
        resolve()
      document.body.appendChild j3Tag

  @loadjsScript:(url)->
    new Promise (resolve,reject)=>
      jsTag = document.createElement 'script'
      jsTag.setAttribute 'type','text/javascript'
      jsTag.setAttribute 'src',url
      jsTag.onload = ()->
        resolve()
      document.body.appendChild jsTag

  @checkFinalize:(config,codeKey)->
    JThreePreviewController.loadedScriptCount++
    if !config.codes[codeKey].js || JThreePreviewController.loadedScriptCount == config.codes[codeKey].js.length+1
      window.j3.lateStart();

module.exports = JThreePreviewController;
