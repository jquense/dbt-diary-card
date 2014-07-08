var Flow = require('react-flow')
  , listenFor = Flow.defineStore.listenFor
  , DataMixin = Flow.DataHelperStoreMixin
  , _ = require('lodash');


module.exports = Flow.defineStore({

	mixins: [ DataMixin ],

	refs: [ 'dal', 'appState' ],

	getInitialData: function(options){
		return {
			histories: [],
			loading: false
		}
	},

	actions: [

		listenFor('app_start', function(name){
			var self = this
			  , dal = this.refs.dal;

			dal.all('History').then(function(histories){
				self._set('histories', histories)
			})
		}),

		datahelpers.listenForModel('History', 'saved', function(){
			this._set('loading', false)
		}),

		datahelpers.listenForModel('History', 'saving', function(){
			this._set('loading', true)
		})
	]
})

