import {glob,templateAsync,writeFileAsync,readFileAsync} from "grimoirejs-build-env-base";
import path from 'path';
const txt2js = async (globPath,targetFolder,jsFolder,noDts,isCjs)=>{
  const globbedFiles = await glob(globPath);
  const dts = await readFileAsync("./scripts/templates/txt-d.ts.template");
  try{
  for(let fileName of globbedFiles){
    const genCode = await templateAsync("./scripts/templates/"+(isCjs?"txt-js-es5.template":"txt-js.template"),{
      content:JSON.stringify((await readFileAsync(fileName)).toString('utf8'))
    });
    const fromSrc = path.relative("./"+targetFolder,fileName);
    await writeFileAsync("./"+jsFolder+"/" + fromSrc + ".js",genCode);
    if(!noDts)await writeFileAsync("./"+targetFolder+"/" + fromSrc + ".d.ts",dts);
  }
}catch(e){
  console.log(e);
}
}

export default txt2js;
