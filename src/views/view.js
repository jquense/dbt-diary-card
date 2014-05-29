"use strict"
var _ = require('lodash')
  , Backbone = require('backbone')
  , Epoxy = require('backbone.epoxy')
  , viewOptions = [ 'template', 'el', 'id', 'attributes', 'className', 'tagName', 'events'
      ,'viewModel', 'bindings', 'bindingFilters', 'bindingHandlers', 'bindingSources', 'computeds' ];


module.exports = Epoxy.View.extend({

    constructor: function(options){
        this.cid = _.uniqueId('view')

        options || (options = {})

        _.extend(this, _.pick(options, viewOptions))

        this.model      = createModel(this.model, options.model, Epoxy.Model)
        this.collection = createModel(this.collection, options.collection, Backbone.Collection)

        this._ensureElement()

        this.initialize.apply(this, arguments)
        this.delegateEvents()
    },

    fetch: function (options) {
        var self = this;

        options || (options = {})

        kendo.ui.progress(self.$el, true)

        return this.model.fetch()
            .then(function (data) {
                self.render()
            })
            .always(function () {
                kendo.ui.progress(self.$el, false)
            })
    },

    _data: function(){
        return this.model.toJSON();    
    },

    render: function (data) {
        var self = this;

        self.destroy()
        self.bound = true 
        self.$el.html(self.template(self._data()))

        kendo.init(self.$el);

        self.applyBindings();
        
        return self.ready();
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

    return new ctor(data || {})
}