$(function(){

    'use strict';

    var Record = Backbone.Model.extend({

        defaults: {
            artist: '',
            title: ''
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

        el: '#main',

        events: {
            'submit #dateEntry': 'submit'
        },

        initialize: function () {
            this.model.on('sync', this.render, this);
        },

        render: function () {
            var renderedContent = this.model.toJSON();
            this.$el.append(this.template(renderedContent));
        },

        submit: function(e) {
            e.preventDefault();
            var userBirthday = ($('#dateEntry').serializeArray())[0].value;
            var userModel = new Record({id: userBirthday}, {collection: userCollection});
            userModel.fetch({success: function(model, response, options) {
                userCollection.add(model);
            }});
        }

    });
    var userRecord = new Record({id: '1976-04-02'});
    var userView = new RecordView({model: userRecord});
    var userCollection = new RecordCollection([userRecord]);
    userRecord.fetch();
    userCollection.on('add', function(record){
        userView.model = record;
        userView.render();
    });
});
