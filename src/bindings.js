var _ = require('lodash')
  , moment = require('moment')
  , Backbone = require('backbone')
  , Binding = require('backbone.epoxy').binding;


Binding.addFilter('dateFormat', function (date, format) {
    return moment(date).format(format || 'MMM dd');

})

Binding.addHandler("value", {

    init: function ($element, value, bindings, context) {
        this.widget = kendo.widgetInstance($element);
        this.options = this.widget && this.widget.options;
    },

    get: function ($element, value, event) {
        return this.widget
            ? this.widget.value()
            : $element.val();
    },

    set: function ($element, value) {
        var val = this.widget ? this.widget.value() : $element.val();

        if (_.isEqual(val, value))
            return

        if (this.widget) {
            var field = this.options.dataValueField || this.options.dataTextField;

            if (value === undefined) value = null;

            if (field) {
                if (_.isArray(value) && _.isPlainObject(value[0]))
                    value = _.pluck(value, field);
                else if (_.isPlainObject(value))
                    value = value[field];
            }

            this.widget.value(value)

        } else 
            $element.val(value);
    }
})

