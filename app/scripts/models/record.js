/*global NumberOne, Backbone*/

NumberOne.Models = NumberOne.Models || {};

(function () {
    'use strict';

    NumberOne.Models.Record = Backbone.Model.extend({

        url: '',

        initialize: function() {
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

})();
