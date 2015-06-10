j3(function(){
  j3("mesh").animate({rotation:"y(270d)"},10000);
  j3("object").append("<mesh geo='cube' mat='mat1' scale='0.2' position='0.3,0,0'/>");
  j3("#modTest").animate({testValue:500},2000);
  j3("#modTest").delay(2000).queue(function(){
    j3("#modTest").attr({enabled:false});
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

       },
     "test2":{
        update:function(v){
        },

       }
      }
    );
function clicked()
{
  j3("rdr").attr("fullscreen",true);
}