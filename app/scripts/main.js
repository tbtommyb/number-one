$(function(){

    'use strict';

    var Record = Backbone.Model.extend({

        defaults: {
        },

        parse: function(response, options)  {
            return response;
        }
    });

    var RecordCollection = Backbone.Collection.extend({

        model: Record,

        url: 'http://localhost:9000/api/records'

    });

    var RecordView = Backbone.View.extend({

        template: _.template('<h3><%= artist %> : <%= title %></h3>'),

        el: '#record',

        initialize: function () {
            this.model.on('sync', this.render, this);
        },

        render: function () {
            var renderedContent = this.model.toJSON();
            this.$el.html(this.template(renderedContent));
        }

    });

    var userRecord = new Record({id: '2006-09-02'});
    var userView = new RecordView({model: userRecord});
    var userCollection = new RecordCollection([userRecord]);
    userRecord.fetch();
});
