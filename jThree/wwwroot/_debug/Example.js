j3(function(){
  //j3("pmx").animate({rotation:"y(120d)",scale:"0.1"},10000).animate({rotation:"y(240d)",scale:"0.1"},10000).animate({rotation:"y(360d)",scale:"0.1"},10000);
  j3("#wrink").animate({value:0},30000);
  j3("vmd").animate({frame:7200},240000);
  j3("#morphTest").animate({ value: 1 }, 30000);
  j3("#light-root").animate({rotation:"y(120d)"},3000).animate({rotation:"y(240d)"},3000).animate({rotation:"y(0d)"},3000)
  .animate({rotation:"y(120d)"},3000).animate({rotation:"y(240d)"},3000).animate({rotation:"y(0d)"},3000)
  .animate({rotation:"y(120d)"},3000).animate({rotation:"y(240d)"},3000).animate({rotation:"y(0d)"},3000)
  .animate({rotation:"y(120d)"},3000).animate({rotation:"y(240d)"},3000).animate({rotation:"y(0d)"},3000);
  // j3("#floor").animate({rotation:"y(120d)"},10000);
  // j3("viewport#main").attr({width:256});
  // j3("mesh#tri").animate({rotation:"axis(270d,1,1,1)"},10000);
  // j3("camera#maincam").animate({position:"0,0,0"},10000);
  // j3("object:first").animate({rotation:"y(270d)"},10000);
  // j3("#tri").append("<mesh geo='cube' mat='mat1' position='0.5,0,0' rotation='y(30d)'//>");
  // j3("#modTest").animate({testValue:500},2000);
  // j3("#modTest").delay(2000).queue(function(){
  //   j3("#modTest").attr({enabled:false});
    // });
    j3("#camera-origin").animate({rotation:"y(-120d)"},30000);
});