/*global NumberOne, $*/


window.NumberOne = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        var recordList = new NumberOne.Collections.Records();
        recordList.reset();
        var recordView = new NumberOne.Views.Record({
            collection: recordList
        });
        //new this.Views.Record;
    }
};

$(document).ready(function () {
    'use strict';
    NumberOne.init();
});
