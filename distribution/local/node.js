const http = require('http');
const url = require('url');
const log = require('../util/log');
const { routes, status } = require('./local');
const { deserialize, serialize } = require('../util/util');


/*
    The start function will be called to start your node.
    It will take a callback as an argument.
    After your node has booted, you should call the callback.
*/

const service_methods_map = {
  routes: {
    get: routes.get,
    put: routes.put,
    rem: routes.rem
  },
  status: {
    get: status.get,
    spawn: status.spawn,
    stop: status.stop
  }
}

const start = function(callback) {
  const server = http.createServer((req, res) => {
    /* Your server will be listening for PUT requests. */

    // Write some code...
    if (req.method !==  "PUT") {
      // Handle other HTTP methods
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }

    /*
      The path of the http request will determine the service to be used.
      The url will have the form: http://node_ip:node_port/service/method
    */


    // Write some code...
    const url_ = url.parse(req.url);
    const urls = url_.pathname.split('/');
    const service = urls[2], service_method = urls[3];

    /*

      A common pattern in handling HTTP requests in Node.js is to have a
      subroutine that collects all the data chunks belonging to the same
      request. These chunks are aggregated into a body variable.

      When the req.on('end') event is emitted, it signifies that all data from
      the request has been received. Typically, this data is in the form of a
      string. To work with this data in a structured format, it is often parsed
      into a JSON object using JSON.parse(body), provided the data is in JSON
      format.

      Our nodes expect data in JSON format.
  */

    // Write some code...
    let body = [];

    req.on('data', (chunk) => {
      body.push(chunk.toString());
    });

    req.on('end', () => {

      /* Here, you can handle the service requests. 
      Use the local routes service to get the service you need to call.
      You need to call the service with the method and arguments provided in the request.
      Then, you need to serialize the result and send it back to the caller.
      */

      // Write some code...
      let params = undefined;
      try {
        // parse JSON data
        const data = body.join('');
        params = deserialize(data);

        // call service with given method and arguments, catch any error in between
        const result = service_methods_map?.[service]?.[service_method]?.(...params);
        if (result === undefined) {
          throw new Error(`Invalid method or service: ${service}, ${service_method}`);
        }
        // Send a response
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ data: result }));
      } catch (error) {
        // Handle JSON parsing errors
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error }));
      }
    });
  });


  /*
    Your server will be listening on the port and ip specified in the config
    You'll be calling the `callback` callback when your server has successfully
    started.

    At some point, we'll be adding the ability to stop a node
    remotely through the service interface.
  */

  server.listen(global.nodeConfig.port, global.nodeConfig.ip, () => {
    // log(`Server running at http://${global.nodeConfig.ip}:${global.nodeConfig.port}/`);
    global.distribution.node.server = server;
    callback(server);
  });

  server.on('error', (error) => {
    // server.close();
    // log(`Server error: ${error}`);
    throw error;
  });
};

module.exports = {
  start: start,
};
