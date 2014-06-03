
var _ = require('lodash')
  , moment = require('moment')
  , util = require('../lib/util')
  , dialog = require('../lib/dialog')
  , Promise = require('bluebird')
  , Backbone = require('backbone')
  , Day = require('./day')
  , View = require('./view');

var Handlebars = require('hbsfy/runtime')

module.exports = View.extend({

    el: 'body',

    template: require('../../views/diary.hbs'),

    model: require('../models/client/diary'),

    events: {
        'click .btn-save': 'save', 
        'click .btn-submit': 'submit',
        'click .btn-unsubmit': 'unsubmit' 
    },

    ready: function () {
        var self = this;

        this._days()

        this.notify = new kendo.ui.Notification($('<span/>'), {
            appendTo: this.$('.navbar-fixed-bottom .message-area'),
            button: true,
            autoHideAfter: 6000,
            stacking: 'up',
        })

        this.model.on('change:submitted', function(){
            var submitted = this.get('submitted');

            _.each(self.days, function(day){
                day.readonly(!submitted);
            })
        })

        this.weekpicker = this.$el.find('input.week-picker')
            .getKendoDatePicker()
            .bind('change', function () {
                var val = this.value()
                  , date = moment(val).clone()

                if (!this._preventChange){
                    this._preventChange = true
                    this.value(util.startOf('w', val))
                    Backbone.history.navigate('/diary/' + date.format('MMM-DD-YY'), true)
                }

                this._preventChange = false
            }) 
    },

    save: function(e){
        var notify = this.notify
          , $btn = $(e.target);

        $btn.button('loading')

        return this.model.save()
            .finally(function(){
                notify.success('Diary saved.')
                $btn.button('reset')    
            }) 
    },

    submit: function(e){
        var self = this;
        
        if ( _.all(this.model.get('days'), 'started') ) {
            this.model.set('submitted', true)
            this.save(e)
        } else 
            dialog.alert({ 
                title: 'Missing information',
                message: '<p>It looks like you haven\'t finished this week. Make sure to fill out each day before submitting.</p>'
                    + '<p>You can save and continue working on this diary later by clicking on the <strong>Save and continue later</strong> button</p>',
            })
    },

    unsubmit: function(e){
        var self = this;

        this.model.set('submitted', false)
    },

    changeWeek: function (date) {
        var self = this
          , firstOfWeek = moment(date).startOf('week');

        date = moment(date);

        if ( !this.bound || !firstOfWeek.isSame(this.model.get('date'), 'date') )
            if( _.any(this.days, function(d){ return d.model.dirty }))
                self.warn().then(function(cont){
                    if (cont) get()
                })
            else
                get();
        else
            select()

        function get(){
            self.model.set('date', firstOfWeek.toDate());
            self.fetch().then(select)
        }

        function select(){
            var idx = _.findIndex(self.model.get('days'), function(d){ return date.isSame(d.date) });
            if (~idx) 
                self.$('ul.nav-pills')
                    .each(function(){
                        $(this).find('a[data-toggle=pill]:eq(' + idx +')').tab('show');
                    })
        }
    },

    warn: function(){
        var self = this;

        return dialog.confirm({ 
                message: 'You have unsaved changes.',
                confirm: { label: 'Continue without saving', classes: 'btn btn-link'},
                cancel:  { label: 'Stay on page', classes: 'btn btn-primary'} 
            })
    },

    _days: function () {
        var self = this
          , submitted = self.model.get('submitted')
          , days = self.model.get('days').toJSON();

        self.days = self.$el
            .find('.tab-content > .tab-pane')
            .map(function(idx){
                var day = new Day({
                    el: $(this),
                    model: days[idx]
                });

                day.model
                    .on('change', function(e){
                        self.model.get('days')[idx].set(e.field, this.get(e.field))
                    })


                day.render()
                day.readonly(!submitted)
                return day;
            })
            .get()
    }

});