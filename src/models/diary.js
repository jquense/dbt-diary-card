"use strict";
var dal = require("./define")
  , Day = require('./day')
  //, Mongoose = require('mongoose')
  , moment = require('moment')
  , _ = require('lodash')
  , diary;

diary = new dal.Schema({

    date: { 
        type: Date,
        default: new Date(),
        unique: true, 
    },

    submitted: { type: Boolean, deault: false },
    started: { type: Boolean, deault: false },

    days: { 
        type: [ Day.schema ],

        get: function(value){
            if (!value) return value;
            return expandDays(this.date, value)
        } 
    }
}, {  id: false, toJSON: { getters: true }, toObject: { getters: true } });

//diary.index({ week: 1, year: -1 }, { unique: true })

module.exports = dal.define('Diary', 'diaries', diary)

function expandDays(date, models){
    date = moment(date)

    return _.map(_.range(1,8), function(){
        var model = _.find(models, function(m){
            return date.isSame(m.date, 'date');
        }) || new Day({ _id: null, date: date.toDate() });

        date = date.clone().add('d', 1);

        return model; 
    })
}