j3(function(){
  j3("mesh#tri").animate({rotation:"axis(270d,1,1,1)"},10000);
  j3("camera#maincam").animate({position:"0,0,0"},10000);
  j3("object:first").animate({rotation:"y(270d)"},10000);
  // j3("#tri").append("<mesh geo='cube' mat='mat1' position='0.5,0,0' rotation='y(30d)'//>");
  // j3("#modTest").animate({testValue:500},2000);
  // j3("#modTest").delay(2000).queue(function(){
  //   j3("#modTest").attr({enabled:false});
  // });
});