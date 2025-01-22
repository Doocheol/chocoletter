import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GeneralLetterForm({ ...props }) {
    const [nickname, setNickname] = useState("");
    const [content, setContent] = useState("");
    const [countContent, setCountContent] = useState(0);

    const nicknameToastId = "nickname-warning";
    const contentToastId =  "content-warning";

    const onNicknameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value.length > 12) {
            const currentNickname = e.currentTarget.value.substring(0, 12);
            if (!toast.isActive(nicknameToastId)) {
                toast.warn("닉네임은 12글자 이하로 설정해주세요!", {
                    toastId: nicknameToastId, 
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
            if (!toast.isActive(contentToastId)) {
                toast.warn("100글자 이하로 작성해주세요!", {
                    toastId: contentToastId, 
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
            <div className="py-2 text-right mb-5 ">
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

export default GeneralLetterForm;