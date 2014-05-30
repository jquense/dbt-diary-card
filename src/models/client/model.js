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

    BaseModel.fn.init.call(this, data)
    fields(this);
}

_.extend(Model.prototype , {

    idField: 'id',

    fields: {},
    defaults: {},

    shouldSerialize: function (field) {
        return BaseModel.fn.shouldSerialize.call(this, field)
            && field !== 'url'
            && field !== 'urlRoot'
    },
   
    set: function(key, val){
        var self = this
          , attrs;

        if (typeof key === 'object') 
            attrs = key
        else 
            (attrs = {})[key] = val
         
        _.each(attrs, function(val, field){
             BaseModel.fn.set.call(self, field, val)
             self.trigger('change:' + field)
        })

        return this
    },

    clear: function(options) {
      var attrs = {};

      for (var key in this.toJSON()) 
          delete this[key];

      this.id = this.get(this.idField);

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

        return Backbone.ajax(params)
    },

    accept: function(data) {
            var that = this,
                parent = function() { return that; },
                field;

            _.each(data, function(value, field){
                value = that._parse(field, value);

                if (field.charAt(0) != "_")
                    value = that.wrap(value, field, parent);
                
                that._set(field, value);
            })
                

            if (that.idField)
                that.id = that.get(that.idField);

            that.dirty = false;
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
    var type, value, originalName, field
      , defaultValues = {
        "string": "",
        "number": 0,
        "date": new Date(),
        "boolean": false,
        "default": ""
    };

    for (name in ctx.fields) {
        field = ctx.fields[name];
        value = null;
        originalName = name;

        type = typeof type === 'string' 
            ? field.type || 'default'
            : 'default';

        name = typeof (field.field) === 'string' 
            ? field.field 
            : name

        if (!field.nullable) {
            value = ctx.defaults[originalName !== name ? originalName : name] 
                = field.defaultValue !== undefined 
                    ? field.defaultValue 
                    : defaultValues[type.toLowerCase()]
        }

        if (ctx.idField === name) ctx._defaultId = value
        
        ctx.defaults[originalName !== name ? originalName : name] = value
        field.parse = getParser(field)
    }
}

function getParser(field){
    var parsers = require('./parsers')
      , type = field.type
      , parser = field.parse || parsers[field.type || 'default']

    if (_.isArray(type) || typeof type === 'function') {
        parser = function(data){
            return _.isArray(type) 
                ? _.map(data, parseArray) 
                : new type(data)   
        }
    }

    return parser;

    function parseArray(d){ 
        return new type[0](d) 
    }
}