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

    var AppView = Backbone.View.extend({

        el: '#main',

        initialize: function () {

        },
    })

    var RecordView = Backbone.View.extend({

        type: 'RecordView',

        template: _.template('<h3><%= artist %> : <%= title %></h3>'),

        tagName: 'div',

        className: 'recordRow',

        events: {
            'submit #dateEntry': 'submit'
        },

        initialize: function () {
            this.model.on('sync', this.render, this);
        },

        render: function () {
            var renderedContent = this.model.toJSON();
            this.$el.html(this.template(renderedContent));
            return this;
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
    var userCollection = new RecordCollection([userRecord]);
    var userView = new RecordView({model: userRecord});
    userRecord.fetch();
    $('#main').append(userView.render);
    //userCollection.on('add', function(record){
    //    userView.model = record;
    //    userView.render();
    //});
});
