"use strict"
var _ = require('lodash')
  , Backbone = require('backbone')
  , Model = require('../models/client/model')
  , Collection = require('../models/client/collection')
  , viewOptions = [ 'template', 'el', 'id', 'attributes', 'className', 'tagName', 'events' ];


module.exports = Backbone.View.extend({

    constructor: function(options){
        var el;

        this.cid = _.uniqueId('view')

        options || (options = {})

        _.extend(this, _.pick(options, viewOptions))

        el = _.result(this, 'el')
        el = el instanceof Backbone.$ ? el : Backbone.$(el);

        if( el.length) this._existing = true;

        if(this.model || options.model) 
            this.model = createModel(this.model, options.model || {}, Model)
        if(this.collection || options.collection) 
            this.collection = createModel(this.collection, options.collection || [], Collection)

        this._ensureElement()

        this.initialize.apply(this, arguments)
        this.delegateEvents()
    },

    fetch: function (options) {
        var self = this
          , bound = this.collection || this.model;

        options || (options = {})

        kendo.ui.progress(self.$el, true)

        return bound.fetch(options)
            .then(function (data) {
                return self.render()
            })
            .finally(function () {
                kendo.ui.progress(self.$el, false)
            })
    },

    _data: function(){
        var bound = this.collection || this.model;

        return bound && bound.toJSON() || {}
    },

    readonly: function(enable){
        this.$(':input:not(.k-input, [type=checkbox], [type=radio])').prop('readonly', !enable)
        this.$('input[type=radio], input[type=checkbox]').not('.k-input').prop('disabled', !enable)

        this.$('.k-input:input[data-role]').each(function(){
            var widget = kendo.widgetInstance($(this))

            widget && widget.readonly && widget.readonly(!enable)
        })
    },

    applyBindings: function(){
        kendo.unbind(this.$el)
        this.model && kendo.bind(this.$el, this.model )
    },

    render: function (data) {
        var self = this;

        self.destroy()
        self.bound = true 
        self.$el.html(self.template(self._data()))

        self.applyBindings();
        
        return self.ready();
    },

    close: function(){
          this.$el[this._existing ? 'empty' : 'remove']();
          this.stopListening();
          kendo.unbind(this.$el)
          return this;
    },

    destroy: function(){ 
        if ( !self.bound ) return 

        this.bound = false
        kendo.unbind(this.$el)
        kendo.destroy(this.$el)

        this.$el.empty()
    },
});



function createModel(model, data, base){
    var ctor;
    
    if (!model && !data ) return 

    model = model || base
    ctor = typeof model === 'function'
         ? model
         : model.constructor

    if( data instanceof base )
        return data

    if( !data && model instanceof ctor)
        return model

    return new ctor(data)
}