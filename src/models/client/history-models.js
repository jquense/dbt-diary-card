"use strict"
var _ = require('lodash')
  , Flow = require('react-flow')
  , Model = Flow.Model
  , Collection = Flow.Collection
  , field = Model.field
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
