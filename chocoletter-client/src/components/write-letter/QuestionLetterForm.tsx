import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShuffleButton } from "./ShuffleButton";
import { getQuestion } from "../../services/questionApi";

function QuestionLetterForm({ ...props }) {
    const [nickname, setNickname] = useState("");
    const [content, setContent] = useState("");
    const [countContent, setCountContent] = useState(0);
    const [randomQuestion, setRandomQuestion] = useState("랜덤질문이 들어갈 자리입니다.")


    // 더미 데이터
    const dummyQuestions = [
        "함께 가보고 싶은 여행지는 어디인가요?",
        "상대방과 함께한 추억 중 가장 기억에 남는 순간은 무엇인가요?",
        "상대방에게 고맙다고 말하고 싶은 일이 있다면 무엇인가요?",
        "우리만의 특별한 하루를 계획한다면 무엇을 하고 싶나요?",
        "상대방이 내게 가장 큰 용기를 준 순간은 언제인가요?",
        "상대방과 함께 이루고 싶은 목표가 있다면 무엇인가요?",
        "서로의 취향을 반영한 특별한 선물을 고른다면 무엇을 주고 싶나요?",
        "상대방과의 관계에서 가장 소중하다고 느꼈던 순간은 언제인가요?",
        "서로의 어린 시절 이야기를 나눠본 적 있나요? 기억나는 에피소드는?",
        "함께 도전해보고 싶은 새로운 취미가 있다면 무엇인가요?",
        "우리만의 특별한 기념일을 만든다면 어떤 날로 정하고 싶나요?",
        "상대방이 나를 웃게 했던 가장 기억나는 순간은 무엇인가요?",
        "서로에게 배우고 싶은 점이 있다면 무엇인가요?",
        "상대방이 내게 준 가장 큰 감동은 무엇이었나요?",
        "앞으로 함께하고 싶은 가장 큰 도전은 무엇인가요?",
    ];

    const onNicknameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value.length > 25) {
            const currentNickname = e.currentTarget.value.substring(0, 25);
            if (!toast.isActive("nickname-warning")) {
                toast.warn("닉네임은 25글자 이하로 설정해주세요!", {
                    toastId: "nickname-warning", 
                    position: "top-center",
                    autoClose: 2000,
                });
            }
            props.setNickname(currentNickname);
            setNickname(currentNickname);
        } else {
            const currentNickname = e.currentTarget.value;
            props.setNickname(currentNickname);
            setNickname(currentNickname);
        }
    };

    const onContentHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const currentContent = e.currentTarget.value.substring(0, 100);
        if (e.currentTarget.value.length > 100) {
            if (!toast.isActive("content-warning")) {
                toast.warn("100글자 이하로 작성해주세요!", {
                    toastId: "content-warning", 
                    position: "top-center",
                    autoClose: 2000,
                });
            }
            props.setContent(currentContent);
            setContent(currentContent);
            setCountContent(100);
        } else {
            const currentContent = e.currentTarget.value;
            props.setContent(currentContent);
            setContent(currentContent);
            setCountContent(e.currentTarget.value.length);
        }
        // 부모로 content 길이 전달
        if (props.onContentChange) {
            props.onContentChange(currentContent.length);
        }
    };

    // // 질문 섞기 핸들러
    // const onShuffleQuestion = async () => {
    //     const questionData = await getQuestion(); 
    //     if (questionData) {
    //         setRandomQuestion(questionData.question);
    //     } else {
    //         toast.error("질문을 가져오는 데 실패했습니다.");
    //     }
    // };

    // 셔플 동작을 테스트
    const onShuffleQuestion = () => {
        const randomIndex = Math.floor(Math.random() * dummyQuestions.length); // 무작위 인덱스 선택
        setRandomQuestion(dummyQuestions[randomIndex]); // 질문 업데이트
    };

    return (
        <div>
            <ToastContainer />
            <div className="relative">
                <input
                    type="text"
                    value={nickname}
                    className="w-[300px] h-[50px] mt-2 mb-4 text-center bg-pink-100 border-4 border-gray-300 outline-none rounded-lg"
                    onChange={onNicknameHandler}
                    placeholder="닉네임을 필수로 입력해주세요"
                />
            </div>
            <div className="text-right mb-5 ">
                <div className="w-[300px] flex flex-row items-center justify-between ">
                    <div className="w-[250px] h-[100px] flex text-center p-2 bg-gray-100 border-y-4 border-l-4 border-gray-300 outline-none rounded-tl-lg rounded-bl-lg">
                        <h1>{randomQuestion}</h1>
                    </div>
                    <div>
                        <ShuffleButton altText="질문 섞기 버튼" onShuffleClick={onShuffleQuestion} />
                    </div>
                </div>
                <textarea
                    value={content}
                    className="block w-[300px] h-[300px] text-center mx-auto p-2 border-4 border-gray-300 outline-none rounded-lg resize-none"
                    onChange={onContentHandler}
                    placeholder="메세지를 작성해보세요(최소 10자)"
                />
                <span className="text-gray-400 pr-5">{countContent}/100</span>
            </div>
        </div>
    );
}

export default QuestionLetterForm;