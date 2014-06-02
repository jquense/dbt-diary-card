
var _ = require('lodash')
  , Model = require('../models/client/diary-form')
  , View = require('./view');

module.exports = View.extend({

    model: Model.extend({
        
        fields: {
            needsSubmit: { type: 'boolean', virtual: true },   
            submitText:  { type: 'string',  virtual: true },  
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

    submit: function(e){
        var self = this;

        this.model.set('submitted', true)

        this.save(e)
            .then(function(){
                self.model.set('needsSubmit', false)
            }) 
    },

    unsubmit: function(e){
        var self = this;

        this.model.set('submitted', false)
        this.save(e).then(function(){
            self.model.set('needsSubmit', true)
        })
    },

    ready: function () {
        var self = this;

        self.model.on('change', computed)
        computed();
        function computed(){
            var submitted = self.model.get('submitted');

            self.model.set('needsSubmit'
                , !submitted || submitted && self.model.dirty  )

            self.model.set('submitText'
                , submitted && self.model.dirty ? 'Resubmit' : 'Submit'  )
            
        }
    }
});