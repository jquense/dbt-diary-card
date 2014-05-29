var _ = require('lodash')
  , moment = require('moment')
  , Diary = require('./models/diary')
  , format = require('util').format;

 
module.exports = function(app){

    
    app.get('/api/diary', function (req, res, next){
        var start = req.query.week || new Date()
          , end;

        start = moment(start).startOf('week');

        Diary.find({ week: start.week(), year: start.year() }
            , function(err, models){
                if (err) return next(err)

                var diaries = fillDiaries(start, models);

                res.json({
                    week: start.format('MMM DD'),
                    diaries: diaries
                });
            })
    })

    app.get('/api/diary/:id', function (req, res, next){
        Diary.findById(req.params.id, function(err, diary){
            if ( err) return next(err)

            res.json(diary.toJSON())
        })
    })


    app.post('/api/diary', save)
    app.put('/api/diary/:id', save)
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

    app.get('*', function (req, res){
        res.render('index', {layout: false})    
    })
}


function fillDiaries(start, models){
    var date = start.clone();

    return _.map(_.range(1,8), function(){
        var model = _.find(models, function(m){
            return date.isSame(m.date, 'date');
        }) || new Diary({ date: date });

        date = date.add('d', 1);

        return model; 
    })
}