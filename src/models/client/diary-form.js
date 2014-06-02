var Model = require('./model');

module.exports = Model.extend({
    idField: '_id',
    urlRoot: '/api/diary', 

    shouldSerialize: function(field){
        return Model.prototype.shouldSerialize.call(this, field) 
            && (field !== this.idField || (field === this.idField  && !this.isNew()))
    },

    isNew: function(){
        return !this.started    
    }
})