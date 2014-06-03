
var _ = require('lodash')
  , moment = require('moment')
  , dialog = require('../lib/dialog')
  , Promise = require('bluebird')
  , Model = require('../models/client/model')
  , View = require('./view');

var Handlebars = require('hbsfy/runtime')

module.exports = View.extend({

    el: 'body',

    template: require('../../views/overview.hbs'),

    collection: require('../models/client/collection').extend({
        url: '/api/diary',

        comparator: function (a, b) {
            return a.get('date').getTime() < b.get('date').getTime() ? 1 : -1;
        },

        model: Model.extend({
            idField: '_id',
            fields: {
                date: 'date',
                days: [ Model.extend({
                    fields: {
                        date: 'date',
                        started: 'boolean'        
                    }    
                })]        
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

    _data: function(){
        return _.groupBy(this.collection, function(m){
            return moment(m.get('date')).format('MMMM')
        })   
    }

});