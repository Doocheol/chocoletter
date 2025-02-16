import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isLoginAtom } from '../atoms/auth/userAtoms';
import { userNameAtom } from '../atoms/auth/userAtoms';
import { FiveSecondModal } from '../components/video-waiting-room/modal/FiveSecondModal';
import { AnnouncePermitModal } from '../components/video-room/modal/AnnouncePermitModal';
import { AnnounceSender } from '../components/video-room/modal/AnnounceSender';
import { toast } from 'react-toastify';
import CloseVideoRoomButton from '../components/video-room/button/CloseVideoRoomButton';
import OutVideoRoomModal from '../components/video-room/modal/OutVideoRoomModal';
import LetterInVideoModal from '../components/video-waiting-room/modal/LetterInVideoModal';
import LetterInVideoOpenButton from '../components/video-waiting-room/button/LetterInVideoOpenButton';
import timerIcon from "../assets/images/unboxing/timer.svg";
import classes from "../styles/videoRoom.module.css"
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { FaVideo } from "react-icons/fa6";
import { FaVideoSlash } from "react-icons/fa";
import { getUserInfo } from '../services/userInfo';
import { joinSession, leaveSession, deleteSession } from '../utils/openviduTest';
import { WaitingTest } from '../components/video-room/VideoWaiting';
import { VideoState } from "../types/openvidutest";
import { checkAuthVideoRoom, terminateVideoRoom } from '../services/openviduApi';
import { GiftDetail } from '../types/openvidutest';
import { AxiosError } from 'axios';

const TestVideoRoomView = () => {
    const navigate = useNavigate();
    const { sessionIdInit } = useParams();
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const [isRemoteMuted, setIsRemoteMuted] = useState(true);
    const [ isItThere, setIsItThere ] = useState(false);
    const [ isReady, setIsReady ] = useState(false);
    const [ countFive, setCountFive ] = useState(false);

    const [isTerminate, setIsTerminate] = useState(false);
    const [leftTime, setLeftTime] = useState(95);
    const [isAudio, setIsAudio] = useState(true);
    const [isVideo, setIsVideo] = useState(true);
    const [isOpenLetter, setIsOpenLetter] = useState(false);

    const [videoState, setVideoState] = useState<VideoState>({
        session: undefined,
        mainStreamManager: undefined,
        publisher: undefined,
        subscribers: undefined,
    });
    const [letterInfo, setLetterInfo] = useState<GiftDetail | null>(null);
    const isLogin = useRecoilValue(isLoginAtom);
    const username = useRecoilValue(userNameAtom);
    const [user, setUser] = useState(() => getUserInfo());
    const [unboxingTime, setUnboxingTime] = useState<string>('');
    const [isPermit, setIsPermit] = useState(false);
    const [sessionId, setSessionId] = useState<string | undefined>();
    const [isRTCsender, setIsRTCsender] = useState(false);
    const [refreshKey, setRefreshKey] = useState(Date.now());

    // 대기방 종료, 통화 종료일 때 실행되는 함수 
    // 세션 종료, 방 재입장 불가 API 호출 
    const onEnd = async () => {
        setIsTerminate(true)
        if (videoState.session?.sessionId) {
            await deleteSession(videoState.session.sessionId);
        }
        await leaveSession(videoState, setVideoState);
        if (sessionId) terminateVideoRoom(sessionId);
    }

    // 로그인 확인, 세션 번호 확인 및 입장 확인 API 호출 
    useEffect(() => {
        navigate(`/main/${user?.giftBoxId || ""}`);

        if (!isLogin) {
            navigate("/");
            return;
        }

        if (!sessionIdInit) {
            new Error("세션 아이디가 없습니다.");
            navigate(`main/${user?.giftBoxId}`);
            return;
        }
        setSessionId(sessionIdInit);

        const refreshStorageKey = `autoRefreshed_${sessionIdInit}`;

        if (letterInfo && unboxingTime) return;
        
        const checkAuth = async () => {
            try {
                const checkAuthResult = await checkAuthVideoRoom(sessionIdInit);
                setLetterInfo(checkAuthResult.giftDetail);
                setUnboxingTime(checkAuthResult.unboxingTime);
                
                if (!sessionStorage.getItem(refreshStorageKey)) {
                    sessionStorage.setItem(refreshStorageKey, "true");
                    setRefreshKey(Date.now());
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    if (err.response?.status === 401) {
                        new Error("인증 실패");
                    } else if (err.response?.status === 403) {
                        new Error("권한 없음");
                    } else if (err.response?.status === 404) {
                        new Error("방이 존재하지 않음");
                    } else {
                        new Error("서버 오류");
                    }
                
                navigate(`main/${user?.giftBoxId}`);
                }
            }
        };

        checkAuth();
    }, [isLogin, letterInfo, navigate, sessionIdInit, unboxingTime, user?.giftBoxId, setSessionId]);

    // 세션 및 토큰 발급
    const initSession = async () => {
        try {
            await joinSession(
                { sessionId: sessionIdInit, username },
                setVideoState,
                setIsTerminate,
                setIsItThere,
            )
        } catch (err) {
            if (!toast.isActive("no-create-session")) {
                toast.error("연결에 실패했습니다. 새로고침 해주세요!", { 
                    toastId: "no-create-session",
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        }
    };

    // 연결 전 5초 타이머 실행
    useEffect(() => {
        if (!isItThere) return;
        setCountFive(true);
        const timer = setTimeout(() => {
            setCountFive(false);
        }, 5000);

        return () => clearTimeout(timer);       
    }, [isItThere])

    // 1분 30초 타이머 지나면 방 폭파
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

    // 음소거 실행/해제 함수 
    const muteOrNotHandler = () => {
        videoState.publisher?.publishAudio(!videoState.publisher.stream.audioActive);
        setIsAudio((prev) => !prev)
    }

    // 비디오 끄기/켜기 함수 
    const videoOffOrNotHandler = () => {
        videoState.publisher?.publishVideo(!videoState.publisher.stream.videoActive);
        setIsVideo((prev) => !prev)
    }

    // 편지 모달 열기 함수 
    const showRTCLetter = () => {
        setIsOpenLetter(true);
    }

    // 편지 모달 닫기 함수 
    const hideRTCLetter = () => {
        setIsOpenLetter(false);
    }

    // 보낸이나 오류가 발생한 경우 편지 모달 닫는 함수 
    const hideRTCLetterError = () => {
        setIsOpenLetter(false);
        setIsRTCsender(true);
    }

    // 세션 생성 및 내 화면의 상대방 video 음소거 해제 함수 
    const transRemoteMuted = async () => {
        await initSession();
        setIsRemoteMuted(false);
        setIsReady(true);
        if (remoteVideoRef.current) {remoteVideoRef.current.muted = false};
    }

    return (
        <div key={refreshKey}>
            <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#A8A8A8] relative overflow-hidden">
                {isItThere && countFive ? <FiveSecondModal leftTime={leftTime} /> : null}
                {isTerminate && (
                    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 backdrop-blur-lg flex justify-center items-center">
                        <OutVideoRoomModal giftBoxId={user?.giftBoxId || ''}/>
                    </div>
                )}
                {!isPermit && (<AnnouncePermitModal videoPermit={() => {setIsPermit(true)}} />)}
                {isItThere ? null : (
                    <div className="absolute inset-0 z-50 flex justify-center items-center">
                        <WaitingTest 
                            unboxing={unboxingTime || ''} 
                            onEnd={onEnd} 
                            isReady={isReady} 
                            isItThere={isItThere} 
                            videoState={videoState} 
                            trans={transRemoteMuted} 
                            letterInfo={letterInfo} 
                            isOpenLetter={isOpenLetter}
                            onErrorClose={hideRTCLetterError}
                        />
                    </div>
                )}
                {isRTCsender && (
                    <AnnounceSender 
                        isOpen={isRTCsender} 
                        onClose={() => setIsRTCsender(false)} 
                    />
                )}
                {isOpenLetter &&
                (<LetterInVideoModal
                    isOpen={isOpenLetter}
                    onClose={hideRTCLetter}
                    onErrorClose={hideRTCLetterError}
                    giftId={letterInfo?.giftId || ""}
                />)}
                
                <div className="absolute top-9 right-3 w-8 h-8 z-50">
                    <LetterInVideoOpenButton onPush={showRTCLetter} />
                </div>
                {/* 내 화면 */}
                <div 
                    id="my-video" 
                    className={`absolute bottom-[18dvh] right-6 rounded-[12px] shadow-xl overflow-hidden z-30 ${classes.flowingBorder}`}
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
                <div className="absolute top-9 px-[15px] py-[5px] bg-chocoletterGiftBoxBg rounded-[17px] justify-center items-center gap-[9px] inline-flex z-20">
                    <div className="w-[18px] h-[18px] relative">
                        <img src={timerIcon} alt="타이머" className={`w-[18px] h-[18px] left-0 top-0 absolute ${leftTime <= 5? classes.alarmIcon : ""}`} />
                    </div>
                    <div className={`text-center ${leftTime <= 5? "text-chocoletterWarning" : "text-chocoletterPurpleBold"} text-2xl font-normal font-sans leading-snug`}>{leftTime}</div>
                </div>

                {/* 상대방 화면 */}
                <div id="subscriber" className="w-full min-h-screen absolute top-0 left-0">
                    {videoState.subscribers && (
                        <video 
                            autoPlay
                            playsInline
                            muted={isRemoteMuted}
                            className="w-full h-full object-cover absolute"
                            ref={(el) => {
                                if (el && videoState.subscribers) {
                                    videoState.subscribers.addVideoElement(el);
                                    remoteVideoRef.current = el;
                                    el.muted = isRemoteMuted;
                                }
                            }} 
                        />

                    )}
                </div>
                <div className="flex w-full bottom-[5dvh] justify-center gap-x-7 items-center absolute pt-3">
                    <div className={`w-[9dvh] h-[9dvh] ${isAudio ? "bg-white" : "bg-black"} rounded-[100px] justify-center items-center gap-2.5 inline-flex z-20`}>
                        <button onClick={muteOrNotHandler} className="w-full h-full aspect-square flex justify-center items-center" >
                            {isAudio ? (
                                <AiOutlineAudio className="w-[50%] h-[50%]" />
                            ) : (
                                <AiOutlineAudioMuted color="white" className="w-[50%] h-[50%]" />
                            )}
                        </button>
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
                    <div className="pl-10">
                        <div className="w-[9dvh] h-[9dvh] bg-chocoletterWarning rounded-[100px] justify-center items-center gap-2.5 inline-flex z-20">
                            <CloseVideoRoomButton onEnd={onEnd} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TestVideoRoomView;