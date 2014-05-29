
var Index = require('./views/index')

require('backbone').$ = $

require('./helpers')
require('./partials')
require('./bindings')

$(function(){
    var index = new Index()

    index.fetch();
})
