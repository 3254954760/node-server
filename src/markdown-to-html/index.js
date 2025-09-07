const fs = require("fs");
const marked = require("marked");
const ejs = require("ejs");

const MarkdownToHtml = (req, res) => {
    const readme = fs.readFileSync(`${__dirname}/readme.md`);
    const content = marked.parse(readme.toString());
    ejs.renderFile(
        `${__dirname}/template.ejs`,
        {
            content: content,
            title: "markdown to html",
        },
        (err, data) => {
            if (err) {
                throw err;
            }
            // fs.writeFileSync("index.html", data);
            res.send(data);
        },
    );
};

module.exports = {
    MarkdownToHtml,
};
