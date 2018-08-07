const server = require('./server');
const http = require('http');
jest.mock('http');

const res = {
  writeHead: jest.fn(),
  end: jest.fn(),
  setHeader: jest.fn()
};

const base = 'http://localhost/data';

describe('HTTP server', () => {

  beforeEach(() => {
    http.createServer.mockClear();
    res.writeHead.mockClear();
    res.end.mockClear();
    res.setHeader.mockClear();
    jest.resetModules();
    jest.mock('http', () => ({
      createServer: jest.fn()
    }));
  });

  it(`should call http.createServer`, () => {
    const s = server();
    expect(http.createServer).toHaveBeenCalled();
  });

  describe('GET /data with params', () => {
    const req = {
      url: base+'?foo=bar&bax=baz',
      method: 'GET',
      headers: {},
      on: jest.fn((i, fn) => {
        if(i === 'end') { fn(); }
      })
    };
    beforeEach(() => {
      jest.resetModules();
      jest.doMock('http', () => ({
        createServer: jest.fn(f => {
          f(req, res);
        })
      }));
    });

    it(`should respond with the query string object`, () => {
      const server = require('./server');
      const s = server();
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({
        foo: 'bar',
        bax: 'baz'
      }));
    });

    it(`should respond with 200 status`, () => {
      const server = require('./server');
      const s = server();
      expect(res.writeHead).toHaveBeenCalledWith(200);
    });

  });

  describe('POST /data', () => {
    const req = {
      url: base,
      method: 'POST',
      headers: {},
      on: jest.fn((i, fn) => {
        if(i === 'end') { fn(); }
      })
    }

    beforeEach(() => {
      jest.resetModules();
      jest.doMock('http', () => ({
        createServer: jest.fn(f => {
          f(req, res);
        })
      }));
    });

    it(`should respond with 200 status`, () => {
      const server = require('./server');
      const s = server();
      expect(res.writeHead).toHaveBeenCalledWith(200);
    });

    it(`should set header Content-Type to application/json`, () => {
      const server = require('./server');
      const s = server();
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    });

    it(`should set request event handler for 'data'`, () => {
      const server = require('./server');
      const s = server();
      expect(req.on).toHaveBeenCalledWith('data', expect.any(Function));
    });

    it(`should set request event handler for 'end'`, () => {
      const server = require('./server');
      const s = server();
      expect(req.on).toHaveBeenCalledWith('end', expect.any(Function));
    });

  });


});
