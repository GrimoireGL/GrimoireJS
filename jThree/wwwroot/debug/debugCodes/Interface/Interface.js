j3(() => {
  const obj0 = j3('#obj0');
  console.log(obj0);
  const scene = j3('scene[name=mainScene]');
  console.log(scene);
  // scene.index();
  const cam = scene.find('#maincam');
  console.log(cam);
  setTimeout(() => {
    obj0.attr('position', '3,6,-5');
    console.log(obj0.attr('position'));
  }, 3000);
  console.log(obj0.attr('position'));
});
