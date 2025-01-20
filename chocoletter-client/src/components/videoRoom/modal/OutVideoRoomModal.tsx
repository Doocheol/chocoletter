import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import classes from '@/styles/videoRoom.module.css';
import GoToMainMyEventButton from '../button/GoToMainMyEventButton';


const OutVideoRoomModal: React.FC = () => {
    const [remainTime, setRemainTime] = useState(5);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainTime((prev) => {
                if (prev === 1) {
                    router.push('/main/my/event');
                    clearInterval(interval);
                    return 1;
                } else {
                    return prev - 1;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={ classes['modal-background'] }>
        <div className="flex flex-col justify-center items-center h-screen bg-white p-8 rounded-lg shadow-lg">
            <h1>통화가 종료되었어요.</h1>
            <p>초콜릿으로 이어진 이 시간이</p>
            <p>당신께</p>
            <p>재미있거나</p>
            <p>설레거나</p>
            <p>흥미로운 시간이었길 바랍니다.</p>
            <GoToMainMyEventButton/>
            <p className="text-sm">{remainTime}초 후, 내 초콜릿 상자로 이동합니다.</p>
        </div>
        </div>
    )
}

export default OutVideoRoomModal;