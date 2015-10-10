var j3m = j3.Math;
var RotationBehavior = function () {

}

RotationBehavior.prototype.update = function(v) {
    var q = v.attributes.getValue("rotation");
    var qd=j3m.Quaternion.AngleAxis(new Number(this.ratio),new (j3m.Vector3)(0, 1, 0));
    var q = j3m.Quaternion.Multiply(qd, q);
    v.attributes.setValue("rotation",q);
}

RotationBehavior.prototype.attributes =
{
    ratio: {
        converter: "number",
        value:0
    }
};

j3.defineBehavior("rotation", RotationBehavior);

j3(function () {
  //j3("plight").animate({position:"-1,0.1,1",distance:"0.2",color:"green"},90000);
  //  j3("behavior").animate({ ratio: "1" }, 90000);
  // //j3("pmx").animate({rotation:"y(120d)",scale:"0.1"},10000).animate({rotation:"y(240d)",scale:"0.1"},10000).animate({rotation:"y(360d)",scale:"0.1"},10000);
//  j3("vmd#melt").animate({frame:7200},240000);
  // window.setTimeout(()=>{
  //   j3("vmd#melt").attr({enabled:false});
  //   j3("vmd#sakura").attr({enabled:true});
  //   j3("vmd#sakura").animate({frame:7200},240000);
  // },30000)
  // j3("#morphTest").animate({ value: 1 }, 30000);
  // j3("#light-root").animate({rotation:"y(120d)"},3000).animate({rotation:"y(240d)"},3000).animate({rotation:"y(0d)"},3000)
  // .animate({rotation:"y(120d)"},3000).animate({rotation:"y(240d)"},3000).animate({rotation:"y(0d)"},3000)
  // .animate({rotation:"y(120d)"},3000).animate({rotation:"y(240d)"},3000).animate({rotation:"y(0d)"},3000)
  // .animate({rotation:"y(120d)"},3000).animate({rotation:"y(240d)"},3000).animate({rotation:"y(0d)"},3000);
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
    //j3("#camera-origin").animate({position:new j3m.Vector3(0,0,2)},100000);
  //j3("#camera-origin").animate({rotation:"y(-120d)"},30000);
  j3("pmx").on("loaded",function(e){
    console.warn("on pmx loaded");
    e.stopPropagation();
  });
  j3("scene").on("loaded",function(e)
{
  console.warn("on pmx loaded by scene");
})
});
