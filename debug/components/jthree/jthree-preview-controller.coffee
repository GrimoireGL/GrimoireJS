class JThreePreviewController
  @initJThree:(config,codeKey)->
   JThreePreviewController.loadj3Script config,codeKey
    .then ()=>
     root = config.codes[codeKey].root
     promise = Promise.resolve()
     if config.codes[codeKey].html?
       promise = promise.then ()=>
         JThreePreviewController.loadDebuggerControl root + config.codes[codeKey].html
      if config.codes[codeKey].css?
        JThreePreviewController.loadStyle root + config.codes[codeKey].css
     config.codes[codeKey].js.forEach (v,i)=>
       url = v
       if !/https?\:\/\//.exec(v)
         url = root + v
       promise = promise
        .then ()=>
          JThreePreviewController.loadjsScript url
     promise = promise.then ()=>
       JThreePreviewController.loadCompleted config,codeKey
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

  @loadDebuggerControl:(url)->
    new Promise (resolve,reject)=>
      xhr = new XMLHttpRequest()
      xhr.open "GET",url,true
      xhr.responseType = "text"
      xhr.onload = () =>
        document.querySelector ".debugControl"
          .innerHTML = xhr.responseText
        resolve()
      xhr.onerror = (err) =>
        reject();
      xhr.send(null);

  @loadStyle:(url)->
    styleTag = document.createElement 'link'
    styleTag.setAttribute 'rel','stylesheet'
    styleTag.setAttribute 'type','text/css'
    styleTag.setAttribute 'href',url
    document.head.appendChild styleTag

  @loadjsScript:(url)->
    new Promise (resolve,reject)=>
      jsTag = document.createElement 'script'
      jsTag.setAttribute 'type','text/javascript'
      jsTag.setAttribute 'src',url
      jsTag.onload = ()->
        resolve()
      document.body.appendChild jsTag

  @loadCompleted:(config,codeKey)->
      window.j3.lateStart();

module.exports = JThreePreviewController;
