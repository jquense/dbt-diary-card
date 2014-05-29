
var _ = require('lodash')
  , View = require('./view');

module.exports = View.extend({

    model: require('backbone.epoxy').Model,

    template: require('../../views/diaryForm.hbs'),

    ready: function () {
        var self = this;

    },
});