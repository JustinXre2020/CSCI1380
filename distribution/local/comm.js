/** @typedef {import("../types").Callback} Callback */
/** @typedef {import("../types").Node} Node */

const { serialize } = require("../util/util");
const http = require("http");


/**
 * @typedef {Object} Target
 * @property {string} service
 * @property {string} method
 * @property {Node} node
 */

/**
 * @param {Array} message
 * @param {Target} remote
 * @param {Callback} [callback]
 * @return {void}
 */
function send(message, remote, callback) {
    callback = callback || ((e, c) => e ? console.error(e) : console.log(c));
    let data = undefined;
    try {
        data = serialize(message);
    } catch (error) {
        throw error;
    }
    const { node: { ip, port }, service, method } = remote;
    const options = {
        hostname: ip,
        port: port,
        method: 'PUT',
        path: `/${ip}:${port}/${service}/${method}`,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const req = http.request(options, (res) => {
        let responseData = [];

        res.on("data", (chunk) => {
          responseData.push(chunk);
        });
      
        res.on("end", () => {
            responseData = JSON.parse(responseData.join(''));
            // Handle conditions that failed
            if (res.statusCode !== 200) {
                callback(new Error(`Request failed: ${responseData.error}`), undefined);
            } else {
                callback(undefined, responseData.data);
            }
        });
        res.on("error", err => console.error(err));
    });
    // Handle network errors
    req.on("error", (error) => {
        callback(error, undefined);
    });
    req.write(data);
    req.end();
}

module.exports = {send};
