import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isLoginAtom } from '../atoms/auth/userAtoms';
import { freeLetterState, questionLetterState } from '../atoms/letter/letterAtoms';
import { WaitingTest } from '../components/video-room/VideoWaiting';
import TestVideoRoomView from './TestVideoRoomView';
import { checkAuthVideoRoom } from '../services/openviduApi';

const AllVideoRoomView = () => {
    const [isWaitingRoom, setIsWaitingRoom] = useState(true);
    const { sessionIdInit, giftId } = useParams();
    const navigate = useNavigate();
    const isLogin = useRecoilValue(isLoginAtom);
    const setFreeLetter = useSetRecoilState(freeLetterState);
    const setQuestionLetter = useSetRecoilState(questionLetterState);

    // 로그인 확인
    if (!isLogin) navigate("/");

    

    // 입장 확인 API
    if (sessionIdInit) {
        const checkAuth = checkAuthVideoRoom(sessionIdInit);
        console.log(checkAuth)
    }

    // 편지 찾기

    // 대기방, 채팅방 전환
    const handleMoveToVideo = () => {
        setIsWaitingRoom(false);
    }

    return (
        <div>
            {isWaitingRoom ? (
                <WaitingTest onMoveToVideo={handleMoveToVideo} />
            ) : (
                <TestVideoRoomView />
            )}
        </div>
    )
};

export default AllVideoRoomView;