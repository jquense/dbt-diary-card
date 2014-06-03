/*global $*/
var Router = require('./routing/client/router')
  , Index = require('./views/diary')
  , Overview = require('./views/overview')
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
    var current
      , router = new Router({
            routes: {
                'diary(/:date)': 'diary',
                'overview' : 'overview',
                '' :         'overview'   
            }
        })
     
    router
        .on('route:diary', function(date){
            var view = current;

            if (!(view instanceof Index)) {
                view && view.close()
                view = new Index()
            }

            view.changeWeek(date 
                ? moment(date, 'MMM-DD-YY').toDate() 
                : new Date());

            current = view
        })
        .on('route:overview', function(){
            var view = current;

            if (!(view instanceof Overview)) {
                view && view.close()
                view = new Overview()
            }

            view.fetch()
            current = view
        })

    Backbone.history.start({ pushState: true })
})


$(document)
    .on('click', 'a[data-url=client]', function(e){
        e.preventDefault();
        Backbone.history.navigate(this.getAttribute('href'), true) 
    })