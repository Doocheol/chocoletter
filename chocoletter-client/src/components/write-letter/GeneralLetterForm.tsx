import React from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { freeLetterState } from "../../atoms/letter/letterAtoms" ;

const GeneralLetterForm: React.FC = () => {
    const [letter, setLetter] = useRecoilState(freeLetterState);

    const nicknameToastId = "nickname-warning";
    const contentToastId = "content-warning";

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

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length > 200) {
        if (!toast.isActive(contentToastId)) {
            toast.warn("200글자 이하로 작성해주세요!", {
            toastId: contentToastId,
            position: "top-center",
            autoClose: 2000,
            });
        }
        setLetter((prev) => ({
            ...prev,
            content: value.substring(0, 200),
            contentLength: 200,
        }));
        } else {
        setLetter((prev) => ({
            ...prev,
            content: value,
            contentLength: value.length,
        }));
        }
    };

  return (
    <div className="flex flex-col justify-center items-center mb-[20px]">
      <div className="relative flex flex-row justify-center items-center mb-[16px] gap-[11px] w-[316px]">
        <p>닉네임</p>
        <input
          type="text"
          value={letter.nickname}
          className="flex min-w-[230px] max-w-[329px] p-2 items-center gap-2 rounded-[15px] border border-black bg-white flex-1 text-center font-sans text-[18px] leading-[22px] tracking-[-0.408px]"
          onChange={handleNicknameChange}
          placeholder="닉네임을 필수로 입력해주세요"
        />
      </div>
      <div className="relative">
        <textarea
          value={letter.content}
          className="flex w-[361px] min-h-[340px] p-[20px] justify-center items-start gap-[10px] self-stretch rounded-[15px] border border-solid border-black bg-white flex-1 text-[#151517] text-center font-sans text-[18px] leading-[27px] tracking-[-0.408px]"
          onChange={handleContentChange}
          placeholder="메세지를 작성해보세요(최소 10자)"
        />
        <span className="absolute right-[10px] bottom-[10px] text-gray-400">
          {letter.contentLength}/200
        </span>
      </div>
    </div>
  );
};

export default GeneralLetterForm;
