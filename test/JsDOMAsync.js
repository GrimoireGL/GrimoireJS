const jsdom = require("jsdom");
module.exports =(str,arr) => {
  return new Promise((resolve,reject)=>{
    jsdom.env(str,arr,(err,window)=>{
      if(err){
        reject(err);
      }else{
        resolve(window);
      }
    });
  });
};
