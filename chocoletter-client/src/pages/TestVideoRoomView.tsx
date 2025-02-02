import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isLoginAtom } from '../atoms/auth/userAtoms';
import { freeLetterState, questionLetterState } from '../atoms/letter/letterAtoms';
import { userNameAtom } from '../atoms/auth/userAtoms';

import CloseVideoRoomButton from '../components/video-room/button/CloseVideoRoomButton';
import OutVideoRoomModal from '../components/video-room/modal/OutVideoRoomModal';
import LetterInVideoModal from '../components/video-waiting-room/modal/LetterInVideoModal';
import LetterInVideoOpenButton from '../components/video-waiting-room/button/LetterInVideoOpenButton';
import timerIcon from "../assets/images/unboxing/timer.svg";
import classes from "../styles/videoRoom.module.css"
import { AiOutlineAudio } from "react-icons/ai";
import { AiOutlineAudioMuted } from "react-icons/ai";
import { FaVideo } from "react-icons/fa6";
import { FaVideoSlash } from "react-icons/fa";

import { joinSession, leaveSession, pushPublish, deleteSession } from '../utils/openviduTest';

import { WaitingTest } from '../components/video-room/VideoWaiting';
import { VideoState } from "../types/openvidutest";
import { checkAuthVideoRoom, terminateVideoRoom } from '../services/openviduApi';

const TestVideoRoomView = () => {
    const navigate = useNavigate();
    const localPreviewRef = useRef<HTMLDivElement>(null);
    const { sessionIdInit } = useParams();
    const [ isItThere, setIsItThere ] = useState(false);

    const [isTerminate, setIsTerminate] = useState(false);
    const [leftTime, setLeftTime] = useState(60);
    const [sessionId, setSessionId] = useState<string | undefined>(undefined); // 세션 ID 상태
    const didJoin = useRef(false);
    const [isAudio, setIsAudio] = useState(true);
    const [isVideo, setIsVideo] = useState(true);
    const [isOpenLetter, setIsOpenLetter] = useState(false);

    const [videoState, setVideoState] = useState<VideoState>({
        session: undefined,
        mainStreamManager: undefined,
        publisher: undefined,
        subscribers: undefined,
    }); // 비디오 상태
    ///////////////////////////////////////////////////////////////
    const [isWaitingRoom, setIsWaitingRoom] = useState(true);
    const isLogin = useRecoilValue(isLoginAtom);
    const setFreeLetter = useSetRecoilState(freeLetterState);
    const setQuestionLetter = useSetRecoilState(questionLetterState);
    const username = useRecoilValue(userNameAtom); // 사용자 이이름
    const onEnd = async () => {
        setIsTerminate(true)
        if (videoState.session?.sessionId) {
            await deleteSession(videoState.session.sessionId);
        }
        await leaveSession(videoState, setVideoState);
        // if (sessionIdInit) terminateVideoRoom(sessionIdInit);
    }

    const onSemiEnd = async () => {
        await leaveSession(videoState, setVideoState);
    }

    // 로그인 확인
    // if (!isLogin) navigate("/");

    // 입장 확인 API
    // if (sessionIdInit) {
    //     try {
    //         const checkAuth = checkAuthVideoRoom(sessionIdInit);
    //         console.log(checkAuth)
    //     } catch (err) {
    //         console.log(err)
    //         navigate("/main/my/event")
    //     }
    // }

    // 편지 찾기(추후 추가)
    // 위의 checkAuth에 존재

    // 세션 및 토큰 발급
    useEffect(() => {
        if (didJoin.current) return;
        didJoin.current = true;

        const initSession = async () => {
            try {
                console.log("세션 생성 중")

                await joinSession(
                    { sessionId: sessionIdInit, username },
                    setVideoState,
                    setIsTerminate,
                    setIsItThere,
                )
            } catch (err) {
                console.log("세션 생성 실패 : ", err)
            }
        };

        initSession();
    }, [])

    //////////////////////////////////////////////////////////////////
    // 내 영상 publish
    useEffect(() => {
        if (!isItThere) return;

        pushPublish(videoState);
        console.log("publish do")
        
    }, [isItThere])

    // 1분 타이머 지나면 방 폭파
    useEffect(() => {
        if (!isItThere) return;

        const timerInterval = setInterval(() => {
            setLeftTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerInterval);
                    onEnd();
                    return 0;
                }

                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [isItThere]);

    const muteOrNotHandler = () => {
        videoState.publisher?.publishAudio(!videoState.publisher.stream.audioActive);
        setIsAudio((prev) => !prev)
    }

    const videoOffOrNotHandler = () => {
        videoState.publisher?.publishVideo(!videoState.publisher.stream.videoActive);
        setIsVideo((prev) => !prev)
    }

    const showRTCLetter = () => {
        setIsOpenLetter(true);
    }

    const hideRTCLetter = () => {
        setIsOpenLetter(false);
    }

    return (
        <>
            <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#A8A8A8] relative overflow-hidden">
                {isTerminate && (
                    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 backdrop-blur-lg flex justify-center items-center">
                        <OutVideoRoomModal />
                    </div>
                )}
                {isItThere ? null : (
                    <div className="absolute inset-0 z-50 flex justify-center items-center">
                        <WaitingTest unboxing="2025-02-02T05:30:00" onEnd={onEnd} onSemiEnd={onSemiEnd} isItThere={isItThere} content="love" videoState={videoState} />
                    </div>
                )}
                <LetterInVideoModal
                    isOpen={isOpenLetter}
                    onClose={hideRTCLetter}
                    sender="송신자"
                    receiver="수신자"
                    content="love"
                />
                <div className="absolute top-9 right-3 w-8 h-8 z-50">
                    <LetterInVideoOpenButton onPush={showRTCLetter} />
                </div>
                {/* 내 화면 */}
                <div 
                    id="my-video" 
                    className={`absolute bottom-[20dvh] right-6 rounded-[12px] shadow-xl overflow-hidden z-30 ${classes.flowingBorder}`}
                    style={{
                        '--bg-color': 'var(--chocoletter-giftbox-bg)',
                        '--custom-width': '18dvh',
                        '--custom-height': '24dvh',
                        'aspect-ratio': '1/1'
                    } as React.CSSProperties} 
                >
                    {videoState.publisher && (
                        <video 
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                            ref={(el) => el && videoState.publisher?.addVideoElement(el)}
                        />
                    )}
                </div>
                {/* 타이머 */}
                <div className="absolute top-9 px-[15px] py-[5px] bg-chocoletterGiftBoxBg rounded-[17px] justify-center items-center gap-[9px] inline-flex">
                    <div className="w-[18px] h-[18px] relative">
                        <img src={timerIcon} alt="타이머" className={`w-[18px] h-[18px] left-0 top-0 absolute ${leftTime <= 5? classes.alarmIcon : ""}`} />
                    </div>
                    <div className="text-black">{isItThere}</div>
                    <div className={`text-center ${leftTime <= 5? "text-chocoletterWarning" : "text-chocoletterPurpleBold"} text-2xl font-normal font-sans leading-snug z-20`}>{leftTime}</div>
                </div>

                {/* 상대방 화면 */}
                <div id="subscriber" className="w-full min-h-screen absolute top-0 left-0">
                    {videoState.subscribers && (
                        <video 
                            autoPlay
                            className="w-full h-full object-cover absolute"
                            ref={(el) => el && videoState.subscribers?.addVideoElement(el)} 
                        />

                    )}
                </div>
                <div className="flex w-full bottom-[8dvh] justify-center gap-x-7 items-center absolute">
                    <div className={`w-[9dvh] h-[9dvh] ${isAudio ? "bg-white" : "bg-black"} rounded-[100px] justify-center items-center gap-2.5 inline-flex z-20`}>
                        <button onClick={muteOrNotHandler} className="w-full h-full aspect-square flex justify-center items-center" >
                            {isAudio ? (
                                <AiOutlineAudio className="w-[50%] h-[50%]" />
                            ) : (
                                <AiOutlineAudioMuted color="white" className="w-[50%] h-[50%]" />
                            )}
                        </button>
                    </div>
                    <div className="w-[9dvh] h-[9dvh] bg-chocoletterWarning rounded-[100px] justify-center items-center gap-2.5 inline-flex z-20">
                        <CloseVideoRoomButton onEnd={onEnd} />
                    </div>
                    <div className={`w-[9dvh] h-[9dvh] ${isVideo ? "bg-white" : "bg-black"} rounded-[100px] justify-center items-center gap-2.5 inline-flex z-20`}>
                        <button onClick={videoOffOrNotHandler} className="w-full h-full aspect-square flex justify-center items-center" >
                            {isVideo ? (
                                <FaVideo className="w-[50%] h-[50%]" />
                            ) : (
                                <FaVideoSlash color="white" className="w-[50%] h-[50%]" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default TestVideoRoomView;