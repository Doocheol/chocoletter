import React, { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import FocusLock from "react-focus-lock";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    sender?: string; // 삭제 고려
    receiver?: string; // 삭제 고려
    nickName?: string
    content?: string;
    question?: string;
    answer?: string;
    children?: React.ReactNode;
    className?: string;
}

const GeneralLetterModal: React.FC<ModalProps> = ({ isOpen, onClose, sender, receiver, nickName, content, question, answer, children, className }) => {
    // 편지 담을 state
    const [letter] = useState("Sweet Valentine Letter");
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
        };

        if (isOpen) {
        window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
        window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = () => {
        onClose();
    };

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 모달 콘텐츠 클릭 시 백드롭 클릭 이벤트 방지
    };

    return (
        <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackdropClick}
        >
        <FocusLock>
            <div className="relative w-[clamp(340px,30dvh,400px)] h-[clamp(510px,65dvh,600px)] px-4 py-5 bg-chocoletterLetterBg rounded-[20px] border border-black flex flex-col justify-start items-center gap-[27px]" onClick={handleContentClick}>
                {/* 닫기버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="모달 닫기"
                >
                    <FaXmark className="text-gray-500 text-opacity-50 hover:text-gray-200" size={24} />
                </button>

                {question ? (
                    // 질문이 있을 때
                    <div className="w-full h-full flex flex-col justify-center items-center gap-[27px] pt-7">
                        <div className="h-16 flex flex-col justify-center items-center">
                            <div className="text-center text-black text-2xl font-normal font-sans leading-snug">
                                {nickName}님이 질문을 보냈어요! ❓
                            </div>
                        </div>
                        <div className="w-full h-[calc(100%-6rem)] p-5 bg-white rounded-[15px] border-2 border-dashed border-black">
                            <div className="w-full h-full grow shrink basis-0 text-center text-chocoletterCharacter text-lg font-normal font-sans leading-normal overflow-y-auto">
                                {question} {/* 질문 내용 출력 */}
                            </div>
                        </div>
                    </div>
                ) : (
                    // 질문이 없을 때 (기존 초콜릿 & 편지 UI)
                    <div className="w-full h-full flex flex-col justify-center items-center gap-[27px] pt-7">
                        <div className="h-16 flex flex-col justify-center items-center">
                            <div className="text-center text-black text-2xl font-normal font-sans leading-snug">
                                {nickName}님이 정성 가득 담아 <br />
                                보내주신 초콜릿이에요! 🍫
                            </div>
                        </div>
                        <div className="w-full h-[calc(100%-6rem)] p-5 bg-white rounded-[15px] border-2 border-dashed border-black">
                            <div className="w-full h-full grow shrink basis-0 text-center text-chocoletterCharacter text-lg font-normal font-sans leading-normal overflow-y-auto">
                                편지 내용 {/* 기존 편지 내용 출력 */}
                            </div>
                        </div>
                    </div>
                )}
{/*                     
                <div className="w-full h-full flex flex-col justify-center items-center gap-[27px] pt-7">
                    <div className="h-16 flex flex-col justify-center items-center">
                        <div className="text-center text-black text-2xl font-normal font-sans leading-snug">
                            {sender}님이 정성 가득 담아 <br/>
                            보내주신 초콜릿이에요!🍫
                        </div>
                    </div>
                    <div className="w-full h-[calc(100%-6rem)] p-5 bg-white rounded-[15px] border-2 border-dashed border-black">
                        <div className="w-full h-full grow shrink basis-0 text-center text-chocoletterCharacter text-lg font-normal font-sans leading-normal overflow-y-auto">편지 내용</div>
                    </div>
                </div> */}
            </div>
        </FocusLock>
        </div>
    );
};

export default GeneralLetterModal;
