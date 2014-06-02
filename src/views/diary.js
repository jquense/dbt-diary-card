
var _ = require('lodash')
  , moment = require('moment')
  , dialog = require('../lib/dialog')
  , Promise = require('bluebird')
  , Backbone = require('backbone')
  , Day = require('./day')
  , View = require('./view');

var Handlebars = require('hbsfy/runtime')

module.exports = View.extend({

    el: 'body',

    template: require('../../views/diary.hbs'),

    model: require('../models/client/model').extend({
        urlRoot: '/api/diary',

        week: function(){
            return moment(this.get('date')).week()
        },

        firstOfWeek: function(){
            return moment(this.get('date'))
                .startOf('week')
                .toDate()
        },

        fields: {
            date: 'date',
            diaries: [ require('../models/client/diary-form') ]
        }    
    }),

    events: {
        'click .btn-save': 'save', 
   //     'click a[data-toggle=pill]': '_tabs'
    },

    ready: function () {
        var self = this;

        this._days()

        this.weekpicker = this.$el.find('input.week-picker')
            .getKendoDatePicker()
            .bind('change', function () {
                Backbone.history.navigate('/diary?date=' + moment(this.value()).format('MMM-DD-YY'), true)
            }) 
    },

    save: function(e){
        var $btn = $(e.target);

        $btn.button('loading')

        return Promise.map(this.days, function(day){
            return day.model.dirty && day.model.save()    
        }).finally(function(){
            $btn.button('reset')    
        }) 
    },

    changeWeek: function (date) {
        var self = this
          , week = moment(date).week();

        if ( !this.bound || this.model.week() !== week )
            if( _.any(this.days, function(d){ return d.model.dirty }))
                self.warn().then(function(cont){
                    if (cont) get()
                })
            else
                get();

        function get(){
            self.fetch({ data: { date: date} })
                .then(function(){
                    var idx = _.findIndex(self.model.get('diaries'), function(d){ return moment(d.date).isSame(date)});

                    if (~idx) self.$('a[data-toggle=pill]:eq(' + idx +')').tab('show');
                })
        }
    },

    _tabs: function (e) {
        var self = this
          , tab = self.$('.nav-pills li.active a')
          , idx = $(tab).parent().index()
          , day = this.days[idx];

        if(tab[0] === e.target) return false;

        if ( day.model.dirty && !self._preventCheck ) {
            e.preventDefault()
            e.stopPropagation()

            return dialog.confirm({ 
                    message: 'You have unsaved changes.',
                    confirm: { label: 'Continue without saving', classes: 'btn btn-link'},
                    cancel: { label: 'Stay on page', classes: 'btn btn-primary'} 
                })
                .then(function(accepted){
                    if( accepted )  {
                         self._preventCheck = true
                         $(e.target).tab('show')
                    }  
                })
        }

        self._preventCheck = false
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
          , days = self.model.get('diaries').toJSON();

        self.days = self.$el
        .find('.tab-content > .tab-pane')
            .map(function(idx){
                var day = new Day({
                    el: $(this),
                    model: days[idx]
                });

                day.render()

                day.model
                    .on('change:submitted', function(e){
                        self.model.get('diaries')[idx].set('submitted', this.get('submitted'))
                    });

                return day;
            })
            .get()
    }
});