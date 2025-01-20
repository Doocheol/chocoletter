import React from 'react';
import { useState, useEffect } from 'react';
import classes from '../styles/videoRoom.module.css';
import CloseVideoRoomButton from '../components/videoRoom/button/CloseVideoRoomButton';
import OutVideoRoomModal from '../components/videoRoom/modal/OutVideoRoomModal';

import { OpenVidu } from 'openvidu-browser';

export default function VideoRoomView({ sessionId, token }) {
    const [isTerminate, setIsTerminate] = useState(false);
    const [leftTime, setLeftTime] = useState(60);

    const endCall = () => {
        setIsTerminate(true);
    }

    const OV = new OpenVidu();
    const session = OV.initSession();

    useEffect(() => {
        const session = OV.initSession();
        sessionRef.current = session;
    
        session.on("streamCreated", (event) => {
            const subscriber = session.subscribe(event.stream, "subscriber");
            document.getElementById("subscriber").appendChild(subscriber.videos[0]);
        });
    
        session.connect(token).then(() => {
            const publisher = OV.initPublisher("publisher");
            session.publish(publisher);
            document.getElementById("publisher").appendChild(publisher.videos[0]);
        });
    
        return () => session.disconnect();
    }, [OV, token]);
    
    useEffect(() => {
        if (timeLeft <= 0) {
        alert("채팅 시간이 종료되었습니다.");
        window.location.href = "/"; // 메인 페이지로 리다이렉트
        }
    
        const timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
    
        return () => clearInterval(timerInterval);
    }, [timeLeft]);

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