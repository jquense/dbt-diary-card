
var Promise = require('bluebird')
  , _ = require('lodash')
  , qs = require('qs')


module.exports = {

    url: function (url, data) {
        return url + ( data ? '?' + qs.stringify(data) : '')
    }
}