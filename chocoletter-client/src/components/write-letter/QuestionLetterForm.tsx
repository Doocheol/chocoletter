import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShuffleButton } from "./ShuffleButton";
import { getQuestion } from "../../services/questionApi";
import question_icon from "../../assets/images/letter/question_icon.svg";
import { questionLetterState } from "../../atoms/letter/letterAtoms";


const QuestionLetterForm: React.FC = () => {
    const [letter, setLetter] = useRecoilState(questionLetterState);
    // const [randomQuestion, setRandomQuestion] = useState("랜덤질문이 들어갈 자리입니다.")

    const nicknameToastId = "nickname-warning";
    const answerToastId = "answer-warning";

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length > 12) {
            if (!toast.isActive(nicknameToastId)) {
                toast.warn("닉네임은 12글자 이하로 설정해주세요!", {
                    toastId: nicknameToastId,
                    position: "top-center",
                    autoClose: 2000,
                });
            }
            setLetter((prev) => ({ ...prev, nickname: value.substring(0, 12) }));
        } else {
            setLetter((prev) => ({ ...prev, nickname: value }));
        }
    };


    const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length > 200) {
            if (!toast.isActive(answerToastId)) {
                    toast.warn("200글자 이하로 작성해주세요!", {
                    toastId: answerToastId,
                    position: "top-center",
                    autoClose: 2000,
                });
            }
            setLetter((prev) => ({
                ...prev,
                answer: value.substring(0, 200),
                answerLength: 200,
            }));
        } else {
            setLetter((prev) => ({
                ...prev,
                answer: value,
                answerLength: value.length,
            }));
        }
    };

    // 질문 섞기 핸들러
    const onShuffleQuestion = async () => {
        const questionData = await getQuestion(); 
        if (questionData) {
            setLetter((prev) => ({ ...prev, question: questionData }));
        } else {
            toast.error("질문을 가져오는 데 실패했습니다.");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center mb-[20px] gap-[20px]">
            {/* 닉네임 */}
            <div className="relative flex flex-raw justify-center items-center gap-[11px] w-[316px]">
                <p>닉네임</p>
                <input
                    type="text"
                    value={letter.nickname}
                    className="flex min-w-[230px] max-w-[329px] p-2 items-center gap-2 rounded-[15px] border border-black bg-white flex-1 text-center font-sans text-[18px] leading-[22px] tracking-[-0.408px]"
                    onChange={handleNicknameChange}
                    placeholder="닉네임을 필수로 입력해주세요"
                />
            </div>
            {/* 질문 */}
            <div className="flex flex-raw justify-center items-center gap-[10px]">
                <div className="flex min-w-[230px] max-w-[329px] p-[10px] items-center gap-[10px] rounded-[15px] border border-black bg-white">
                    <img src={question_icon} alt="login_view_service_title" className="" />
                    <h1 className="flex-1 text-center font-sans text-[18px] leading-[22px] tracking-[-0.408px]">{letter.question}</h1>
                </div>
                <div>
                    <ShuffleButton altText="질문 섞기 버튼" onShuffleClick={onShuffleQuestion} />
                </div>
            </div>
            {/* 답변 */}
            <div className="relative">
                <textarea
                    value={letter.answer}
                    className="flex w-[361px] min-h-[340px] p-[20px] justify-center items-start gap-[10px] self-stretch rounded-[15px] border border-solid border-black bg-white flex-1 text-[#151517] text-center font-sans text-[18px] leading-[27px] tracking-[-0.408px]"
                    onChange={handleAnswerChange}
                    placeholder="메세지를 작성해보세요(최소 10자)"
                />
                <span className="absolute right-[10px] bottom-[10px] text-gray-400">{letter.answerLength}/200</span>
            </div>
        </div>       
    );
}

export default QuestionLetterForm;