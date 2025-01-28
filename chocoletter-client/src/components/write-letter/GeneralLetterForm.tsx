import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface GeneralLetterFormProps {
    setNickname: (nickname: string) => void;
    setContent: (content: string) => void;
    onContentChange?: (length: number) => void;
}

const GeneralLetterForm: React.FC<GeneralLetterFormProps> = ({
    setNickname,
    setContent,
    onContentChange,
}) => {
    const [nickname, updateNickname] = useState<string>("");
    const [content, updateContent] = useState<string>("");
    const [contentLength, setContentLength] = useState<number>(0);

    const nicknameToastId = "nickname-warning";
    const contentToastId = "content-warning";

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length > 12) {
            const truncatedValue = value.substring(0, 12);
            if (!toast.isActive(nicknameToastId)) {
                toast.warn("닉네임은 12글자 이하로 설정해주세요!", {
                    toastId: nicknameToastId,
                    position: "top-center",
                    autoClose: 2000,
                });
            }
            updateNickname(truncatedValue);
            setNickname(truncatedValue);
        } else {
            updateNickname(value);
            setNickname(value);
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length > 100) {
            const truncatedValue = value.substring(0, 100);
            if (!toast.isActive(contentToastId)) {
                toast.warn("100글자 이하로 작성해주세요!", {
                    toastId: contentToastId,
                    position: "top-center",
                    autoClose: 2000,
                });
            }
            updateContent(truncatedValue);
            setContent(truncatedValue);
            setContentLength(100);
            onContentChange?.(100);
        } else {
            updateContent(value);
            setContent(value);
            setContentLength(value.length);
            onContentChange?.(value.length);
            // console.log("Current Content Length:", value.length)
        }
    };

    return (
        <div>
            <div className="relative">
                <input
                    type="text"
                    value={nickname}
                    className="w-[300px] h-[50px] mt-2 mb-4 text-center bg-pink-100 border-4 border-gray-300 outline-none rounded-lg"
                    onChange={handleNicknameChange}
                    placeholder="닉네임을 필수로 입력해주세요"
                />
            </div>
            <div className="py-2 text-right mb-5">
                <textarea
                    value={content}
                    className="block w-[300px] h-[300px] text-center mx-auto p-2 border-4 border-gray-300 outline-none rounded-lg resize-none"
                    onChange={handleContentChange}
                    placeholder="메세지를 작성해보세요(최소 10자)"
                />
                <span className="text-gray-400 pr-5">{contentLength}/100</span>
            </div>
        </div>
    );
};

export default GeneralLetterForm;
