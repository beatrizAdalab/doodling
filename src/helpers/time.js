'use strict'

const helpers = {};
const moment = require('moment');

helpers.timeAgo = timestamp => {
  return moment(timestamp).fromNow();
};

module.exports = helpers;