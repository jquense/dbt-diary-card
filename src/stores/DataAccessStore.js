var Flow = require('react-flow')
  , listenFor = Flow.defineStore.listenFor
  , Url = require('url')
  , Promise = require('bluebird')
  , _ = require('lodash')
  , appConstants = require('../constants/appConstants');

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

	adaptor: function(){

    }
})

