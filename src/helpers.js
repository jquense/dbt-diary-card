var _ = require('lodash')
  , Handlebars = require("hbsfy/runtime")
  , moment = require('moment')
  , qs = require('qs')
  , format = require('util').format;


function isArray(arr) {
    var rslt = _.isArray(arr);

    if (arr && arr.length !== undefined && !rslt && arr instanceof kendo.data.ObservableArray)
        rslt = true;

    return rslt;
}

Handlebars.registerHelper( 'each', function ( context, options ) {
    var fn = options.fn, 
        inverse = options.inverse,
        i = null,
        ret = "", 
        data;

    if ( typeof context === "function" ) 
        context = context.call( this );
    
    if ( options.data ) 
        data = Handlebars.createFrame( options.data );
    
    var prop = isArray(context) ? "index" : "key";

    _.each( context, function (item, idx) {
        if ( data ) data[prop] = i = idx;
        
        ret = ret + fn( item, { data: data } );
    })

    if ( i === null ) 
        ret = inverse( this );
    
    return ret;
});

Handlebars.registerHelper('url', function(){
    var options = arguments[arguments.length - 1]
      , url = format.apply(null,_.initial(arguments))

    return url + (_.size(options.hash) ? '?' + qs.stringify(options.hash) : '')
})

Handlebars.registerHelper('format', function(format){
    return format.apply(null,_.initial(arguments))
})

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

Handlebars.registerHelper('radio-range', function(amount, field, options){
    var inputs = '', labels = ''
      , name = _.uniqueId(field + '_');

    _.each(_.range(amount), function(number){
        inputs += format('<td><input type="radio" %s="%s" name="%s" value="%d"></td>'
            , kendo.attr('bind')
            , 'checked: ' + field
            , name, number) 

        labels += format('<td><label class="%s">&nbsp;%s&nbsp;</label></td>'
            , options.classes || ""
            , number) 
    })

    return new Handlebars.SafeString('<table class="radio-range"><tr>' + inputs + '</tr><tr>'+ labels + '</tr></table>');
})
 

Handlebars.registerHelper('view', function(field, template){
    var templ = require(template);

    console.log(template);
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