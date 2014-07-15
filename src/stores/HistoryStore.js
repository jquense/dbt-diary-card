var Stores = require('react-flow').Stores
  , listenFor = Stores.listenFor
  , DataMixin = Stores.DataHelperStoreMixin
  , _ = require('lodash');


module.exports = new Stores.StoreFactory({

	include: DataMixin,

	references: [ 'dal' ],

	getInitialData: function(options){
		return {
			histories: [],
			loading: false
		}
	},

	actions: [

		listenFor('app_start', function(name){
			var self = this
			  , dal = this.stores.dal;

			dal.all('History').then(function(histories){
				self._set('histories', histories)
			})
		}),

		// datahelpers.listenForModel('History', 'saved', function(){
		// 	this._set('loading', false)
		// }),

		// datahelpers.listenForModel('History', 'saving', function(){
		// 	this._set('loading', true)
		// })
	]
})

