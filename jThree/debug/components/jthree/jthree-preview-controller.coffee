class JThreePreviewController
  @initJThree:(config,codeKey)->
    j3Tag = document.createElement('script');
    if codeKey?
      j3Tag.setAttribute('x-goml',config.config.root+config.codes[codeKey].goml);
    else
      for k,v of config.codes
        j3Tag.setAttribute('x-goml',v.goml)
        break
    j3Tag.setAttribute('type','text/javascript');
    j3Tag.setAttribute 'src',config.config.j3
    j3Tag.onload = ()->
      debugger;
      window.j3.lateStart();
    document.body.appendChild j3Tag

module.exports = JThreePreviewController;
