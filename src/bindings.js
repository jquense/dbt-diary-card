var _ = require('lodash')
  , moment = require('moment')
  , Backbone = require('backbone')
  , Binder = kendo.data.Binder
  , binders = kendo.data.binders
  , ObservableArray = kendo.data.ObservableArray;


    binders['class'] = Binder.extend({
        init: function (target, bindings, options) {
            Binder.fn.init.call(this, target, bindings, options);

            this._lookups = _.pairs(this.bindings.class.path)
        },
        refresh: function(key) {
            var self = this
              , element = $(this.element);

            _.each(this._lookups, function(pair){
                self.bindings.class.path = pair[1];

                value = self.bindings.class.get();

                element.toggleClass(pair[0], !!value);
            })   
        }
    })

  binders['with'] = Binder.extend({
        init: function(element, bindings, options) {
            Binder.fn.init.call(this, element, bindings, options);

            var source = this.bindings['with'].get();
        },

        refresh: function(e) {
            var self = this
              , source = self.bindings.source.get();

            if (source instanceof ObservableArray) {
                e = e || {};

                if (e.action == "add") 
                    self.add(e.index, e.items);
                else if (e.action == "remove") 
                    self.remove(e.index, e.items);
                else if (e.action != "itemchange")
                    self.render();
                
            } else 
                self.render();            
        },

        add: function(index, items) {
            var element = this.container(),
                parents,
                idx,
                length,
                child,
                clone = element.cloneNode(false),
                reference = element.children[index];

            $(clone).html(kendo.render(this.template(), items));

            if (clone.children.length) {
                parents = this.bindings.source._parents();

                for (idx = 0, length = items.length; idx < length; idx++) {
                    child = clone.children[0];
                    element.insertBefore(child, reference || null);
                    bindElement(child, items[idx], this.options.roles, [items[idx]].concat(parents));
                }
            }
        },

        remove: function(index, items) {
            var idx, element = this.container();

            for (idx = 0; idx < items.length; idx++) {
                var child = element.children[index];
                unbindElementTree(child);
                element.removeChild(child);
            }
        },

        render: function() {
            var source = this.bindings.source.get(),
                parents,
                idx,
                length,
                element = this.container(),
                template = this.template();

            if (source instanceof kendo.data.DataSource) {
                source = source.view();
            }

            if (!(source instanceof ObservableArray) && toString.call(source) !== "[object Array]") {
                source = [source];
            }

            if (this.bindings.template) {
                unbindElementChildren(element);

                $(element).html(this.bindings.template.render(source));

                if (element.children.length) {
                    parents = this.bindings.source._parents();

                    for (idx = 0, length = source.length; idx < length; idx++) {
                        bindElement(element.children[idx], source[idx], this.options.roles, [source[idx]].concat(parents));
                    }
                }
            }
            else {
                $(element).html(kendo.render(template, source));
            }
        }
    });