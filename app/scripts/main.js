$(function(){

    'use strict';

    var Record = Backbone.Model.extend({

        defaults: {
            artist: '',
            title: '',
            videoId: ''
        },
        initialize: function () {
            userCollection.add(this);
            var that = this;
            this.fetch({success: function(model, response, options) {
                that.getVideoId();
            }});
        },
        // query youtube api for ID of first result for artist-title search
        // called when model successfully fetched
        // calls to RecordView which passes to AppView to render.
        getVideoId: function() {
            var that = this;
            var queryString = this.get('artist') + "+" + 
                this.get('title');
            
            $.ajax({
                url: 'https://www.googleapis.com/youtube/v3/search',
                data: {part: 'snippet',
                       type: 'video',
                       videoEmbeddable: 'true',
                       maxResults: '1',
                       key: 'AIzaSyA5UichqO_WSK22RMjGqWhmz-GvRQK9Szg',
                       q: queryString},
                type: 'GET',
                success: function(data) {
                    that.set('videoId',data.items[0].id.videoId);
                }
            });
        }
    });

    var RecordCollection = Backbone.Collection.extend({

        model: Record,
        // link to REST database, queried with birthday date
        url: 'https://number-oneapp.herokuapp.com/api/records'
    });

    var userCollection = new RecordCollection();

    var AppView = Backbone.View.extend({

        el: '#main',

        events: {
            'submit #dateEntry': 'submit',
        },

        initialize: function() {
            this.$record = this.$('#record');
            this.listenTo(userCollection, 'sync', this.renderNewestModel);
        },

        renderNewestModel: function() {
            this.render(this.collection.last());
        },

        render: function(record){
            var view = new RecordView({model: record});
            this.$record.html($(view.render().el).hide().fadeIn());
        },

        submit: function(e) {
            // get birthday and query DB with value, get videoId on success
            e.preventDefault();
            var that = this;
            var userBirthday = ($('#dateEntry').serializeArray())[0].value;
            var userModel = new Record({id: userBirthday});
        },

        renderVideo: function(videoId) {
            // create player or cue new video, scroll down on load
            console.log('renderVideo called');
            var videoId = videoId;
            if (this.player) {
                this.player.cueVideoById(videoId);
            } else {
                console.log('in else branch');
                this.setupPlayer(videoId);
            }
            $('body').animate({scrollTop: $('body').height()}, 1000);
        },

        setupPlayer: function(videoId) {
            console.log('call setupPlayer');
            // Youtube iframe code
            var tag = document.createElement('script');
            var that = this;
            var videoId = videoId;

            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);            
            
            window.onYouTubeIframeAPIReady = function() {
                console.log('on ready');
                that.player = new YT.Player('playerYT', {
                    height: '366',
                    width: '600',
                    videoId: videoId
                });
            }   
        }
    });

    var RecordView = Backbone.View.extend({

        tagName: 'h2',

        className: 'recordResult',

        template: _.template('<%= artist %>: <%= title %>'),

        initialize: function () {
            this.model.on('change:videoId', this.callVideo, this);
        },

        callVideo: function() {
            // pass unique videoID to app-level player renderer
            console.log('callVideo called');
            userView.renderVideo(this.model.get('videoId'));
        },

        render: function () {
            var renderedContent = this.model.toJSON();
            this.$el.html(this.template(renderedContent));
            return this;
        }
    });

    var userView = new AppView({collection: userCollection});
});
// creates the drop down selection boxes
$(function(){
    $('#date').combodate({
        minYear: 1953,
        format: 'YYYY-MM-DD'
    });
});