"use strict"
var _ = require('lodash')
  , moment = require('moment')
  , Model = require('./model');

module.exports = Model.extend({
    idField: '_id',

    url: function(){
        return '/api/diary/' + this.date.toISOString()
    },

    firstOfWeek: function(){
        return moment(this.get('date'))
            .startOf('week')
            .toDate()
    },

    endOfWeek: function(){
        return moment().endOf('week').toDate()
    },

    save: function(options){
        var model = this.toJSON()
          , days = this.get('days')

        model.days = _(days)
            .filter('started')
            .invoke('toJSON')
            .value()

        return Model.prototype.save
            .call(this, _.extend({}, options, { data: model }))
    },

    fields: {
        date: 'date',
        week: 'number',
        year: 'number',
        days: [ require('./diary-form') ]
    }    
})