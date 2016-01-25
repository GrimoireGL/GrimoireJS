j3(function() {
  setInterval(tick,10);
});
var time = 0;
var colors = ["yellow","white","red","blue","green"];
var tick = function() {
  j3(".lightContainer").attr("rotation","y("+time+"d)");
  j3("#plight-main").attr("color",colors[Math.floor(time/100)%colors.length]);
  time ++;  
}
