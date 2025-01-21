import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import classes from '../styles/videoRoom.module.css';
import CloseVideoRoomButton from '../components/videoRoom/button/CloseVideoRoomButton';
import OutVideoRoomModal from '../components/videoRoom/modal/OutVideoRoomModal';

import { OpenVidu, Session, Publisher, Subscriber } from 'openvidu-browser';

export const VideoRoomView = () => {
    const location = useLocation();
    const { sessionId, token } = location.state
    console.log(sessionId, token);
    const [isTerminate, setIsTerminate] = useState(false);
    const [leftTime, setLeftTime] = useState(10);
    console.log(token)

    const endCall = () => {
        setIsTerminate(true);
    }

    const OV = new OpenVidu();
    const sessionRef = useRef<Session | null>(null);
    const [publishers, setPublisher] = useState<Publisher | null>(null);
    const [subscribers, setSubscribers] = useState<(Subscriber | Subscriber)[]>([]);

    // video id 찾기
    const myTargetElement = document.getElementById("my-video") as HTMLElement;

    // OpenVidu 세션 초기화
    const session = OV.initSession();
    sessionRef.current = session; // 세션 객체를 참조값에 저장

    // // 상대방의 스트림이 종료되었을 때 이벤트 처리
    // session.on("streamDestroyed", (event) => {
    //     setSubscribers((prevSubscribers) =>
    //         prevSubscribers.filter((sub) => sub !== event.stream.streamManager)
    //     );
    // });

    // 세션 연결: 토큰을 사용하여 OpenVidu 서버와 연결
    const connectOpenvidu = ((token: string) => {
        console.log('tokentoken', token);
        session
            .connect(token) // 사용자 이름 또는 기타 데이터 전달 가능
            .then(() => {
                if (myTargetElement === null) return
                const publisher = OV.initPublisher(myTargetElement, {
                    videoSource: undefined, // 기본 카메라 사용
                    audioSource: undefined, // 기본 마이크 사용
                    publishAudio: true, // 오디오 송출 여부
                    publishVideo: true, // 비디오 송출 여부
                    resolution: "640x480", // 해상도 설정
                    frameRate: 30, // 프레임 레이트 설정
                    mirror: true, // 거울 모드
                });

                session.publish(publisher); // 내 화면 송출 시작
                setPublisher(publisher); // 퍼블리셔 상태 업데이트
                console.log("야호 성공!")
            })
            .catch((error) => {
                console.error("토큰 전송 과정에 문제 발생 : ", error); // 연결 실패 시 에러 출력
            });
    });

    connectOpenvidu(token);

    // 상대방의 스트림이 생성되었을 때 이벤트 처리
    session.on("streamCreated", (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        console.log('subs', subscriber.videos);
    });

    // return () => {
    //     if (sessionRef.current) {
    //         sessionRef.current.disconnect(); // 컴포넌트 언마운트 시 세션 연결 해제
    //     }
    // };

    useEffect(() => {
        if (leftTime <= 0) {
            session.disconnect();
            endCall();
        }

        const timerInterval = setInterval(() => {
            setLeftTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [leftTime, session]);

    return (
        <>
            {isTerminate && (
                <OutVideoRoomModal />
            )}
            <div className="flex justify-center items-center flex-column h-screen">
                <div className={classes.back}>
                    <h1>화상채팅</h1>
                    <p>{leftTime}</p>
                    {/* 상대방 화면 표시 */}
                    <div id="subscriber">
                        {subscribers.map((subscriber, index) => (
                            <div key={index} style={{ width: "70%", float: "left" }}>
                                {/* 상대방의 비디오 엘리먼트를 렌더링 */}
                                <div ref={(el) => el && subscriber.addVideoElement(el)} />
                            </div>
                        ))}
                    </div>

                    {/* 내 화면 표시 */}
                    <div id="my-video" style={{ width: "30%", float: "right" }}>
                        {publishers && (
                            <video autoPlay ref={(el) => el && publishers.addVideoElement(el)} />
                        )}
                    </div>
                    <CloseVideoRoomButton onEnd={endCall} />
                </div>
            </div>
        </>
    )
}