j3(function(){
  j3("camera").animate({position:"0,0.2,-1",rotation:"x(30d)"},2000,"swing",function()
  {
    j3("camera").animate({position:"0,0.5,1"},3000)
    .animate({rotation:"y(30d)"},5000);
  });
});
