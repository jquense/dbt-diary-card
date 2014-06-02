
var Promise = require('bluebird')
  , _ = require('lodash')
  , template = _.template('<div class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">'
                    +'<div class=\"modal-dialog modal-sm\">'
                        +'<div class=\"modal-content  <%= classes %>\">'
                            +'<div class="modal-header">'
                                +'<% if ( closeButton ) { %>'
                                    +'<button type="button" class="close" data-action="cancel" data-dismiss="modal" aria-hidden="true">&times;</button>'
                                +'<% } %>'
                                +'<% if ( title ) { %>'
                                    +'<h4 class="modal-title"><%= title %></h4>'
                                +'<% } %>'
                            +'</div>'
                            +'<div class="modal-body"></div>'
                            +'<% if ( buttons.length ) { %>'
                                +'<div class="modal-footer">'
                                    +'<% _.each(buttons, function(btn) { %>'
                                        +'<button type="button" class="<%= btn.classes %>" data-action="<%= btn.action %>"><%= btn.label %></button>'
                                    +'<% }) %>'
                                +'</div>'
                            +'<% } %>'
                        +'</div>'
                    +'</div>'
                +'</div>');

module.exports = Dialog

var defaults = {
    classes: '',
    buttons: [],
    title: '',
    closeButton: true
}

function Dialog(options){
    this.html = template(_.defaults(options, defaults));
    this.options = options
    this._content = options.content

    this.show();
}


Dialog.prototype = {
    
    hide: function(){
        this.$modal.modal('hide');
    },

    show: function(){
        var self = this
          , options = this.options
          , $modal = $(self.html).appendTo('body')
          
        $modal.find('.modal-body')
            .html(self._content)

        $modal.modal(options)
            .off('click.dismiss.modal', '[data-dismiss="modal"]')
            .on('click', '[data-action]', function(){
                $modal.trigger('modalAction', this.getAttribute('data-action') )  
            })
            .on('hidden.bs.modal', function(){
                $modal.remove(); 
            });

        self.$modal = $modal;
    }   
}

Dialog.alert = function(options){

    return new Promise(function(resolve, reject){
        var dialog = new Dialog({
            title: options.title,
            content: options.message,
            backdrop: 'static',
            closeButton: false,
            buttons: [
                 btn(options.confirm, { label: 'Ok', classes: 'btn btn-primary',  action: 'accept' })
            ]    
        })

        dialog.$modal
            .on('modalAction', function(e, action){
                dialog.hide();
            })
    })

}


Dialog.confirm = function (options) {

    return new Promise(function (resolve, reject) {
        var confirm = typeof options.confirm === 'string'
          , dialog = new Dialog({
            title: options.title,
            content: options.message,
            backdrop: 'static',
            closeButton: false,
            buttons: [
                btn(options.confirm, { label: 'Yes' , classes: 'btn btn-primary' }, 'accept' ),
                btn(options.cancel, { label: 'No', classes: 'btn btn-link' }, 'cancel' )
            ]
        })

        dialog.$modal
            .on('modalAction', function (e, action) {
                if (action === 'cancel') resolve(false)
                else if (action === 'accept') resolve(true)
                else reject(action)

                dialog.hide();
            })
    })

}

function btn(btn, defaults, action) {
    if ( typeof btn === 'string')
        btn = { label: btn }

    return _.extend({}, defaults, btn, { action: action });
}