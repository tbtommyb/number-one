$(function(){

    'use strict';
    var Record = Backbone.Model.extend({
        defaults: {
            artist: '',
            title: ''
        },
    });

    var RecordCollection = Backbone.Collection.extend({
        model: Record,
        url: 'http://localhost:9000/api/records'
    });

    var AppView = Backbone.View.extend({
        el: '#main',
        initialize: function () {
            this.$record = this.$('#record');

            this.listenTo(userCollection, 'change', this.render);
        },
        render: function (model){
            var childRecordView = new RecordView({model: model});
            childRecordView.render();
            this.$record.append(childRecordView.el);
        }
    });

    var RecordView = Backbone.View.extend({
        type: 'RecordView',
        template: _.template('<h3><%= artist %> : <%= title %></h3>'),
        tagName: 'div',
        className: 'recordRow',
        events: {
            'submit #dateEntry': 'submit'
        },
        initialize: function () {
            console.log('debugging ' + this.model.toJSON());
            this.listenTo(this.model, 'change', this.render);
        },
        render: function () {
            var renderedContent = this.model.toJSON();
            this.$el.html(this.template(renderedContent));
            return this;
        },
        /*submit: function(e) {
            e.preventDefault();
            var userBirthday = ($('#dateEntry').serializeArray())[0].value;
            var userModel = new Record({id: userBirthday}, {collection: userCollection});
            userModel.fetch({success: function(model, response, options) {
                userCollection.add(model);
            }});
        }*/

    });
    var userRecord = new Record({id: '1976-04-02'});
    var userCollection = new RecordCollection([userRecord]);
    var userView = new AppView({collection: userCollection});
    userRecord.fetch();
    userView.render();
    console.log(userRecord);
    //userCollection.on('add', function(record){
    //    userView.model = record;
    //    userView.render();
    //});
});
