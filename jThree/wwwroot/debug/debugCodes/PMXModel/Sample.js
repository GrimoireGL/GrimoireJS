j3(function(){
  var frame = 0;
  setInterval(()=>{
    j3("vmd").attr("frame",frame);
    frame++;
  },1000/30);
});
