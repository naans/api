const wz   = require('wajez-api')
  , config = require('config')
  , User = require('../resources/User')

module.exports = wz.auth({secret: config.get('secret')}, User)