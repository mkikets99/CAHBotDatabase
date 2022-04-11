const fs = require('fs');
const path = require('path');

let head = "# CAHBotDatabase\n\
Database For Card Against Humanity Bot in Telegram\n\
## English Packs\n\
Packs used on english language\n\
### Packs\n";

function tableBuilder(header,data,order) {
    let out = "";
    order.forEach((v)=>{
        out += "| "+header[v]+" ";
    })
    out+="|\n";
    order.forEach((v)=>{
        out += "|---";
    })
    out+="|\n";
    data.forEach((v)=>{
        order.forEach((v2)=>{
            out += "| "+v[v2]+" ";
        })
        out += "|\n";
    })
    return out
}
let enPack = JSON.parse(fs.readFileSync(path.join(__dirname,"database","en","packs.json")))
enPack = enPack.sort((a,b)=>{
    if(a.name===b.name) return 0;
    return a.name<b.name ? -1 : 1;
}).sort((a,b)=>{
    let order = ["official","fun-based"];
    return order.indexOf(a.type) - order.indexOf(b.type);
})
head += "\n"+tableBuilder({
    "name": "Name of pack",
    "type": "Type of pack",
    "qcount": "Questions count",
    "acount": "Answers count",
},enPack,[
    "name","type","qcount","acount"
]);

fs.writeFileSync(path.join(__dirname,"database","en","README.md"),"### Packs\n"+tableBuilder({
    "name": "Name of pack",
    "type": "Type of pack",
    "qcount": "Questions count",
    "acount": "Answers count",
},enPack,[
    "name","type","qcount","acount"
]));

fs.writeFileSync("README.md",head);

