$(document).ready(function() {
    'use strict';

    var $dateEntry = $('#dateEntry');
    var $textHolder = $('.textHolder');
    var $recordHolder = $('.recordHolder');
    var $record = $('#record');
    var player;

    // creates the drop down selection boxes
    $('#date').combodate({
        minYear: 1953,
        format: 'YYYY-MM-DD'
    });

    $(window).on('load resize', function() {
        resizeText($textHolder);
        resizeText($recordHolder);
        setDateSpacing();
    });

    $dateEntry.on('submit', function(e) {
        e.preventDefault();
        var date = $(this).serialize().split('=')[1];

        $.ajax('/api/records/'+date, {
            success: function(data) {
                var result = data[0];
                $record.html('<span>'+result.artist+': '+result.title+'</span>');
                resizeText($recordHolder);
                $record.css({opacity: 0, visibility: 'visible'})
                    .animate({opacity: 1}, 'slow');
                fetchVideo(result, function(videoId) {
                    renderVideo(videoId);
                });
            },
            error: function() {
                $record.html('<span>Failed to load data</span>').css({opacity: 0, visibility: 'visible'})
                    .animate({opacity: 1}, 'slow');
            }
        });
    });

    function fetchVideo(query, cb) {
        $.ajax({
            url: 'https://www.googleapis.com/youtube/v3/search',
            data: {
                part: 'snippet',
                type: 'video',
                videoEmbeddable: 'true',
                maxResults: '1',
                key: 'AIzaSyA5UichqO_WSK22RMjGqWhmz-GvRQK9Szg',
                q: query.artist+'+'+query.title
            },
            type: 'GET',
            success: function(data) {
                cb(data.items[0].id.videoId);
            }
        });
    }

    function renderVideo(videoId) {
        if(player) {
            player.cueVideoById(videoId);
        } else {
            setUpPlayer(videoId);
        }
        $('body, html').animate({scrollTop: $('body').height()}, 1000);
    }

    function setUpPlayer(videoId) {
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);            
        
        window.onYouTubeIframeAPIReady = function() {
            player = new YT.Player('player', {
                height: '366',
                width: '640',
                videoId: videoId
            });
        };
    }

    function resizeText(input) {
        var jqObj = (typeof input === 'string' ? $(input) : input);
        jqObj.textfill({
            minFontPixels: 4,
            maxFontPixels: 40
        });
        return jqObj;
    }

    function setDateSpacing() {
        var $topDate = ($('#main').width() / 12.5);
        var $leftDate = ($('#main').width() / 2) - ($('.div-date').width() / 2) + 2;
        $('.div-date').css({'top': $topDate + 'px', 'left': $leftDate + 'px'});
    }
});
