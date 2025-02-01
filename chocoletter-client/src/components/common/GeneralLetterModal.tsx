import React, { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import FocusLock from "react-focus-lock";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    sender?: string;
    receiver?: string;
    content: string;
    children?: React.ReactNode;
    className?: string;
}

const GeneralLetterModal: React.FC<ModalProps> = ({ isOpen, onClose, content, sender, receiver, children, className }) => {
    // 편지 담을 state
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
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackdropClick}
        >
        <FocusLock>
            <div className="relative w-[clamp(340px,30dvh,400px)] h-[clamp(510px,65dvh,600px)] px-4 py-5 bg-chocoletterLetterBg rounded-[20px] border border-black flex flex-col justify-start items-center gap-[27px]" onClick={handleContentClick}>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="모달 닫기"
                >
                    <FaXmark className="text-gray-500 text-opacity-50 hover:text-gray-200" size={24} />
                </button>
                <div className="w-full h-full flex flex-col justify-center items-center gap-[27px] pt-7">
                    <div className="h-16 flex flex-col justify-center items-center">
                        <div className="text-center text-black text-2xl font-normal font-sans leading-snug">
                            정성이 가득 담긴 <br/>
                            초콜릿 편지예요!🍫
                        </div>
                    </div>
                    <div className="w-full h-[calc(100%-6rem)] p-5 bg-white rounded-[15px] border-2 border-dashed border-black">
                        <div className="w-full h-full grow shrink basis-0 text-center text-chocoletterCharacter text-lg font-normal font-sans leading-normal overflow-y-auto">{content}</div>
                    </div>
                </div>
            </div>
        </FocusLock>
        </div>
    );
};

export default GeneralLetterModal;
