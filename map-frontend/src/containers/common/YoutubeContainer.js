import React from 'react';
import YouTube from 'react-youtube';

const YoutubeContainer = ({youtubeVideoId}) =>{
    const opts = {
        height: '610',
        width: '500',
        playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: 1
        }
    };

    const _onReady = (e) => {
        // access to player in all event handlers via event.target
        e.target.playVideo();
    };

    return (
        <YouTube
            videoId={youtubeVideoId}
            opts={opts}
            onReady={_onReady}
        />
    );

};

export default YoutubeContainer;
