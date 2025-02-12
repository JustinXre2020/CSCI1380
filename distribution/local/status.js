const id = require('../util/id');
const log = require('../util/log');

const status = {
  ...global.nodeConfig
};

global.moreStatus = {
  sid: id.getSID(global.nodeConfig),
  nid: id.getNID(global.nodeConfig),
  counts: 0,
};

status.get = function(configuration, callback) {
  callback = callback || function() { };
  let config
  const memoryUsage = process.memoryUsage();
  if (configuration in memoryUsage) {
    config = memoryUsage[configuration];
  } else if (configuration in global.moreStatus) {
    config = global.moreStatus[configuration];
  } else {
    config = status[configuration]
  }
  callback(config !== undefined ? undefined : new Error("configuration doesn't exist!"), config)
  return config;
};


status.spawn = function(configuration, callback) {
  callback = callback || function() { };
  callback(configuration);
};

status.stop = function(callback) {
  callback = callback || function() { };
  callback();
};

module.exports = status;
