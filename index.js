const fs = require("fs");
const http = require("http");
const url = require("url");

const jsonData = fs.readFileSync(`${__dirname}/data/data.json`, `utf-8`);
const laptopData = JSON.parse(jsonData);

const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url, true).pathname;
    const queryId = url.parse(req.url, true).query.id;


    //PRODUCT OVERVIEW PAGE
    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, {
            "Content-type": "text/html"
        });

        fs.readFile(`${__dirname}/templates/template-overview.html`, `utf-8`, (err, data) => {
            let dataOverview = data;
            fs.readFile(`${__dirname}/templates/template-card.html`, `utf-8`, (err, data) => {
                const cards = laptopData.map(laptop => replaceHTMLTemplate(data, laptop)).join('');
                dataOverview = dataOverview.replace('{%CARDS%}', cards);
                res.end(dataOverview);
            });
        });

        //PRODUCT PAGE
    } else if (pathName === '/laptop' && queryId < laptopData.length) {
        res.writeHead(200, {
            "Content-type": "text/html"
        });
        fs.readFile(`${__dirname}/templates/template-laptop.html`, `utf-8`, (err, data) => {
            const laptop = laptopData[queryId];
            res.end(replaceHTMLTemplate(data, laptop));
        });

        //REQUESTS TO HANDLES IMAGES
    } else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img/${pathName}`, (err, data) => {
            res.writeHead(200, {
                "Content-type": 'image/jpg'
            });
            res.end(data);
        });

        //ERROR PAGE
    } else {
        res.writeHead(404, {
            "Content-type": "text/html"
        });
        res.end("The requested URL cannot be found.");
    }
});

server.listen(1337, "127.0.0.1", () => {
    console.log("Server Check.");
});

// TEMPLATE REPLACED WITH VALUES 
function replaceHTMLTemplate(originalHtml, laptop) {
    let outputData = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    outputData = outputData.replace(/{%ID%}/g, laptop.id);
    outputData = outputData.replace(/{%PRICE%}/g, laptop.price);
    outputData = outputData.replace(/{%CPU%}/g, laptop.cpu);
    outputData = outputData.replace(/{%IMAGE%}/g, laptop.image);
    outputData = outputData.replace(/{%SCREEN%}/g, laptop.screen);
    outputData = outputData.replace(/{%STORAGE%}/g, laptop.storage);
    outputData = outputData.replace(/{%RAM%}/g, laptop.ram);
    outputData = outputData.replace(/{%DESCRIPTION%}/g, laptop.description);
    return outputData;
}