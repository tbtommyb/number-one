$(function(){

    'use strict';

    var Record = Backbone.Model.extend({

        defaults: {
            artist: '',
            title: ''
        }
    });

    var RecordCollection = Backbone.Collection.extend({

        model: Record,

        url: 'http://localhost:9000/api/records'

    });

    var userCollection = new RecordCollection();

    var AppView = Backbone.View.extend({

        el: '#main',

        events: {
            'submit #dateEntry': 'submit'
        },

        initialize: function() {
            _.bindAll(this, 'render');
            this.$record = this.$('#record');
        },

        render: function(record){
            var view = new RecordView({model: record});
        },

        submit: function(e) {
            e.preventDefault();
            var userBirthday = ($('#dateEntry').serializeArray())[0].value;
            var userModel = new Record({id: userBirthday}, {collection: userCollection});
            var that = this;
            userModel.fetch({success: function(model, response, options) {
                var view = new RecordView({model: model});
                that.$record.html(view.render().el);
            }});
        }
    })

    var RecordView = Backbone.View.extend({

        tagName: 'p',

        template: _.template('<%= artist %> : <%= title %>'),

        initialize: function () {
            this.model.on('sync', this.render, this);
        },

        render: function () {
            var renderedContent = this.model.toJSON();
            this.$el.html(this.template(renderedContent));
            return this;
        }

    });
    var userView = new AppView();
});
