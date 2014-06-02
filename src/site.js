/*global $*/
var Router = require('./routing/client/router')
  , Index = require('./views/diary')
  , Promise = require('bluebird')
  , Backbone = require('backbone')
  , moment = require('moment')
  , ajax = $.ajax;

Backbone.$ = $
Backbone.ajax = function () {
    var xhr = ajax.apply($, arguments)

    return Promise.cast(xhr).cancellable()
        .catch(Promise.CancellationError, function (err) { xhr.abort(); throw err })
};

require('./bindings')

$(function(){
    var index = new Index()
      , router = new Router({
            routes: {
                'diary(/)': 'diary'    
            }
        })
     
    router.on('route:diary', function(query){
        index.changeWeek(moment(query.date, 'MMM-DD-YY').toDate() || new Date());
    })

    Backbone.history.start({ pushState: true })
})


$(document)
    .on('click', 'a[data-url=client]', function(e){
        e.preventDefault();
        Backbone.history.navigate(this.getAttribute('href'), true) 
    })