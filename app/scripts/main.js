$(function(){

    'use strict';

    var Record = Backbone.Model.extend({

        initialize: function() {
        },

        defaults: {
            title: 'Hi',
            artist: 'There'
        },

        validate: function(attrs, options) {
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

        //template: _.template('<h3><%=artist %>: <%=title %></h3>'),

        el: '#record',

        className: '',

        events: {},

        initialize: function () {
            this.collection = new RecordCollection();
            this.collection.fetch({reset:true});
            this.render();

            this.listenTo(this.collection, 'change', this.render);
        },

        render: function () {
            var renderedContent = this.collection;
            console.log(renderedContent);
            this.$el.html(renderedContent);
        }

    });

    var testCollection = new RecordCollection();
    testCollection.reset();
    var testView = new RecordView({
        collection: testCollection
    });
});
