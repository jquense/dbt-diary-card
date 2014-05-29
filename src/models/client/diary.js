
var _ = require('lodash')
  , Model = require('backbone')

specify = { 
	times: { type: Number, "default": 0 },
    specify: String
};

beforeAfter = { 
	before: { type: Number, min: 0, max: 5 },
    after:  { type: Number, min: 0, max: 5 },
};

diary = new dal.Schema({ 
    submitted: Boolean,

    date: { 
        type: Date, 
        set: function(date){
            var d = moment(date);

            this.dayOfWeek  = d.day();
            this.week       = d.week();
            this.year       = d.year();
            return date;
        }
    },

    dayOfWeek:  Number,
    week: Number,
    year: Number,
    

	use:      { type: Number, min: 0, max: 5, default: 0 },
    suicide:  { type: Number, min: 0, max: 5, default: 0 },
    selfHarm: { type: Number, min: 0, max: 5, default: 0 },
    pain:     { type: Number, min: 0, max: 5, default: 0 },
    sadness:  { type: Number, min: 0, max: 5, default: 0 },
    shame:    { type: Number, min: 0, max: 5, default: 0 },
    anger:    { type: Number, min: 0, max: 5, default: 0 },
    fear:     { type: Number, min: 0, max: 5, default: 0 },

    urgeToUse:  beforeAfter,
    urgeToQuit: beforeAfter,
    urgeToHarm: beforeAfter,

    beliefInEmotions:  beforeAfter,
    beliefInBehaviors: beforeAfter,
    beliefInThoughts:  beforeAfter,

    illicit: specify,
    otc: specify,
    prescription: specify,
    alcohol: specify,

    causedSelfHarm: Boolean,
    lying: Number,
    joy:    { type: Number, min: 0, max: 5, default: 0 },
    skills: { type: Number, min: 0, max: 7, default: 0 }

});

diary.index({ week: 1, year: -1 }, {unique: true})

diary.virtual('firstOfWeek').get(function () {
    return moment(this.date).startOf('week').toDate()
});

module.exports = dal.define('Diary', 'diaries', diary)
