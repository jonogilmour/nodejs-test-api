# Dead simple NodeJS API server
As the title states, this is a very simple API server in raw NodeJS. POST or GET something to /data and you get it back.

Good for testing communication to external servers, ensuring expected output for your input.

## Usage
Run the test suite with
```
npm test
```
To start the server on localhost port `8900`
```
npm start
```
The server exposes one endpoint `/data` that responds to `GET` and `POST` requests
## Examples
#### GET
Send a simple `GET` request:
```
GET /data?foo=bar&baz=biz
```
and you get the request params back as JSON
```
200 OK
{
  "foo" : "bar",
  "baz" : "biz"
}
```
#### POST
Send a simple `POST` request:
```
POST /data with JSON payload:
{
  "myData": "Some long string of data",
  "myNum": 123456
}
```
and you get the payload back as JSON
```
200 OK
{
  "myData": "Some long string of data",
  "myNum": 123456
}
```
#### Errors
Send a request to anywhere but `/data`
```
GET /foobar
> 404 Not Found
```
Non GET or POST to /data
```
PUT /data
> 400 Bad Request
```
