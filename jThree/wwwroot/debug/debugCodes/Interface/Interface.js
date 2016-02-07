j3(function(){
  const obj0 = j3('#obj0');
  const obj4 = j3('#obj4');
  console.log(obj0);
  const scene = j3('scene[name=mainScene]');
  console.log(scene);
  // scene.index();
  const cam = scene.find('#maincam');
  console.log(cam);
  setTimeout(function() {
    obj0.attr('position', '3,6,-5');
    console.log('obj0', obj0.attr('position'));
  }, 3000);
  console.log('obj0', obj0.attr('position'));
  setTimeout(function(){
    obj4.attrObj('position', new j3.Math.Vector3(-3, 6, -5));
    console.log('obj4', obj4.attrObj('position'));
  }, 3000);
  console.log('obj4', obj4.attrObj('position'));
  console.log('getObj', j3('mesh').getObj());
  console.log('getObj', j3('mesh').getObj(2));
  console.log('getObj', j3('solid').getObj(0));
});
