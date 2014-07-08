var Flow = require('react-flow')
  , Collection = Flow.Collection
  , listenFor = Flow.defineStore.listenFor
  , Url = require('url')
  , Promise = require('bluebird')
  , _ = require('lodash')
  , appConstants = require('../constants/appConstants')
  , typeMap = {};

module.exports = Flow.defineStore({

    mixins: [ Flow.DataHelperStoreMixin ],

    actions: [

        listenFor(appConstants.START, function(options){
            this._extend(options)
        }),

        listenFor('dal_register', function(key, type){

        }),

        listenFor('dal_model_save', function(key, type){
            
        })

    ],

    createRecord: function(type, data){
        var model = modelTypeFor(type)

        model = _.extend(new model, data)

        return model
    },

	find: function(type, id){
        var records = this.recordsFor(type)

        return records.get(id)
    },

    recordForId: function(type, id){
        var records = this.recordsFor(type);

        return records.get(id)
    },

    modelTypeFor: function(type){
        var record = this.container.factoryFor('model:' + type)

        record.__type__ = type;

        return record
    },

    recordsFor: function(type){
        var records = typeMap[type]

        return typeMap[type] = (records || collectionFor(this, type))
    },

    url: function(model){
        var url = model.urlRoot || model.__type__;


    }
})

function collectionFor(self, type){
    var model = self.modelTypeFor(type)
      , factory = self.container.factoryFor('collection:' + type);

    if ( !factory) 
        self.container.register('collection:' + type, Collection.of(model) )

    return self.container.resolve('collection:' + type)
}