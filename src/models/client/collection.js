"use strict"
var _ = require('lodash')
  , Backbone = require('backbone')
  , BaseCollection = kendo.data.ObservableArray
  , sync = require('./sync')
  , inherits = require('util').inherits
  , sort = [].sort;

module.exports = Collection;

inherits(Collection, BaseCollection);

Collection.extend = Backbone.Collection.extend;

function Collection(models) {
    var self = this;

    BaseCollection.fn.init.call(self, models, this.model);

    if( this.comparator )  this.sort(this.comparator)

    this.on('change', function(){
        if( this.comparator ) this.sort(this.comparator)   
    });
}

_.extend(Collection.prototype, {

    model: require('./model'),

    shouldSerialize: function (name) {
        return BaseCollection.fn.shouldSerialize.call(this, name)
            && name !== 'url'
    },

    sort: function(comparer){
       sort.call(this, comparer)     
    },

    add: function (model) {
        if (!(model instanceof this.model))
            model = new this.model(model)

        if (this.get(model.id)) return

        this.push(model)
    },

    remove: function (model) {
        if (!(model instanceof this.model))
            model = new this.model(model)

        this.remove(this.get(model.id))
    },

    get: function (id) {
        return _.find(this, { id: id})
    },

    getByUid: function (uid) {
        return _.find(this, { uid: uid })
    },

    url: function() {
        var base =
            _.result(this, 'urlRoot') ||
            _.result(this.parent(), 'url') ||
            urlError();

        if (this.isNew()) return base;
        return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
    },

    fetch: function (options) {
        var self = this;

        return self.sync('read', self, options)
            .then(function (data) {
                self.length = 0;
                self.push.apply(self, data)
                self.trigger('read', { options: options });
            });
    },

    sync: function(action, model, options) {
        return sync.call(this, action, model, options)
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
    }
 
})