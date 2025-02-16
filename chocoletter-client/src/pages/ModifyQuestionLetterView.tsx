import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { GoBackButton } from "../components/common/GoBackButton";
import QuestionLetterForm from "../components/write-letter/QuestionLetterForm";
import "react-toastify/dist/ReactToastify.css";
import login_view_service_title from "../assets/images/logo/login_view_service_title.svg";
import { questionLetterState } from "../atoms/letter/letterAtoms" ;
import { ImageButton } from "../components/common/ImageButton";
import modify_button from "../assets/images/button/modify_button.svg";
import { updateLetter } from "../services/giftEncryptedApi";

const ModifyQuestionLetterView = () => {
    const [letter, setLetter] = useRecoilState(questionLetterState);
    const [searchParams] = useSearchParams();
    const giftId = searchParams.get("giftId");
    const navigate = useNavigate();
    const resetLetterState = () => {
        setLetter({
            nickname: "",
            question: "",
            answer: "",
            answerLength: 0,
        });
    };
    
    // 뒤로 가기 클릭 : 상태 초기화
    const handleGoBack = () => {
        resetLetterState(); 
    };

    // 편지 수정 버튼 클릭 : 편지 수정 요청
    const handleModify = async () => {
            try {
                await updateLetter(
                    giftId as string,
                    letter.nickname,
                    letter.question,
                    letter.answer,
                    null);
            } catch (error: any) {
                new Error("질문 형식 편지 수정 실패")
            }
            navigate("/sent-gift"); // 전송 완료 화면으로 이동 
        }


    return (
        <div className="relative flex flex-col items-center h-screen bg-letter-blue-background">
            <GoBackButton strokeColor="#9E4AFF" altText="뒤로가기 버튼" onClick={handleGoBack} />
            <div className="absolute mt-[41px] m-4">
                {/* 로고 이미지  */}
                <div className="flex flex-col items-center mb-[30px]">
                    <img src={login_view_service_title} alt="login_view_service_title" className="" />
                </div>

                <div>
                    {/* 질문 편지 양식 */}
                    <QuestionLetterForm />

                    {/* 편지 수정 완료 버튼 */}
                    <div className="relatvie text-center">
                        <ImageButton
                            onClick={handleModify}
                            src={modify_button}
                            className="absolute right-0 gap-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifyQuestionLetterView;
