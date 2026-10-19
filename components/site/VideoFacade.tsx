'use client';

import React, { useState } from 'react';
import { Play } from './Icons';

/**
 * Click-to-load video. Shows a poster and a play button; the third-party player
 * only loads after the visitor asks for it, which keeps the page light on phones.
 */

const parse = (url: string) => {
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (yt) {
        return {
            embed: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`,
            poster: `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`,
        };
    }
    const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeo) {
        return { embed: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&dnt=1`, poster: null };
    }
    return null;
};

const VideoFacade: React.FC<{ url: string; title: string }> = ({ url, title }) => {
    const [playing, setPlaying] = useState(false);
    const video = parse(url);
    if (!video) return null;

    return (
        <div className="video">
            <div className="video__frame">
                {playing ? (
                    <iframe
                        src={video.embed}
                        title={title}
                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                        allowFullScreen
                    />
                ) : (
                    <>
                        {video.poster && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={video.poster} alt="" loading="lazy" decoding="async" />
                        )}
                        <button type="button" className="video__play" onClick={() => setPlaying(true)}>
                            <span>
                                <Play /> Play the video: {title}
                            </span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VideoFacade;
