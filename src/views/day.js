
var _ = require('lodash')
  , Model = require('../models/client/diary-form')
  , View = require('./view');

module.exports = View.extend({

    model: Model,

    template: require('../../views/diaryForm.hbs'),

    ready: function () {
        var self = this;

        this.model.on('change', function(e){
            if ( this.isNew() && e.field !== 'started') 
                this.set('started', this.dirty);
        })
    }
});