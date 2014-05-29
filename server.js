var Handlebars = require("hbsfy/runtime")
  , express = require('express')
  , _ = require('lodash')
  , app = express()
  , expressHbs = require('express3-handlebars')
  , mongoose = require('mongoose');

var hbs = expressHbs.create({ 
    extname:'.hbs'
});

app.engine('hbs', hbs.engine);

if (process.env.NODE_ENV === 'development') 
  app.use(require('errorhandler')())

app.use(require('serve-static')(__dirname + '/public'))
app.use(require('body-parser')())
app.set('view engine', 'hbs')

require('./src/routes')(app)

mongoose.connect("mongodb://localhost/dbtDiary")

mongoose.connection
    .on('open', function(){
        
    })


app.listen(80)