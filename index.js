const server = require('./server');

server().listen(8900, () => console.log('Server now listening on http://localhost:8900'));
