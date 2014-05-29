"use strict"
var _ = require('lodash')
  , Backbone = require('backbone')
  , viewOptions = [ 'template', 'el', 'id', 'attributes', 'className', 'tagName', 'events'
      ,'viewModel', 'bindings', 'bindingFilters', 'bindingHandlers', 'bindingSources', 'computeds' ];


module.exports = Backbone.Model.extend({

    constructor: function(attributes, options) {
        var self = this
          , attrs = attributes || {};

        options || (options = {});

        this.cid = _.uniqueId('c');
        
        this.attributes = new kendo.data.ObservableObject({});
        this.attributes
            .bind('change', function (e) {
                self.trigger('change:' + e.field)
            })

        if (options.collection) this.collection = options.collection;
        if (options.parse) attrs = this.parse(attrs, options) || {};

        attrs = _.defaults({}, attrs, _.result(this, 'defaults'));

        this.set(attrs, options);
        this.initialize.apply(this, arguments);
    },

    get: function (attr) {
        return this.attributes.get(attr);
    },

    set: function (key, val, options) {
        var self = this
          , attrs;

        if (key == null) return this;

        if (typeof key === 'object') {
            attrs = key;
            options = val;
        } else 
            (attrs = {})[key] = val;
        
        options || (options = {});

        if (this.idAttribute in attrs)
            this.id = attrs[this.idAttribute];

        _.each(attrs, function (val, field) {

            if (!_.isEqual(val, self.get(field))) {
                self.dirty = true;

                if (options.silent)
                    self.attributes[field] = val;

                else if (options.unset)
                    delete self.attributes[field.split('.')[0]];

                else
                    self.attributes.set(field, val);
            }
        })
    }
})
