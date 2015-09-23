$(function(){

    'use strict';

    var Record = Backbone.Model.extend({

        defaults: {
            artist: '',
            title: ''
        }
    });

    var Video = Backbone.Model.extend({

        defaults: {
            part: 'snippet',
            q: '',
            type: 'video',
            videoEmbeddable: 'true',
            maxResults: '1',
            key: 'AIzaSyA5UichqO_WSK22RMjGqWhmz-GvRQK9Szg'
        },

        url: function() {
            return 'https://www.googleapis.com/youtube/v3/search?part=' + 
                this.defaults.part + '&type=' + this.defaults.type + 
                '&videoEmbeddable=' + this.defaults.videoEmbeddable + 
                '&key=' + this.defaults.key + '&q=' + this.defaults.q + 
                '&maxResults=' + this.defaults.maxResults;
        }
    });

    var RecordCollection = Backbone.Collection.extend({

        model: Record,
        url: 'https://number-oneapp.herokuapp.com/api/records'
    });

    var VideoCollection = Backbone.Collection.extend({

        model: Video
    });

    var userCollection = new RecordCollection();
    var userVideoCollection = new VideoCollection();

    var AppView = Backbone.View.extend({

        el: '#main',

        events: {
            'submit #dateEntry': 'submit',
        },

        initialize: function() {
            this.$record = this.$('#record');
        },

        render: function(record){
            var view = new RecordView({model: record});
            this.$record.html(view.render().el);
            return this;
        },

        submit: function(e) {
            e.preventDefault();
            var userBirthday = ($('#dateEntry').serializeArray())[0].value;
            var userModel = new Record({id: userBirthday}, {collection: userCollection});
            var that = this;
            userModel.fetch({success: function(model, response, options) {
                that.render(model);
            }});
        }
    });

    var RecordView = Backbone.View.extend({

        tagName: 'h2',

        template: _.template('<%= artist %>: <%= title %>'),

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

$(function(){
    $('#date').combodate({
        minYear: 1952,
        format: 'YYYY-MM-DD'
    });
});