const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = () => http.createServer((req, res) => {

  const parsedUrl = url.parse(req.url, true);
  const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  const queryStringObject = parsedUrl.query;
  const method = req.method.toLowerCase();
  const headers = req.headers;

  let statusCode = 400;
  let payload = '';
  const decoder = new StringDecoder('utf-8');


  switch(trimmedPath) {
    case 'data':
      if(method === 'get') {
        statusCode = 200;
        payload = JSON.stringify(queryStringObject);
      }
      else if(method === 'post') {
        statusCode = 200;
      }
      else {
        statusCode = 400;
        payload = undefined;
      }
      break;
    default:
      statusCode = 404;
      payload = undefined;
  }

  req.on('data', data => {
    payload += decoder.write(data);
  });
  req.on('end', () => {
    if(method === 'post') {
      payload += decoder.end();
    }
    res.setHeader(
      'Content-Type', 'application/json'
    );
    res.writeHead(statusCode);
    res.end(payload);
  });
});

module.exports = server;
