j3(function(){
  j3("mesh").animate({rotation:"y(270d)"},10000);
  j3("#tri").append("<mesh geo='cube' mat='mat1' position='0.5,0,0' rotation='y(30d)'//>");
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