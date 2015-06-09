j3(function(){
  j3("mesh").animate({rotation:"y(270d)"},10000);
  j3("#modTest").animate({testValue:500},2000);
  j3("#modTest").delay(2000).queue(function(){
    j3("#modTest").attr("enabled",false);
  });
});

j3.addComponent({
      "test":{
        attributes:{
          "testValue":{
            converter:"number",
            value:"100",
            handler:function(v){}
          }
      },
        update:function(v){console.log(this.testValue);},
        awake:function(v){console.warn("this is awake");},
        onEnabled:function(v){console.warn("onenabled")},
        start:function(v){console.warn("start")},
        onDisabled:function(v){console.warn("onDisabled")} 
       }
      }
    );