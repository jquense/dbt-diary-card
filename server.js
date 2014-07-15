var express = require('express')
  , _ = require('lodash')
  , app = express()
  , mongoose = require('mongoose');


if (process.env.NODE_ENV === 'development') 
  app.use(require('errorhandler')())

app.use(require('serve-static')(__dirname + '/public'))
app.use(require('body-parser')())

require('./src/routing/routes')(app)

app.get('*', function (req, res){
	console.log('hi')
    res.sendfile(__dirname + '/public/index.html'); 
})

mongoose.connect("mongodb://localhost/dbtDiary")

app.listen(80)