$(function(){

    'use strict';

    var Record = Backbone.Model.extend({

        defaults: {
            artist: '',
            title: '',
            videoId: ''
        },

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
                    that.trigger('change:[videoId]');
                }
            });
        }
    });

    var RecordCollection = Backbone.Collection.extend({

        model: Record,
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
            this.$player = this.$('#player');
            this.listenTo(userCollection, 'sync', this.addModel);
        },

        render: function(record){
            var view = new RecordView({model: record});
            this.$record.html(view.render().el);
            return this;
        },

        submit: function(e) {
            e.preventDefault();
            var that = this;
            var userBirthday = ($('#dateEntry').serializeArray())[0].value;
            var userModel = new Record({id: userBirthday});
            userCollection.add(userModel);
            userModel.fetch({success: function(model, response, options) {
                model.getVideoId();
            }});

        },

        addModel: function(newModel) {
            this.render(this.collection.last());
        },


        renderVideo: function(videoId) {
            var videoId = videoId;
            if (this.player) {
                this.player.cueVideoById(videoId);
            } else {
                this.setupPlayer(videoId);
            }
        },

        setupPlayer: function(videoId) {
            var tag = document.createElement('script');
            var that = this;
            var videoId = videoId;

            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);            
            
            window.onYouTubeIframeAPIReady = function() {
                that.player = new YT.Player('player', {
                    height: '390',
                    width: '640',
                    videoId: videoId,
                    events: {
                        //'close': player.destroy()
                    }
                });
            }   
        }
    });

    var RecordView = Backbone.View.extend({

        tagName: 'h2',

        template: _.template('<%= artist %>: <%= title %>'),

        initialize: function () {
            this.model.on('change:[videoId]', this.callVideo, this);
        },

        callVideo: function() {
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

$(function(){
    $('#date').combodate({
        minYear: 1952,
        format: 'YYYY-MM-DD'
    });
});