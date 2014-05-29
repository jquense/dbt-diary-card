var _ = require('lodash')
  , Handlebars = require("hbsfy/runtime")
  , moment = require('moment')
  , format = require('util').format;


Handlebars.registerHelper('dateFormat', function(date, format){
    return moment(date).format(format);
})

Handlebars.registerHelper('bind-to', function(field, options){
    var out = format("%s=\"%s\"", kendo.attr('bind'), field);
    
    _.each(options.hash, function(val, key){
        out += format(" %s=\"%s\"", kendo.attr(key), val)  
    });

    return new Handlebars.SafeString(out);
})

Handlebars.registerHelper('oneToFive', function(name, value, options){
    var out = '';

    _.each(_.range(6), function(number){
        out += format('<label class="%s"><input name="%s" type="radio" value="%d" %s></label>'
            , options.classes || "radio-inline"
            , name
            , number
            , (value || 0) === number ? 'checked="checked"' : '');
    })

    return new Handlebars.SafeString(out);
})
 

function parseValue(ctx, string){
    var parts = string.split(/[[\]]{1,2}/)
      , part;

    parts.pop();

    while (part = parts.shift() ){
        ctx = ctx[part]
    }

    return ctx
}