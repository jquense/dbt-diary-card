
var _ = require('lodash')
  , Model = require('../models/client/model')
  , Diary = require('./diary')
  , View = require('./view');

var Handlebars = require('hbsfy/runtime')

module.exports = View.extend({

    el: 'body',

    template: require('../../views/diary.hbs'),

    model: Model.extend({
        urlRoot: '/api/diary'    
    }),

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
          , days = self.model.get('diaries');

        self.days = self.$el
            .find('.tab-content > .tab-pane')
            .map(function(idx){
                var day = new Diary({
                    el: $(this),
                    model: days[idx]   
                });

                day.render()

                return day
            })
            .get()
    }
});