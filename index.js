/*
* Assigment: #1
* Author: Guilherme Ramalho
* Date: 09-10-2018
*/

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const configs = require('./config');

// Handler definition
const handler = {};

// Hello handler
handler.hello = (data, callback) => {
    callback(200,{'Hello World!': 'I am Guilherme Ramalho a Portugues Computer Engineer!'});
};

// NotFound handler
handler.notFound = (data, callback) => {
    callback(404);
};

// Router definition
const router = {
    'hello': handler.hello    
}

// Instanciate and start HTTP Server
const httpServer = http.createServer((req,res) => {
    
    // Get URL and parse it
    let parsedUrl = url.parse(req.url,true);

    // Get the Path from the URL
    let pathURL = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

    // Get the request method
    let reqMethod = req.method.toLowerCase();


    // Get the payload, if any
    let decoder = new StringDecoder('utf-8');
    let payloadData = '';

    req.on('data',(data) => {
        payloadData += decoder.write(data);
    })

    req.on('end', () => {
        payloadData += decoder.end();
        
        // Construct the data object to send the handler 
        let data = {
            'path': pathURL,
            'qsObject': parsedUrl.query,
            'method': reqMethod,
            'headers': req.headers,
            'payload': payloadData
        }

        // Chose handler that the request should go
        let choseHandler = typeof(router[pathURL]) !== 'undefined' && reqMethod == 'post' ? router[pathURL] : handler.notFound;

        // Route the request to the handler specified in the route
        choseHandler(data,(code,payload) =>{
            //Use the status code called back by the handler, or default to 200
            code = typeof(code) == 'number' ? code : 200;
            
            //Use the payload called back by the handler, or default to an empty obejct
            payload = typeof(payload) == 'object' ? payload: {};
        
            //Convert the payload to a string
            let payloadString = JSON.stringify(payload);

            //Return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(code);
            res.end(payloadString);
        });
    })

}).listen(configs.httpPort,() => {
    console.log('The server is listening on port ' + configs.httpPort);
});


