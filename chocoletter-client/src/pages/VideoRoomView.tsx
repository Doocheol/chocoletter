import React from 'react';
import { useState } from 'react';
import classes from '@/styles/videoRoom.module.css';
import CloseVideoRoomButton from '../components/videoRoom/button/CloseVideoRoomButton';
import OutVideoRoomModal from '../components/videoRoom/modal/OutVideoRoomModal';

import { OpenVidu } from 'openvidu-browser';

export default function VideoRoomView() {
    const [isTerminate, setIsTerminate] = React.useState(false);

    const endCall = () => {
        setIsTerminate(true);
    }

    const OV = new OpenVidu();
    const session = OV.initSession();

    return (
        <>
            {isTerminate && (
                <OutVideoRoomModal />
            )}
            <div className="flex justify-center items-center h-screen">
                <div className={classes.back}>
                    <h1>화상채팅</h1>
                    <div id="remote-video" style={{ width: '70%', height: '70%' }}></div>
                    <div id="local-video" style={{ width: '50%', height: '30%', position: 'absolute', bottom: '10px', right: '20px' }}></div>
                    <CloseVideoRoomButton onEnd={endCall} />
                </div>
            </div>
        </>
    )
}