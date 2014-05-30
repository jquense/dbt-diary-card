
var _ = require('lodash')
  , Diary = require('./diary')
  , View = require('./view');

var Handlebars = require('hbsfy/runtime')

module.exports = View.extend({

    el: 'body',

    template: require('../../views/diary.hbs'),

    model: require('../models/client/diary-form'),

    ready: function () {
        var self = this;

        this._days()

        this.weekpicker = this.$el.find('input.week-picker')
            .getKendoDatePicker()
            .bind('change', function () {
                self.changeWeek(this.value())
            }) 
    },

    changeWeek: function (date) {
        var self = this;
    },

    _days: function () {
        var self = this
          , days = self.model.get('diaries').toJSON();

        self.days = self.$el
            .find('.tab-content > .tab-pane')
            .map(function(idx){
                var day = new Diary({
                        el: $(this),
                        model: days[idx]
                    });
                day.render()
                return day.model
                    .on('change:submitted', function(e){
                        self.model.get('diaries')[0].set('submitted', this.get('submitted'))
                    });
            })
            .get()
    }
});