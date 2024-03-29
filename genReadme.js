const fs = require("fs");
const path = require("path");

let head =
  "# CAHBotpacks\n\
packs For Card Against Humanity Bot in Telegram\n\
## English Packs\n\
Packs used on english language\n\
### Packs\n";

/**
 *
 * @param {any} header
 * @param {Array<any>} data
 * @param {Array<string>} order
 * @returns
 */
function tableBuilder(header, data, order, withTotal = "pack") {
  let out = "";
  order.forEach((v) => {
    out += "| " + header[v] + " ";
  });
  out += "|\n";
  order.forEach((v) => {
    out += "|---";
  });
  out += "|\n";
  data.forEach((v) => {
    order.forEach((v2) => {
      out += "| " + v[v2] + " ";
    });
    out += "|\n";
  });
  switch (withTotal) {
    case "pack":
      out += `\n|Total pack amount: ${
        data.length
      }|Total questions amount: ${data.reduce(
        (out, now) => out + now.qcount,
        0
      )}|Total answer amount: ${data.reduce(
        (out, now) => out + now.acount,
        0
      )}|\n|---|---|---|\n`;
      break;
    case "amount":
      out += `\n|Total amount: ${data.length}|\n|---|`;
      break;
    default:
  }

  return out;
}
/**
 * @type {any[]}
 */
let enPack = JSON.parse(
  fs.readFileSync(path.join(__dirname, "en", "packs.json"))
);
enPack = enPack
  .sort((a, b) => {
    if (a.name === b.name) return 0;
    return a.name < b.name ? -1 : 1;
  })
  .sort((a, b) => {
    let order = ["official", "fun-based"];
    return order.indexOf(a.type) - order.indexOf(b.type);
  });
head +=
  "\n" +
  tableBuilder(
    {
      name: "Name of pack",
      type: "Type of pack",
      qcount: "Questions count",
      acount: "Answers count",
    },
    enPack.map((el) => {
      return { ...el, name: `[${el.name}](${el.pathTo})` };
    }),
    ["name", "type", "qcount", "acount"]
  );

let packhead =
  "## {name}\nKey: `{key}`  \nType: {type}  \nQuestion amount: {quest}  \nAnswers amount: {ans}\n### Questions\n{tquest}\n\n### Answers\n{tans}";

let ffn = fs.readdirSync(path.join(__dirname, "en"), {
  withFileTypes: true,
});

ffn.forEach((el) => {
  if (el.isDirectory()) {
    let pack = JSON.parse(
      fs.readFileSync(path.join(__dirname, "en", el.name, "pack.json"))
    );
    /**
     * @type {any[]}
     */
    let packa = JSON.parse(
      fs.readFileSync(path.join(__dirname, "en", el.name, "answers.json"))
    );
    /**
     * @type {any[]}
     */
    let packq = JSON.parse(
      fs.readFileSync(path.join(__dirname, "en", el.name, "questions.json"))
    );
    fs.writeFileSync(
      path.join(__dirname, "en", el.name, "README.md"),
      packhead
        .replace("{name}", pack.name)
        .replace("{key}", pack.key)
        .replace("{type}", pack.type)
        .replace("{quest}", pack.qcount)
        .replace("{ans}", pack.acount)
        .replace(
          "{tquest}",
          tableBuilder(
            { text: "Question", pick: "Amount of answers" },
            packq.map((el) => {
              return { ...el, text: el.text.replace(/\n/g, " ") };
            }),
            ["text", "pick"],
            "amount"
          )
        )
        .replace(
          "{tans}",
          tableBuilder(
            { text: "Answers" },
            packa.map((el) => {
              return { ...el, text: el.text.replace(/[\\n\\r]+/g, " ") };
            }),
            ["text"],
            "amount"
          )
        )
    );
  }
});

fs.writeFileSync(
  path.join(__dirname, "en", "README.md"),
  "### Packs\n" +
    tableBuilder(
      {
        name: "Name of pack",
        type: "Type of pack",
        qcount: "Questions count",
        acount: "Answers count",
      },
      enPack.map((el) => {
        return { ...el, name: `[${el.name}](${path.basename(el.pathTo)})` };
      }),
      ["name", "type", "qcount", "acount"]
    )
);

fs.writeFileSync("README.md", head);
