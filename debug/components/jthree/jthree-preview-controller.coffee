class JThreePreviewController
  @loadedScriptCount = 0;

  @initJThree:(config,codeKey)->
   JThreePreviewController.loadj3Script config,codeKey,(codeKey)->
     JThreePreviewController.checkFinalize config,codeKey
     for v in config.codes[codeKey].js
       JThreePreviewController.loadjsScript config,config.codes[codeKey].root+v,()->
         JThreePreviewController.checkFinalize config,codeKey

  @loadj3Script:(config,codeKey,finished)->
    j3Tag = document.createElement('script');
    code = config.codes[codeKey]
    if codeKey? && code
        j3Tag.setAttribute('x-goml',config.code.root+code.goml);
    else
      for k,v of config.codes
        codeKey = k
        j3Tag.setAttribute('x-goml',v.root+v.goml)
        break
    j3Tag.setAttribute('type','text/javascript');
    j3Tag.setAttribute 'src',"/j3.js"
    j3Tag.setAttribute 'x-lateLoad','true'
    j3Tag.onload = ()->
      finished(codeKey);
    document.body.appendChild j3Tag
    codeKey

  @loadjsScript:(config,url,finished)->
    jsTag = document.createElement 'script'
    jsTag.setAttribute 'type','text/javascript'
    jsTag.setAttribute 'src',url
    jsTag.onload = ()->
      finished()
    document.body.appendChild jsTag

  @checkFinalize:(config,codeKey)->
    JThreePreviewController.loadedScriptCount++
    if !config.codes[codeKey].js || JThreePreviewController.loadedScriptCount == config.codes[codeKey].js.length+1
      window.j3.lateStart();

module.exports = JThreePreviewController;
