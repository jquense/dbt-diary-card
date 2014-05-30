
var _ = require('lodash')
  , Model = require('../models/client/diary-form')
  , View = require('./view');

module.exports = View.extend({

    model: Model.extend({
              
        set: function(field, value){

            self.model.set('needsSubmit', !self.model.get('submitted') || self.model.get('submitted') && self.model.get('dirty'))
            self.model.set('submitText', self.model.get('submitted') && self.model.get('dirty') 
                ? 'Resubmit'
                : 'Submit')
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
        this._preventChange = true;
        this.model.set('submitted', true)
        this.save(e)  
        this._preventChange = false;     
    },

    unsubmit: function(e){
        this.model.set('submitted', false)
        this.save(e)
    },

    ready: function () {
        var self = this;

        self.model.on('change', computed)
        computed();
        function computed(){
            
        }
    }
});