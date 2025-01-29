import { useNavigate } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import { Button } from "../components/common/Button";
import general from "../assets/images/chocolate/general/gen_choco_1.png"
import special from "../assets/images/chocolate/special/rtc_choco_1.png"

function SelectGiftTypeView() {
    const navigate = useNavigate();

    const handleAccept = () => {
        navigate("/set-time"); 
    };

    const handleReject = () => {
        navigate("/sentgift");
    };

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

                {/* 일반/특별 버튼 */}
                <div className="flex flex-col items-center justify-center m-4 gap-[30px]">
                    <div className="flex flex-col px-[15px]">
                        <p className="text-2xl font-bold text-left">
                            같이 개봉하실래요?
                        </p>
                        <p className="self-stretch font-[Pretendard] text-[13px] leading-[140%]">
                            같이 개봉하는 경우 지정된 시간에 
                            편지를 전해드리고, <br/>
                            지정한 시간에 화면 너머로 
                            따스한 마음을 나눌 수 있습니다.
                        </p>
                    </div>
                    <Button
                        onClick={handleAccept}
                        className="w-[305px] h-p-[132px] inline-flex p-[15px_25px] items-center gap-[27px] rounded-[20px] border border-black bg-white" 
                    >
                        <img src={special} alt="특별 초콜릿 이미지" className="w-[50px] h-[50px] flex-shrink-0 rounded-[10px] "></img>
                        <div className="flex flex-col gap-[14px] text-left ">
                            <p className="self-stretch text-[18px] leading-[22px] tracking-[-0.408px]">
                                와, 정말 기대돼요! <br/> 2월 14일에 함께 열어봐요.
                            </p>
                        </div>
                    </Button>
                    <Button
                        onClick={handleReject}
                        className="w-[305px] h-p-[132px] inline-flex p-[15px_25px] items-center gap-[27px] rounded-[20px] border border-black bg-white" 
                    >
                        <img src={general} alt="일반 초콜릿릿 이미지" className="w-[50px] h-[50px] flex-shrink-0 rounded-[10px] "></img>
                        <div className="flex flex-col gap-[14px] text-left ">
                            <p className="self-stretch text-[18px] leading-[22px] tracking-[-0.408px]">
                                아니요 괜찮아요. <br/> 마음만 전할래요.
                            </p>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
        // <div className="relative flex flex-col items-center h-screen">
        //      {/* GoBackButton을 좌측 상단에 고정 */}
        //      <GoBackButton altText="뒤로가기 버튼" />
            
        //     <div className="absolute mt-24">
        //         <h1 className="text-xl font-bold mb-8">
        //             2월 14일, 편지를 받는 분과 함께 <br/>
        //             달콤한 순간을 나눌 준비가 되셨나요? <br/>
        //             같이 개봉해보실래요? 🥰
        //         </h1> 
        //         <h3 className="text-sm text-gray-500 mb-12">
        //             같이 개봉하는 경우 지정된 시간에 <br/>
        //             달콤한 초콜릿을 전해드리고, <br/>
        //             지정한 시간에 화면 너머로 <br/>
        //             따스한 마음을 나눌 수 있습니다.
        //         </h3>

        //         {/* 일반/랜덤 버튼 */}
        //         <div className="mb-8 text-center">
        //             <Button
        //                 onClick={handleAccept}
        //                 className="w-[300px] h-[100px] px-1" 
        //             >
        //                 <p className="text-xl">같이 개봉하기🥰</p>
        //             </Button>
        //         </div>
        //         <div className="mb-8 text-center">
        //             <Button
        //                 onClick={handleReject}
        //                 className="w-[300px] h-[100px] px-1" 
        //             >
        //                 <p className="text-xl">마음만 전할래요🫣 </p>
        //             </Button>
        //         </div>
        //     </div>
        // </div>
    );
}

export default SelectGiftTypeView;