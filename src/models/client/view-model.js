"use strict"
var _ = require('lodash')
  , BaseObject = kendo.data.ObservableObject
  , inherits = require('util').inherits;

module.exports = ViewModel;

inherits(ViewModel, BaseObject);

function ViewModel(data) {
    var self = this;

    BaseObject.fn.init.call(this, data)  
}

ViewModel.prototype.get = function (field) {
    value = BaseObject.fn.get.call(this, field)

    if (this.model && value === undefined)
        return this.model.get(field)

    return value
};
