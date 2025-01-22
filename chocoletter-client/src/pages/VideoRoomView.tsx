import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import classes from '../styles/videoRoom.module.css';
import CloseVideoRoomButton from '../components/videoRoom/button/CloseVideoRoomButton';
import OutVideoRoomModal from '../components/videoRoom/modal/OutVideoRoomModal';

import { Publisher, Subscriber } from 'openvidu-browser';
import { joinSession } from '../utils/openvidu';
import { VideoState } from '../types/openvidu';

export const VideoRoomView = () => {
    const location = useLocation();
    const { sessionIdInit } = location.state
    console.log(sessionIdInit);
    const [isTerminate, setIsTerminate] = useState(false);
    const [leftTime, setLeftTime] = useState(500);

    // const [publishers, setPublisher] = useState<Publisher | null>(null);
    // const [subscribers, setSubscribers] = useState<(Subscriber | Subscriber)[]>([]);

    const [sessionId, setSessionId] = useState<string | undefined>(undefined); // 세션 ID 상태

    const [videoState, setVideoState] = useState<VideoState>({
        session: undefined,
        mainStreamManager: undefined,
        publisher: undefined,
        subscribers: [],
    }); // 비디오 상태

    const username = "User" + Math.floor(Math.random() * 100); // 사용자 예비 이름
    const endCall = () => {
        setIsTerminate(true);
    }

    useEffect(() => {
        const initSession = async () => {
            try {
                console.log("세션 생성 중");

                await joinSession(
                    { sessionId: sessionIdInit, username },
                    setSessionId,
                    setVideoState,
                );

                console.log("완료")
            } catch (err) {
                console.log("join 문제 발생 : ", err)
            }
        }

        initSession();
    }, []);

    useEffect(() => {
        if (leftTime <= 0) {
            endCall();
        }

        const timerInterval = setInterval(() => {
            setLeftTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [leftTime]);

    return (
        <>
            {isTerminate && (
                <OutVideoRoomModal />
            )}
            <div className="flex justify-center items-center flex-column h-screen">
                <div className={classes.back}>
                    <h1>화상채팅</h1>
                    <p>{leftTime}</p>
                    {/* 내 화면 */}
                    <div id="my-video" style={{ width: "30%", float: "right" }}>
                        {videoState.publisher && (
                            <video autoPlay ref={(el) => el && videoState.publisher?.addVideoElement(el)} />
                        )}
                    </div>

                    {/* 상대방 화면 */}
                    <div id="subscriber" style={{ width: "70%", float: "left" }}>
                        {videoState.subscribers.map((subscriber, index) => (
                            <div key={index} style={{ marginBottom: "10px" }}>
                                <video autoPlay ref={(el) => el && subscriber.addVideoElement(el)} />
                            </div>
                        ))}
                    </div>
                    <CloseVideoRoomButton onEnd={endCall} />
                </div>
            </div>
        </>
    )
}