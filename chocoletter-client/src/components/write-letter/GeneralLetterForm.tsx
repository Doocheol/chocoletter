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
        if (value.length > 200) {
            const truncatedValue = value.substring(0, 200);
            if (!toast.isActive(contentToastId)) {
                toast.warn("200글자 이하로 작성해주세요!", {
                    toastId: contentToastId,
                    position: "top-center",
                    autoClose: 2000,
                });
            }
            updateContent(truncatedValue);
            setContent(truncatedValue);
            setContentLength(200);
            onContentChange?.(200);
        } else {
            updateContent(value);
            setContent(value);
            setContentLength(value.length);
            onContentChange?.(value.length);
            // console.log("Current Content Length:", value.length)
        }
    };

    return (
        <div className="flex flex-col justify-center items-center mb-[20px]">
            <div className="relative flex flex-raw justify-center items-center mb-[16px] gap-[11px] w-[316px]">
                <p>닉네임</p>
                <input
                    type="text"
                    value={nickname}
                    className="flex min-w-[230px] max-w-[329px] p-2 items-center gap-2 rounded-[15px] border border-black bg-white flex-1 text-center font-sans text-[18px] leading-[22px] tracking-[-0.408px]"
                    onChange={handleNicknameChange}
                    placeholder="닉네임을 필수로 입력해주세요"
                />
            </div>
            <div className="relative">
                <textarea
                    value={content}
                    className="flex w-[361px] min-h-[340px] p-[20px] justify-center items-start gap-[10px] self-stretch rounded-[15px] border border-solid border-black bg-white flex-1 text-[#151517] text-center font-sans text-[18px] leading-[27px] tracking-[-0.408px]"
                    onChange={handleContentChange}
                    placeholder="메세지를 작성해보세요(최소 10자)"
                />
                <span className="absolute right-[10px] bottom-[10px] text-gray-400">{contentLength}/200</span>
            </div>
        </div>
    );
};

export default GeneralLetterForm;
