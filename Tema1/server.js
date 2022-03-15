const http = require("http");
const axios = require('axios');
const buffer = require('buffer');
const host = 'localhost';
const port = 8000;

const fs = require('fs');
const fsp = require('fs').promises;
let indexFile;

function readApiKey(){
    return fs.readFileSync('apikey.txt', 'utf8');
}

function readFile(){
    return fs.readFileSync('image.png')
}

function readMetricsTemplate(){
    return fs.readFileSync(__dirname + "/metrics.html", 'utf8')
}

function readMetrics(){
    return fs.readFileSync(__dirname + "/metrics.txt", 'utf8')
}

function constructMetrics(metrics)
{
    var finalMetrics = '' 
    metrics.split(/\r?\n/).forEach(line =>  {
        if(line.length >= 2){
            finalMetrics = finalMetrics + '<li>' + line + '</li>'
        }     
    });
    return finalMetrics
}

async function getCatPicture()
{
    return await axios.get('https://api.thecatapi.com/v1/images/search?api_key='+apiKey)
    
}

async function getCatFact()
{
    return await axios.get('https://catfact.ninja/fact?max_length=60')
}

async function getCaptionedPicture(caption, background)
{
    return await axios.get(encodeURI("https://api.memegen.link/images/custom/_/"+caption+".png?background="+background), { responseType: 'arraybuffer' })
}

function parseHrtimeToSeconds(hrtime) {
    var seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
    return seconds;
}

function appendMetrics(direction, path, method, time, neededTime, statusCode)
{
    // fs.appendFile('metrics.txt', "=>")
    fs.appendFile('metrics.txt', direction + ' ' + time + ' ' + path + ' ' + method + ' ' + statusCode + ' ||| Time : ' + neededTime + 's\n',() => {})
}

async function callAPIs()
{
    let object = {statusCode : 200, result : NaN, contentType : "image/png"}
    let statusCode = 200;

    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let time = hours + ':' + minutes + ':' + seconds;
    
    let factElapsedSeconds = 0;
    let pictureElapsedSeconds = 0;
    let captionElapsedSeconds = 0;

    let fact;
    var startTime = process.hrtime();
    try{
        await getCatFact().then(result => fact = result);
        statusCode = fact.status;
    }catch(e)
    {
        object.statusCode = 500
    }
    finally{
        factElapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));
        appendMetrics("=>","https://catfact.ninja/fact", 'GET', time, factElapsedSeconds, statusCode);
    }
    
    let picture; 
    startTime = process.hrtime();
    try{
        await getCatPicture().then(result => picture = result);
        statusCode = picture.status;
    }
    catch(e)
    {
        object.statusCode = 500
    }
    finally{
        pictureElapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));
        appendMetrics("=>","https://api.thecatapi.com/v1/images/search", 'GET', time, pictureElapsedSeconds, statusCode);
    } 
    
    if(picture.status != 200 || fact.status != 200)
    {
        object.contentType = application/json
        object.result = JSON.stringify({"error":"Resources not available"})

    }else{
        picture = picture.data[0].url;
        fact = fact.data.fact;
        
        let captionedPicture;
        startTime = process.hrtime();
        try{
            await getCaptionedPicture(fact, picture).then(result => captionedPicture = result);
            statusCode = captionedPicture.status;
        }catch(e)
        {
            object.statusCode = 500
        }
        finally{
            captionElapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));
            appendMetrics("=>","https://api.memegen.link/images/custom/", 'POST', time, captionElapsedSeconds, statusCode);
        }

        if(captionedPicture.status != 200)
        {
            object.contentType = application/json
            object.result = JSON.stringify({"error":"Resources not available"})
        }else{
            fs.writeFileSync("image.png",captionedPicture.data)
        }
    }

    var finalTime = parseFloat(factElapsedSeconds) + parseFloat(pictureElapsedSeconds) + parseFloat(captionElapsedSeconds);
    appendMetrics("<=","/get-results", 'GET', time, finalTime, statusCode);
    return object;

}

const apiKey = readApiKey();


const requestListener = async function (req, res) {
    switch (req.url) {
        case "/":
            await callAPIs().then(result => object= result)
            res.setHeader("Content-Type", "text/html");
            res.writeHead(object.statusCode);
            res.end(indexFile);
            break
        case "/get-results":
            await callAPIs().then(result => object = result)
            res.setHeader("Content-Type", object.contentType)
            res.writeHead(object.statusCode);
            res.end(readFile())

            break
        case "/metrics" :
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            let template = readMetricsTemplate();
            let metrics = readMetrics();
            metrics = constructMetrics(metrics);

            template = template.replace('**TO_REPLACE**',metrics)
            res.end(template)
            break
        case "/image.png":
            res.setHeader("Content-Type","image/png")
            res.writeHead(200)
            res.end(readFile())
            break;
        default:
            res.writeHead(404);
            res.end(JSON.stringify({error:"Resource not found"}));
    }
};

const server = http.createServer(requestListener);

fsp.readFile(__dirname + "/index.html")
    .then(contents => {
        indexFile = contents;
        server.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });