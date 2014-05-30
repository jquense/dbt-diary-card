"use strict"
var _ = require('lodash')
  , moment = require('moment');

module.exports =  {
    "number": function (value) {
        return parseFloat(value);
    },

    "date": function (value) {
        return moment(value).toDate()
    },

    "boolean": function (value) {
        if (typeof value === 'string') 
            return value.toLowerCase() === "true";
   
        return value != null ? !!value : value;
    },
    "string": function (value) {
        return value != null ? (value + "") : value;
    },

    "default": function (value) {
        return value;
    }
};
