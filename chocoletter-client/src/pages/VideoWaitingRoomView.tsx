import React from "react";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import axios from "axios";

import { MyFaceInVideoWaitingRoom } from "../components/videoWaitingRoom/MyFaceInVideoWaitingRoom";
import LetterInVideoModal from "../components/videoWaitingRoom/modal/LetterInVideoModal";
import LetterInVideoOpenButton from "../components/videoWaitingRoom/button/LetterInVideoOpenButton";
import classes from "../styles/videoRoom.module.css";

const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000/';

// API를 받아옵니다.

export default function WaitingRoom() {
    const waitingComment = useMemo(() => ["잠시만 기다려 주세요. 상대방을 기다리고 있어요!", "화면을 유지해 주세요. 연결이 끊길 수 있어요!", "편지 열기 버튼을 눌러보세요. 특별 초콜릿 안에에 편지를 볼 수 있어요!"], []);
    const sessionIdInit = useSearchParams();
    const [sessionId, setSessionId] = useState('');
    const [token, setToken] = useState('');
    const [isTimerOn, setIsTimerOn] = useState(false);
    const [remainTime, setRemainTime] = useState(300);
    const [makeMMSS, setMakeMMSS] = useState('');

    const [isOpenLetter, setIsOpenLetter] = useState(false);
    const [comment, setComment] = useState(waitingComment[2]);
    const [cnt, setCnt] = useState(0);

    const showRTCLetter = () => {
        setIsOpenLetter(true);
    }

    const hideRTCLetter = () => {
        setIsOpenLetter(false);
    }

    useEffect(() => {
        if (!sessionIdInit) return;


        const createSession = async () => {
            const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionIdInit }, {
                headers: { 'Content-Type': 'application/json', },
            });
            return response.data; // 세션 ID 받아오기
        }

        const getSessionId = async () => {
            try {
                const newSessionId = await createSession();
                setSessionId(newSessionId);
                setIsTimerOn(true);
            } catch (err) {
                console.error(err);
            }
        }

        getSessionId();

    }, []);

    useEffect(() => {
        const getToken = async () => {
            const aToken = await createToken(sessionId);
            setToken(aToken);
        }


        const createToken = async (sessionId: String) => {
            const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
                headers: { 'Content-Type': 'application/json', },
            });
            return response.data; // The token
        }

    });

    // 3초마다 상단 메세지가 변경경
    useEffect(() => {
        const interval = setInterval(() => {
            setComment(waitingComment[cnt]);
            setCnt((n) => (n + 1) % waitingComment.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [cnt, waitingComment, comment]);

    // 5분동안 타이머 및 지나면 방 폭파
    useEffect(() => {
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
                    return '00:00';
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [remainTime])


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
                    <MyFaceInVideoWaitingRoom />
                    <LetterInVideoOpenButton onPush={showRTCLetter} />
                </div>
            </div>
        </>
    )
}