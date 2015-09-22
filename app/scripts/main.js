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
        url: 'http://localhost:9000/api/records'
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

        /*createVideoSearch: function(model) {
            var artist = model.get('artist').split(' ').join('%2B');
            var title = model.get('title').split(' ').join('%2B');
            var query = artist + '%2B' + title;
            var userVideo = new Video({q: query});
            var that = this;
            console.log(userVideo);
            userVideo.fetch({success: function(videoModel, response, options){
                console.log(response);

                //console.log(videoModel.toJSON().items[0].id.videoId);
            }});
        },*/

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

    /*var VideoView = Backbone.View.extend({

        initialize: function() {
            this.player = new window.YT.Player('player', {
                videoId: this.model.videoId
            })
        }
    });*/

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
/*
var tag = document.createElement('script'); 
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    youtubePlayer = new VideoView({el: '#youtube', collection: userVideoCollection});
}
*/