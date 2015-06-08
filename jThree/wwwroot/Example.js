j3(function(){
  j3("mesh").animate({rotation:"y(270d)"},10000);
  j3("#modTest").animate({testAttr:"1000"},10000);
});

j3.addModule({
      "test":{
        attributes:{
          "testAttr":{
            converter:"number",
            value:100,
            handler:v=>{
              console.log(v.Value);
            }
          }
        },
        update:(v)=>{console.log("this is update by js");
       }
      }
    });