
var Index = require('./views/index')
  , Promise = require('bluebird')
  , Backbone = require('backbone')
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
     
    index.fetch();
})
