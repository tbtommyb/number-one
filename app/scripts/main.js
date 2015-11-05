$(function(){

    'use strict';

    var Record = Backbone.Model.extend({

        defaults: {
            artist: '',
            title: '',
            videoId: ''
        },
        initialize: function () {
            // add model to collection and fetch artist-title data from server. Will trigger 'collection[sync' event
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
        },
        sync: function (method, model, options) {
            var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJudW1iZXItb25lLWFwcCIsIm5hbWUiOiJudW1iZXItb25lIiwiYWRtaW4iOiJmYWxzZSJ9.YvBZIdnmFLosFA7gHk33Q7cbCNabJaWHZZ8uuSQoVeQ';

            if (token) {
                options.headers = {
                    'x-access-token': token
                };
            }
            Backbone.Model.prototype.sync.apply(this, arguments);
        }
    });

    var RecordCollection = Backbone.Collection.extend({

        model: Record,
        // link to REST database, queried with birthday date
        url: '/api/records'
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
            // pass the recently submitted model to render()
            this.render(this.collection.last());
        },

        render: function(record){
            var view = new RecordView({model: record});
            this.$record.html($(view.render().el)).trigger('textLoaded');
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
            var videoId = videoId;
            if (this.player) {
                this.player.cueVideoById(videoId);
            } else {
                this.setupPlayer(videoId);
            }
            $('body').animate({scrollTop: $('body').height()}, 1000);
        },

        setupPlayer: function(videoId) {
            // Youtube iframe code
            var tag = document.createElement('script');
            var that = this;
            var videoId = videoId;

            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);            
            
            window.onYouTubeIframeAPIReady = function() {
                that.player = new YT.Player('playerYT', {
                    height: '366',
                    width: '600',
                    videoId: videoId
                });
            }   
        }
    });

    var RecordView = Backbone.View.extend({

        tagName: 'span',

        className: 'recordResult',

        template: _.template('<%= artist %>: <%= title %>'),

        initialize: function () {
            this.model.on('change:videoId', this.callVideo, this);
        },

        callVideo: function() {
            // pass unique videoID to app-level player renderer
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

$(document).ready(function() {
    function resizeText(selector) {
        $(selector).textfill({
            minFontPixels: 4,
            maxFontPixels: 40
        });
    }    
    function setDateSpacing() {
        $topDate = ($('#main').width() / 12.5);
        $leftDate = ($('#main').width() / 2) - ($('.div-date').width() / 2) + 2;
        $('.div-date').css({'top': $topDate + 'px', 'left': $leftDate + 'px'});
    }

    resizeText('.textHolder');
    setDateSpacing();

    $(window).on('resize', function() {
        resizeText('.textHolder');
        resizeText('.recordHolder');
        setDateSpacing();
    });

    $('#record').on('textLoaded', function () {
        console.log('catching event');
        $('.recordHolder').textfill({
            minFontPixels: 4,
            maxFontPixels: 40,
            success: function() {
                console.log('function called');
                $('.recordResult').css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 'slow');
            }
        });
    });
    // creates the drop down selection boxes
    $('#date').combodate({
        minYear: 1953,
        format: 'YYYY-MM-DD'
    });
});


