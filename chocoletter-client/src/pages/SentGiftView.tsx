import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import chocoletter_login_view_logo from "../assets/images/logo/chocoletter_login_view_logo.png";


// 편지 작성 완료 후, 전송 완료 페이지
const SentGiftView = () => {
    const [remainTime, setRemainTime] = useState(5000);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainTime((prev) => {
                if (prev === 1) {
                    navigate('/main/my/before');
                    clearInterval(interval);
                    return 1;
                } else {
                    return prev - 1;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    const goBackMainMyEvent = () => {
        navigate('/main/my/before')
    }
    
	return (
        <div className="relative flex flex-col items-center h-screen">
            <div className="absolute mt-24 px-8">
                <div className="h-1/3 flex justify-center items-center mb-24">
                    <img
                        src={chocoletter_login_view_logo}
                        alt="chocoletter_login_view_logo"
                        className="max-h-40"
                    />
                </div>
                <h1 className="text-xl font-bold mb-4">
                    달콤한 초콜릿 편지가 무사히 전달되었어요! 💌 <br/>
                    내 초콜릿 상자도 함께 나누며 행복을 더해보세요. 🍫💕 <br/>
                </h1>
                <h3 className="text-sm text-gray-500 font-bold mb-24">
                    편지를 2개 받을 때마다 2월 14일 전에 하나를 먼저 열어볼 수 있답니다!
                </h3>
                <div className="mb-8 text-center">
                    <Button
                        onClick={goBackMainMyEvent}
                        className="w-[300px] h-[50px] px-1 mb-4" 
                    >
                        내 초콜릿 상자로 이동하기
                    </Button>
                    <p className="text-sm">{remainTime}초 후, 내 초콜릿 상자로 이동합니다.</p>
                </div>
                
            </div>
		</div>
	);
};

export default SentGiftView;
