"use strict"
var _ = require('lodash')
  , Backbone = require('backbone')
  , BaseModel = kendo.data.Model  
  , inherits = require('util').inherits
  , moment = require('moment');

module.exports = Model;

inherits(Model, BaseModel);

Model.extend = Backbone.Model.extend;


function Model(data) {
    var self = this;

    fields(this);

    data = _.extend({}, self.defaults, data);

    kendo.data.ObservableObject.fn.init.call(self, data);

    self.dirty = false;
     
    if (self.idField) {
        self.id = self.get(self.idField);

        if (self.id === undefined) 
            self.id = self._defaultId;
    }
}

_.extend(Model.prototype , {

    idField: 'id',

    fields: {},
    defaults: {},

    shouldSerialize: function (name) {

        return BaseModel.fn.shouldSerialize.call(this, name)
            && !this.isVirtual(name)
            && name !== 'url'
            && name !== 'urlRoot'
    },
   
    isVirtual: function(field){
        field = (this.fields || {})[field];
        return (field|| {}).virtual;
    },

    set: function(key, val, initiator){
        var self = this
          , attrs;

        if (typeof key === 'object') {
            attrs = key
            initiator = val;
        }    
        else 
            (attrs = {})[key] = val
         
        _.each(attrs, function(value, field){

            if (self.editable(field)) {
                value = self._parse(field, value);

                if (!_.isEqual(value, self.get(field))) {
                    if( !self.isVirtual(field) ) self.dirty = true;

                    kendo.data.ObservableObject.fn.set.call(self, field, value, initiator);
                    self.trigger('change:' + field)
                }
            }
        })

        return this
    },

    clear: function(options) {
        var attrs = {};

        for (var key in this.toJSON()) 
            delete this[key];

        this.id = this.get(this.idField);
        return this
    },

    url: function() {
        var base =
            _.result(this, 'urlRoot') ||
            _.result(this.parent(), 'url') ||
            urlError();

        if (this.isNew()) return base;
        return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
    },

    save: function (options) {
        var self = this
          , isNew = self.isNew();

        return self.sync(isNew ? 'create' : 'update', self, options)
            .then(function (data) {
                self.accept(data);
                self.trigger('sync', { resp: data, options: options });
            });
    },

    destroy: function (options) {
        var self = this;

        if (this.isNew()) return

        return sync('delete', self, options)
            .then(function (data) {
                self.trigger('sync', { resp: data, options: options })
            });
    },

    fetch: function (options) {
        var self = this;

        return self.sync('read', self, options)
            .then(function (data) {
                self.accept(data);
                self.trigger('read', { options: options });
            });
    },

    sync: function(action, model, options) {
        var map = {
                read:     'GET',
                create:   'POST',
                update:   'PUT',
                'delete': 'DELETE'
            },
            params = {
                type: map[action], 
                dataType: 'json'
            };

        options || (options = {})

        if (!options.url) 
            params.url = _.result(model, 'url') || urlError()

        if (options.data == null && model && (action === 'create' || action === 'update' || action === 'patch')) {
            params.contentType = 'application/json'
            params.data = JSON.stringify(model.toJSON())
        } 

        return Backbone.ajax(_.extend(params, options))
    },

    accept: function(data) {
        var self = this
          , wasDirty = self.dirty
          , parent = function() { return self; }
          , field;

        _.each(data, function(value, field){
            value = self._parse(field, value);

            if (field.charAt(0) != "_")
                value = self.wrap(value, field, parent);
                
            self._set(field, value);
        })
                

        if (self.idField)
            self.id = self.get(self.idField);

        self.dirty = false;

        ////to trigger stuff looking at dirty
        //if (self.wasDirty)
        //    self.trigger('change', { action: 'accept' })        
    },

    on: function(){
        this.bind.apply(this, arguments)    
        return this
    },

    off: function(){
        this.unbind.apply(this, arguments) 
        return this   
    },

    clone: function() {
        return new this.constructor(this.toJSON())
    },
 
})



function urlError() {
    throw new Error('A "url" property or function must be specified');
};

function fields(ctx){
    var value, type, originalName, field;

    for (name in ctx.fields) {
        field = ctx.fields[name];
        value = null;
        originalName = name;

        field = ctx.fields[name] = _.isPlainObject(field)
            ? field
            : { type: field }            

        type = field.type;

        if ( typeof field.type !== 'string' )
            field.type = null;   
        
        name = typeof (field.field) === 'string' 
            ? field.field 
            : name

        if (!field.nullable) {
            value = ctx.defaults[originalName !== name ? originalName : name] 
                = field.defaultValue !== undefined 
                    ? field.defaultValue 
                    : defaults(type)
        }

        if (ctx.idField === name) ctx._defaultId = value
        
        ctx.defaults[originalName !== name ? originalName : name] = value
        field.parse = getParser(field, type)
    }
}

function getParser(field, type){
    var primitives = require('./primitives')
      , nested = _.isArray(type)
      , parser = field.parse || primitives.parsers[type]
      , t;

    if ( nested)
        type = type.length ? type[0] : Array 

    t = primitives.types[type] || type
    
    if (parser) return parser

    return function(data){
        return nested
            ? _.map(data, parseArray) 
            : clean(new t(data))  
    }
    
    function parseArray(d){ 
        return clean(new t(d))
    }
}

var toString = Object.prototype.toString;

function defaults(type){
    var primitives = require('./primitives').types; 

    if ( _.isArray(type) ) 
        return [];

    type = primitives[type] || type || String;

    return clean(new type())
}

function clean(inst){
    var primitives = [ '[object Boolean]', '[object Number]', '[object String]' ];

    if( _.contains(primitives, toString.call(inst)) )
        inst = inst.valueOf();

    return inst
}