/** @typedef {import("../types").Callback} Callback */

const route_table = {};

/**
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function get(configuration, callback) {
    let error = undefined, config = undefined;
    callback = callback || ((e, c) => e ? console.error(e) : console.log(c));
    if (configuration in route_table) {
        config = route_table[configuration];
    } else {
        error = new Error(`'${configuration}' doesn't exist!`);
    }
    callback(error, config);
    return config;
}

/**
 * @param {object} service
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function put(service, configuration, callback) {
    callback = callback || ((e, c) => e ? console.error(e) : console.log(c));
    route_table[configuration] = service;
    callback(undefined, service);
}

/**
 * @param {string} configuration
 * @param {Callback} callback
 */
function rem(configuration, callback) {
    let error = undefined;
    callback = callback || ((e, c) => e ? console.error(e) : console.log(c));
    if (configuration in route_table) {
        Reflect.deleteProperty(route_table, configuration);
    } else {
        error = new Error(`${configuration} doesn't exist!`);
    }
    callback(error, configuration);
};

module.exports = {get, put, rem};
