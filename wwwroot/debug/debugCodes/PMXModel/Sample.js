j3(function(){
  var body = document.body;
  var input = document.createElement("input");
  input.setAttribute("type","number");
  input.value = 0;
  input.addEventListener("change",function(){
    j3("vmd").attr("frame",input.value + "");
  });
  body.appendChild(input);
});
