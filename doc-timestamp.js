const fs = require("fs");

fs.readFile("./package.json","utf8",(err,data)=>{
    if(err){
        console.error(err);
        process.exit(1);
    }else{
        const version = JSON.parse(data).version;
        fs.readFile("./README.md","utf8",(err,original)=>{
            if(err){
                console.error(err);
                process.exit(1);
            }else{
                const replaced = original.replace("<!--DOCUMENT STAMP-->",`* Update date: \`${new Date()}\`\n* Build version: \`${version}\``);
                fs.writeFile("./README.md",replaced,(err,data)=>{
                    if(err){
                        console.error(err);
                        process.exit(1);                        
                    }
                });
            }
        });
    }
});