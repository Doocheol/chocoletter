import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
import { useRecoilState } from "recoil";
import { sessionAtom, tokenAtom, memberCntAtom } from "../atoms/video/videoAtoms"

import { MyFaceInVideoWaitingRoom } from "../components/videoWaitingRoom/MyFaceInVideoWaitingRoom";
import LetterInVideoModal from "../components/videoWaitingRoom/modal/LetterInVideoModal";
import LetterInVideoOpenButton from "../components/videoWaitingRoom/button/LetterInVideoOpenButton";
import classes from "../styles/videoRoom.module.css";
// import { useSocket } from "../hooks/useSocket";

// API를 받아옵니다.

const waitingComment = [
    "잠시만 기다려 주세요. 상대방을 기다리고 있어요!",
    "5분 안에 연결되지 않으면 화상채팅 기회가 사라져요 ㅠㅠ",
    "화면을 유지해 주세요. 연결이 끊길 수 있어요!",
    "편지 열기 버튼을 눌러보세요. 특별 초콜릿 안에에 편지를 볼 수 있어요!"];

export const WaitingRoomView = () => {
    const { sessionIdInit } = useParams();
    const [isTimerOn, setIsTimerOn] = useState(true);
    const [remainTime, setRemainTime] = useState(300);
    const [makeMMSS, setMakeMMSS] = useState('');
    // const [isBothJoin, setIsBothJoin] = useState(0);
    const [isBothJoin, setIsBothJoin] = useRecoilState(memberCntAtom);

    const [isOpenLetter, setIsOpenLetter] = useState(false);
    const [comment, setComment] = useState(waitingComment[2]);
    const [cnt, setCnt] = useState(0);

    const navigate = useNavigate();
    // const { userList } = useSocket();
    const [sessionValue, setSessionValue] = useRecoilState(sessionAtom)
    const [tokenValue, setTokenValue] = useRecoilState(tokenAtom)

    const showRTCLetter = () => {
        setIsOpenLetter(true);
    }

    const hideRTCLetter = () => {
        setIsOpenLetter(false);
    }

    // video-room 연결 테스트
    // 테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트
    // token 동기화를 위해 localStorage 사용
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'isBothJoin' && event.newValue !== null && Number(event.newValue) > 1) {
                navigate('/video/room', { state: { sessionId: sessionIdInit } });
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, [sessionValue, tokenValue, navigate]);

    useEffect(() => {
        localStorage.setItem('isBothJoin', isBothJoin.toString());
        console.log('is', isBothJoin)
    }, [isBothJoin]);
    // 테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트
    // 테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트
    // 테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트


    // useEffect(() => {
    //     if (!sessionIdInit) return;


    //     const createSession = async () => {
    //         const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionIdInit }, {
    //             headers: { 'Content-Type': 'application/json', },
    //         });
    //         return response.data; // 세션 ID 받아오기
    //     }

    //     const getSessionId = async () => {
    //         try {
    //             const newSessionId = await createSession();
    //             setSessionValue(newSessionId);  // sessionId 할당
    //             setIsTimerOn(true);             // 5분 타이머 작동(이거는 바꿔야 함-입장 시 바로 시작 예약시간 기준으로 5분전으로 변경경)
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }

    //     getSessionId();

    // }, [sessionIdInit, setSessionValue]);

    // useEffect(() => {
    //     const getToken = async () => {
    //         const aToken = await createToken(sessionValue);
    //         const url = new URL(aToken);
    //         const params = new URLSearchParams(url.search);
    //         const exToken = params.get("token") as string;
    //         console.log('be', exToken)
    //         setTokenValue(exToken);
    //     }

    //     const createToken = async (sessionValue: string) => {
    //         const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionValue + '/connections', {}, {
    //             headers: { 'Content-Type': 'application/json', },
    //         });
    //         return response.data; // The token
    //     }

    //     getToken();

    //     const getConnection = async () => {
    //         try {
    //             const response = await axios.get(
    //                 `http://localhost:4443/openvidu/api/sessions/${sessionValue}/connection`,
    //                 {
    //                     headers: {
    //                         Authorization: 'Basic T1BFTlZJRFVBUFA6TVlfU0VDUkVU'
    //                     }
    //                 }
    //             )
    //             setIsBothJoin(response.data["numberOfElements"]);
    //             console.log(isBothJoin);
    //         } catch {
    //             console.log('error')
    //         }
    //     }

    //     getConnection();
    // }, [sessionValue, setTokenValue]);

    // 3초마다 상단 메세지가 변경경
    useEffect(() => {
        const interval = setInterval(() => {
            setComment(waitingComment[cnt]);
            setCnt((n) => (n + 1) % waitingComment.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [cnt]);

    // 5분동안 타이머 및 지나면 방 폭파
    useEffect(() => {
        if (!isTimerOn) return;

        const interval = setInterval(() => {
            setRemainTime((time) => time - 1);
            setMakeMMSS(() => {
                if (remainTime >= 1) {
                    const minute = Math.floor(remainTime / 60);
                    const second = remainTime - minute * 60;
                    if (second <= 9) {
                        return `0${minute} : 0${second}`;
                    }
                    return `0${minute} : ${second}`;
                } else {
                    clearInterval(interval);
                    navigate('/main/my/event')
                    return '00:00';
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerOn, remainTime, navigate])

    // 임시로 2명이면 넘어가요
    // useEffect(() => {
    //     if (isBothJoin <= 1) return;

    //     const timeout = setTimeout(() => {
    //         navigate('/video/room', { state: { sessionId: sessionIdInit } });
    //     }, 5000);

    //     return () => clearTimeout(timeout);
    // }, [isBothJoin, navigate, sessionIdInit])

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                {isOpenLetter && (
                    <LetterInVideoModal
                        onPush={hideRTCLetter}
                        sender="송신자"
                        receiver="수신자"
                    />
                )}

                <div className={classes.back}>
                    <h1>{comment}</h1>
                    <p>{makeMMSS}</p>
                    {/* <p>{userList.length}</p> */}
                    <p>{sessionValue}</p>
                    <p>{tokenValue}</p>
                    <MyFaceInVideoWaitingRoom />
                    <LetterInVideoOpenButton onPush={showRTCLetter} />
                </div>
            </div>
        </>
    )
}