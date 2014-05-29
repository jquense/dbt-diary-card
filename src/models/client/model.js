"use strict"
var _ = require('lodash')
  , Backbone = require('backbone')
  , Model = kendo.data.Model
  , mixin = _.pick(Backbone.Model.prototype, 'url')  
  , moment = require('moment');



module.exports = Model;

Model.extend = Backbone.Model.extend;

function ClientModel(data) {
    var self = this
      , attrs = attributes || {};

    Model.fn.init.call(this, data)
    fields(this);
}

_.extend(ClientModel.prototype,  mixin, {

    idField: 'id',

    fields: {},
    defaults: {},

    shouldSerialize: function (field) {
        return Model.fn.shouldSerialize.call(this, field)
            && field !== 'url'
            && field !== 'urlRoot';
    },
   
    fetch: function (options) {
        var self = this;

        return self.sync('read', self, options)
            .then(function (data) {
                self.accept(data);
            });
    },

    sync: function() {
        return Backbone.sync.apply(this, arguments);
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
            });
    },

    clone: function() {
        return new this.constructor(this.toJSON());
    },
 
})

var parsers = {
    "number": function (value) {
        return parseFloat(value);
    },

    "date": function (value) {
        return moment(value).toDate()
    },

    "boolean": function (value) {
        if (typeof value === 'string') 
            return value.toLowerCase() === "true";
   
        return value != null ? !!value : value;
    },

    "string": function (value) {
        return value != null ? (value + "") : value;
    },

    "default": function (value)  {return value;}
};

function urlError() {
    throw new Error('A "url" property or function must be specified');
};

function fields(ctx){
    var type, value,orginalName, field
      , defaultValues = {
        "string": "",
        "number": 0,
        "date": new Date(),
        "boolean": false,
        "default": ""
    };

    for (name in ctx.fields) {
        field = ctx.fields[name];
        type = field.type || "default";
        value = null;
        originalName = name;

        name = typeof (field.field) === 'string' ? field.field : name;

        if (!field.nullable) {
            value = ctx.defaults[originalName !== name ? originalName : name] 
                = field.defaultValue !== undefined 
                    ? field.defaultValue 
                    : defaultValues[type.toLowerCase()];
        }

        if (options.idField === name)
            proto._defaultId = value;
        
        ctx.defaults[originalName !== name ? originalName : name] = value;

        field.parse = field.parse || parsers[type];
    }
}