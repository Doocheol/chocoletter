import React, {useState, useEffect, useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import { Button } from "../components/common/Button";
import blue from "../assets/images/letter/letter_blue.svg"
import pink from "../assets/images/letter/letter_pink.svg"
import { ImageButton } from "../components/common/ImageButton";
import free_letter_button from "../assets/images/button/free_letter_button.svg";
import question_letter_button from "../assets/images/button/question_letter_button.svg";
import Loading from "../components/common/Loading";

function SelectLetterTypeView() {
    const { giftBoxId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // 버튼들의 ref를 관리하기 위한 배열 생성
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

     // 모든 버튼이 렌더링되었는지 확인하는 함수
    const checkButtonsRendered = () => {
        // 모든 버튼이 렌더링되었는지 확인
        const allRendered = buttonRefs.current.every((ref) => ref !== null);
        if (allRendered) {
            setLoading(false); // 로딩 상태 종료
        }
    };

    // 컴포넌트가 마운트될 때 렌더링 확인
    useEffect(() => {
        checkButtonsRendered();
    }, []);

    const handleAccept = () => {
        navigate(`/write/general/${giftBoxId}`); 
    };

    const handleReject = () => {
        navigate(`/write/question/${giftBoxId}`);
    };

    if (loading) {
        return <Loading />; // 로딩 상태 표시
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
                            ref={(el) => {
                                buttonRefs.current[0] = el;
                                checkButtonsRendered(); // 버튼 렌더링 여부 확인
                            }}
                            onClick={handleAccept}
                            src={free_letter_button}
                            // className="w-[81px] h-14 flex items-center justify-center rounded-[15px] border border-black group"
                        />
                        <ImageButton
                            ref={(el) => {
                                buttonRefs.current[1] = el;
                                checkButtonsRendered(); // 버튼 렌더링 여부 확인
                            }}
                            onClick={handleReject}
                            src={question_letter_button}
                            // className="w-[81px] h-14 flex items-center justify-center rounded-[15px] border border-black group"
                        />
                    </div>
                    {/* <Button
                        onClick={handleAccept}
                        className="w-[364px] h-[132px] inline-flex p-[15px_25px] items-center gap-[27px] rounded-[20px] border border-black bg-white" 
                    >
                        <img src={pink} alt="일반 편지지 이미지" className="w-[100px] h-[100px] flex-shrink-0 rounded-[10px] border-[1px] border-black object-cover"></img>
                        <div className="flex flex-col gap-[14px] text-left ">
                            <p className="self-stretch text-[18px] leading-[22px] tracking-[-0.408px]">일반 편지지</p>
                            <p className="self-stretch font-[Pretendard] text-[13px] leading-[140%]">진심을 담은 자유 형식의 편지를 작성해 상대방에게 마음을 전하세요✏️</p>
                        </div>
                    </Button> */}
                    {/* <Button
                        onClick={handleReject}
                        className="w-[364px] h-[132px] inline-flex p-[15px_25px] items-center gap-[27px] rounded-[20px] border border-black bg-white" 
                    >
                        <img src={blue} alt="랜덤 질문 편지지 이미지" className="w-[100px] h-[100px] flex-shrink-0 rounded-[10px] border-[1px] border-black object-cover"></img>
                        <div className="flex flex-col gap-[14px] text-left ">
                            <p className="self-stretch text-[18px] leading-[22px] tracking-[-0.408px]">랜덤 질문 편지지</p>
                            <p className="self-stretch font-[Pretendard] text-[13px] leading-[140%]">랜덤하게 생성된 질문에 답하며 색다른 감동을 선사해 보세요🎁</p>
                        </div>
                    </Button> */}
                </div>
            </div>
        </div>
    );
}

export default SelectLetterTypeView;
 