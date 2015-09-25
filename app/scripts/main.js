$(function(){

    'use strict';

    var Record = Backbone.Model.extend({

        defaults: {
            artist: '',
            title: '',
            videoId: ''
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
            this.getVideoId();
            return this;
        },

        getVideoId: function() {
            var that = this;
            var queryString = that.model.get('artist') + "+" + 
                that.model.get('title');
            
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
                    that.model.set('videoId',data.items[0].id.videoId);
                    console.log(that.model.toJSON());
                    that.loadVideo();
                }
            });
        },

        loadVideo: function() {
            var that = this;
            var player;

            var tag = document.createElement('script');

            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); 
            
            window.onYouTubeIframeAPIReady = function() {
                player = new YT.Player('player', {
                    height: '390',
                    width: '640',
                    videoId: that.model.get('videoId'),
                    events: {
                        'onReady': onPlayerReady
                    }
                });
            }
            function onPlayerReady(event){
                //event.target.playVideo();
            }
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