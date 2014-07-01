var _ = require('lodash');

module.exports = Registry

function Registry (parent){
	this.resolver = parent.resolver || _.noop
	this.registry = {}
	this.cache = {}
	
	this._typeOptions = {}

	this._typeInjections = {}
	this._innjections = {}
}


Registry.prototype = {

	get: function(name){
		var options = this.registry[name]
		  , factory = this.resolver.resolve(name)
		  , inst;

	  	if (!options) throw new TypeError

  		if( _.has(this.cache, name) && options.singleton !== false)
  			return this.cache[name]

  		inst = new factory()
	},

	register: function(name, Factory, options){
		this.registry[name] = options
	},

	inject: function(name, prop, target){
		var isForType = !_.contains(name, ':')

		if ( isForType)
			addOrPush(this._typeInjections, name, { prop: prop, name: target })
		else
			addOrPush(this._typeInjections, name, { prop: prop, name: target })
	},

	optionsForType: function(type, options){
		this._typeOptions[type] = _.extend(this._typeOptions[type] || {}, options)
	}
}

function addOrPush(obj, key, val){
	var existing = obj[key]

	obj[key] = existing 
		? [].concat(existing, val) 
		: [].concat(val)
}