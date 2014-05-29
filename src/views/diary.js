
var _ = require('lodash')
  , View = require('./view');

module.exports = View.extend({

    model: require('../models/client/model').extend({
        idAttribute: '_id',
        urlRoot: 'api/diary',
        defaults: {
            submitText: function(){
                this._model 
            }
        }   
    }),

    template: require('../../views/diaryForm.hbs'),

    events: {
        'click .btn-save': 'save',   
        'click .btn-submit': 'submit',
        'click .btn-unsubmit': 'unsubmit' 
    },

    save: function(e){
        var $btn = $(e.target);

        $btn.button('loading')

        return this.model.save()  
            .finally(function(){
                $btn.button('reset')
            })     
    },

    _data: function(){
        var submitted = this.model.get('submitted')

        return _.extend(this.model.toJSON(), {
            submitText: submitted && this.model.dirty ? 'Resubmit' : 'Submit'  
        })
    },

    submit: function(e){
        this.model.set('submitted', true)
        this.save(e)       
    },

    unsubmit: function(e){
        this.model.set('submitted', false)
        this.save(e)
    },

    ready: function () {
        var self = this;

        this.model.on('change', function () {
            self.model.set('submitted', false)
        })
    }
});