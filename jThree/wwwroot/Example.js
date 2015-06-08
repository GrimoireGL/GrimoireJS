j3(function(){
  j3("mesh").animate({rotation:"y(270d)"},10000);
  j3("#modTest").animate({testAttr:"1000"},10000).queue(function(){
    j3("#modTest").attr("enabled",false);
  });
});

j3.addModule({
      "test":{
        attributes:{
          "testAttr":{
            converter:"number",
            value:100,
            handler:function(v){
              console.log(v.Value);
            }
          }
        },
        update:function(v){console.log("this is update by js");},
        awake:function(v){console.warn("this is awake");},
        onEnabled:function(v){console.warn("onenabled")},
        start:function(v){console.warn("start")},
        onDisabled:function(v){console.warn("onDisabled")} 
       }
      }
    );