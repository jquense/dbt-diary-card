var Model = require('./model');

module.exports = Model.extend({
    idAttribute: '_id',
    urlRoot: 'api/diary', 
})