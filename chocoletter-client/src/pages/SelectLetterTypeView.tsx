import React, {useState, useEffect, useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import { Button } from "../components/common/Button";
import { ImageButton } from "../components/common/ImageButton";
import free_letter_button from "../assets/images/button/free_letter_button.svg";
import question_letter_button from "../assets/images/button/question_letter_button.svg";
import Loading from "../components/common/Loading";

function SelectLetterTypeView() {
    const { giftBoxId } = useParams();
    const navigate = useNavigate();

    // 로딩 상태 및 로드된 버튼 개수 관리
    const [loading, setLoading] = useState(true);
    const [loadedButtons, setLoadedButtons] = useState(0);
    const totalButtons = 2; // ✅ 총 버튼 개수

    // ✅ 모든 버튼이 로드될 때까지 기다림
    useEffect(() => {
        console.log(`Loaded Buttons: ${loadedButtons}/${totalButtons}`); // ✅ 디버깅 로그 추가
        if (loadedButtons > totalButtons) {
            setTimeout(() => setLoading(false), 500); // 부드러운 전환 효과
        }
    }, [loadedButtons]); // ✅ 버튼 개수 변경 감지

     // **백그라운드에서 이미지 미리 로드 후 버튼을 렌더링**
    useEffect(() => {
        const img1 = new Image();
        const img2 = new Image();

        img1.src = free_letter_button;
        img2.src = question_letter_button;

        img1.onload = () => setLoadedButtons((prev) => prev + 1);
        img2.onload = () => setLoadedButtons((prev) => prev + 1);
    }, []);

    // // 버튼이 모두 로드되었는지 확인
    // useEffect(() => {
    //     setTimeout(() => setLoading(false), 5000); // 부드러운 전환을 위해 최소 500ms 유지
    //     }
    // , []);

    const handleAccept = () => {
        navigate(`/write/general/${giftBoxId}`); 
    };

    const handleReject = () => {
        navigate(`/write/question/${giftBoxId}`);
    };

    if (loading) {
        return <Loading />; 
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden">
            {/* 상단 bar */}
            <div className="w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex flex-col justify-center items-center gap-[15px] fixed z-50">
                <div className="self-stretch justify-between items-center inline-flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                        <GoBackButton />
                    </div>
                    <div className="text-center text-white text-2xl font-normal font-sans leading-snug">편지지 선택하기</div>
                    <div className="w-6 h-6" />
                </div>
            </div>

            <div className="absolute mt-24">

                {/* 일반/랜덤 버튼 */}
                <div className="flex flex-col items-center justify-center m-4">
                    <h1 className="text-[22px] font-bold mb-[30px]">
                        발렌타인데이, <br/>
                        마음을 전할 편지지를 선택하세요!💌
                    </h1>
                    <div className="flex flex-col items-center gap-[20px]">
                        <ImageButton
                            onClick={handleAccept}
                            src={free_letter_button}
                            // className="w-[81px] h-14 flex items-center justify-center rounded-[15px] border border-black group"
                        />
                        <ImageButton
                            onClick={handleReject}
                            src={question_letter_button}
                            // className="w-[81px] h-14 flex items-center justify-center rounded-[15px] border border-black group"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectLetterTypeView;
 