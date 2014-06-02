var _ = require('lodash')
  , moment = require('moment')
  , Diary = require('../models/diary')
  , Day = require('../models/day')
  , format = require('util').format;

 
module.exports = function(app){

    
    app.get('/api/diary/:date', function (req, res, next){
        var start = req.params.date
          , week, match;

        week = moment(start).startOf('week').toDate();
        match = { date: week };

        Diary.findOne(match, function(err, week){
            if (err) return next(err)

            if (!week) 
                week = new Diary(match);

            var vm = week.toJSON();

            res.json(vm);          
        })
    })

    app.post('/api/diary', save)
    app.put('/api/diary/:date', save)
        function save(req, res, next){
            var model = new Diary(req.body)
              , data = _.omit(model.toObject(), '_id');
        
            Diary.findOneAndUpdate(
                  { date: model.date }
                , data, { upsert: true }
                , function(err, arg ){
                    if (err) return next(err)

                    res.json(arg)
                })
        }

    app.get('/api/diary', function (req, res, next){
        var count = (res.query && res.query.weeks) || 10
          , week = moment().subtract('w', count - 1).startOf('week');

        Diary.find({ date: { $gte: week.toDate() } })
            .exec(function (err, data) {
                if (err) return next(err);
                
                data = fillDiaries(week, count, data)
                res.json(_.map(data, function(m){
                    m.days = _.pluck(m.days, function(m){ 
                        return _.pick(m, 'date', 'started') 
                    })

                    return m    
                }))
            });
    })

    app.get('*', function (req, res){
        res.render('index', {layout: false})    
    })
}

function fillDiaries(date, count, weeks){

    return _.map(_.range(0, count), function(){
        var model = _.find(weeks, function(m){
            return date.isSame(m.date, 'date');
        }) || new Diary({ _id: null, date: date });

        date = date.clone().add('w', 1);

        return model.toJSON(); 
    })
}