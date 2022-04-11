const fs = require('fs');
const path = require('path');

let head = "# CAHBotDatabase  \n\
Database For Card Against Humanity Bot in Telegram  \n\
## English Packs  \n\
Packs used on english language  \n\
### Packs  \n";

function tableBuilder(header,data,order) {
    let out = "---------\n";
    order.forEach((v)=>{
        out += "| "+header[v]+" ";
    })
    out += "|\n---------\n";
    data.forEach((v)=>{
        order.forEach((v2)=>{
            out += "| "+v[v2]+" ";
        })
        out += "|\n---------\n";
    })
}
let enPack = JSON.parse(fs.readFileSync(path.join(__dirname,"database","en","packs.json")))

head += "\n"+tableBuilder({
    "name": "Name of pack",
    "type": "Type of pack",
    "qcount": "Questions count",
    "acount": "Answers count",
},enPack,[
    "name","type","qcount","acount"
]);

fs.writeFileSync("README.md",head);

