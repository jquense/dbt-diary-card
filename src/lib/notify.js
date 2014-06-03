
var Promise = require('bluebird')
  , _ = require('lodash')
  , moment = require('moment')
  , kendo

function Notify(options) {
    this._element = $('<span></span>');
    this._notification = this._element.kendoNotification(options);
}

Notify.prototype = {
    show: {
        this._notification.show
    },

    destroy: function () {
        this._notification.destory();
        this._element.remove();
    }
}

module.exports = {
    success: function () {

    }
}