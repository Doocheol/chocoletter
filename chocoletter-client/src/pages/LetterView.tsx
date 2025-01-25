import React, { useEffect, useState } from "react";
import { useRecoilValue } from 'recoil';
import { selectedGiftIdAtom } from "../atoms/gift/giftAtoms";
import { GoBackButton } from "../components/common/GoBackButton";
import { GoArrowLeft } from "react-icons/go";
import { getGiftDetail } from "../services/giftApi";
import Gift from "../components/letter/Letter";
import Loading from "../components/common/Loading"

// 편지 보는 뷰
// gift list page 에서 초콜릿 선택 시 보이게 됨.
interface GiftData {
    nickName?: string;
    content?: string | null;
    question?: string | null;
    answer?: string | null;
}

const LetterView = () => {
    const selectedGiftId = 2 // useRecoilValue(selectedGiftIdAtom); //giftlist 페이지에서 저장된 giftId

    const [giftData, setGiftData] = useState<GiftData | null>(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchGiftData = async () => {
            if (selectedGiftId) {
                try {
                    const data = await getGiftDetail(selectedGiftId); // API 호출
                    setGiftData(data); 
                } catch (error) {
                    console.error("Error fetching gift data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchGiftData();
    }, [selectedGiftId]);

    


    return (
        <div className="relative flex flex-col items-center h-screen">
            {/* GoBackButton을 좌측 상단에 고정 */}
            <GoBackButton icon={<GoArrowLeft />} altText="뒤로가기 버튼" />

            {/* 메인 콘텐츠 렌더링 */}

            {loading ? (
                <Loading />
            ) : (
                <div className="absolute mt-24">
                <GiftView
                giftData={
                    giftData || { 
                        nickName: "Anonymous",
                        content: null,
                        question: "No question provided",
                        answer: "No answer provided",
                    }
                }
                />
                </div>
            )}
        </div>
    );
};

// 로딩 화면 컴포넌트
// const LoadingView = () => (
//     <div className="flex flex-col justify-center items-center h-full text-2xl">
//         <h1>Loading...</h1>
//     </div>
// );



// Gift 컴포넌트 렌더링 컴포넌트
const GiftView: React.FC<{ giftData: GiftData }> = ({ giftData }) => (
    <div className="flex flex-col justify-center items-center mt-12">
        <Gift
            nickName={giftData.nickName || "Anonymous"}
            content={giftData.content || null}
            question={giftData.question || "No question provided"}
            answer={giftData.answer || "No answer provided"}
            />
    </div>
);

export default LetterView;