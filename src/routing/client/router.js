
var qs = require('qs')
  , Backbone = require('backbone');


module.exports = Backbone.Router.extend({

    execute: function (cb, args) {

        args.push(qs.parse(args.pop()));

        if (cb) cb.apply(this, args);
    }
})