const http = require('http');
const server = require('./server');
const StringDecoder = require('string_decoder').StringDecoder;

describe('HTTP Server', () => {

  let httpServer = server();

  beforeAll(done => httpServer.listen(8900, done));

  afterAll(done => httpServer.close(done));

  describe('GET /data with URL params', () => {

    it(`should respond with 200 status`, done => {
      const requestDetails = {
        hostname: 'localhost',
        port: '8900',
        method: 'GET',
        path: '/data?foo=bar'
      };

      expect.assertions(1);

      const req = http.request(requestDetails, res => {
        expect(res.statusCode).toBe(200);
        done();
      });
      req.end();
    });

    it(`should respond with the query object`, done => {
      const requestDetails = {
        hostname: 'localhost',
        port: '8900',
        method: 'GET',
        path: '/data?foo=bar',
        timeout: 5000
      };

      expect.assertions(1);

      const req = http.request(requestDetails, res => {
        const decoder = new StringDecoder('utf-8');
        let payload = '';
        res.on('data', data => {
          payload += decoder.write(data);
        });

        res.on('end', () => {
          payload += decoder.end();
          expect(JSON.parse(payload)).toStrictEqual({
            foo: 'bar'
          });
          done();
        });
      });

      req.end();
    });

  });

  describe('POST /data with a payload', () => {

    const payload = JSON.stringify({
      data1: 'this is my data!',
      data2: 123
    });

    const requestDetails = {
      hostname: 'localhost',
      port: '8900',
      method: 'POST',
      path: '/data',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    it(`should respond with 200 status`, done => {
      expect.assertions(1);
      const req = http.request(requestDetails, res => {
        expect(res.statusCode).toBe(200);
        done();
      });

      req.write(payload);
      req.end();
    });

    it(`should respond with the same data sent`, done => {
      expect.assertions(1);
      const decoder = new StringDecoder('utf-8');
      let chunks = '';
      const req = http.request(requestDetails, res => {
        res.on('data', data => chunks += decoder.write(data));

        res.on('end', () => {
          chunks += decoder.end();
          expect(JSON.parse(chunks)).toStrictEqual({
            data1: 'this is my data!',
            data2: 123
          });
          done();
        });
      });

      req.write(payload);
      req.end();
    });

  });

});
