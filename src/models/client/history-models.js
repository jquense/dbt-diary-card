"use strict"
var _ = require('lodash')
  , DAL = require('react-flow').DataAccess
  , Model = DAL.Model
  , Collection = DAL.Collection
  , field = DAL.field
  , moment = require('moment');


module.exports = function(app){
    var HistoryItem = Model.define({
        date:    field(Date),
        started: field(Boolean) 
    })

    app.HistoryItem = HistoryItem

    app.History = Model.define({
        idField: '_id',
        urlRoot: '/api/diary',

        date:    field(Date),
        days:    [ HistoryItem ]  
    })
}
