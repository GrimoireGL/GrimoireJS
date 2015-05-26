j3(function(){
  j3("#tri").append("<mesh geo='grid' mat='mat1' rotation='y(30d)'/>");
  j3("object").animate({rotation:"y(45d)"},5000,"swing",function()
  {
    j3("#tri").animate({rotation:"y(90d)"},3000);
  });
});
