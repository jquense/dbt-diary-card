
var Promise = require('bluebird')
  , _ = require('lodash')
  , moment = require('moment')
  , qs = require('qs')


module.exports = {
    startOf: function(type, date){
        return moment(date).startOf(type).toDate()
    },
    endOf: function(type, date){
        return moment(date).sendOf(type).toDate()
    },
    url: function (url, data) {
        return url + ( data ? '?' + qs.stringify(data) : '')
    }
}