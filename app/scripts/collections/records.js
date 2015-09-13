/*global NumberOne, Backbone*/

NumberOne.Collections = NumberOne.Collections || {};

(function () {
    'use strict';

    NumberOne.Collections.Records = Backbone.Collection.extend({

        model: NumberOne.Models.Records

    });

})();
