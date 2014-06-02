
var _ = require('lodash')
  , moment = require('moment')
  , dialog = require('../lib/dialog')
  , Promise = require('bluebird')
  , Backbone = require('backbone')
  , View = require('./view');

var Handlebars = require('hbsfy/runtime')

module.exports = View.extend({

    el: 'body',

    template: require('../../views/overview.hbs'),

    collection: Backbone.Collection.extend({
        url: '/api/diary',

        model: require('../models/client/model').extend({  
            fields: {
                date: 'date',
                days: []
            }
        })
    }), 

    events: {
        'click .btn-save': 'save', 
        'click .btn-submit': 'submit',
        'click .btn-unsubmit': 'unsubmit' 
    },

    ready: function () {
        var self = this;
 
    },

});