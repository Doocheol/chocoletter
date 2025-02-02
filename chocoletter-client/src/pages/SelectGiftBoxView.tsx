import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { giftBoxNumAtom, giftBoxIdAtom } from "../atoms/auth/userAtoms";
import { GoBackButton } from "../components/common/GoBackButton";

// 선물상자 에셋 임포트
import box1 from "../assets/images/giftbox/giftbox_before_1.svg";
import box2 from "../assets/images/giftbox/giftbox_before_2.svg";
import box3 from "../assets/images/giftbox/giftbox_before_3.svg";
import box4 from "../assets/images/giftbox/giftbox_before_4.svg";
import box5 from "../assets/images/giftbox/giftbox_before_5.svg";
import { Button } from "../components/common/Button";

const SelectGiftBoxView: React.FC = () => {
  const navigate = useNavigate();
  const giftBoxId = useRecoilValue(giftBoxIdAtom);
  const setGiftBoxNum = useSetRecoilState(giftBoxNumAtom);

  const [selectedBox, setSelectedBox] = useState<number>(1);

  const giftBoxOptions = [
    { id: 1, image: box1, color: "#FC95F7" },
    { id: 2, image: box2, color: "#FFF7BB" },
    { id: 3, image: box3, color: "#6C77FF" },
    { id: 4, image: box4, color: "#DACEC2" },
    { id: 5, image: box5, color: "#494949" },
  ];

  const handleSelectBox = (id: number) => {
    setSelectedBox(id);
  };

  const handleConfirmSelection = () => {
    setGiftBoxNum(selectedBox);
    navigate(`/${giftBoxId}`);
  };

  // 현재 선택된 선물상자 정보 가져오기
  const selectedBoxInfo = giftBoxOptions.find((box) => box.id === selectedBox);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden">
      {/* 상단 헤더 */}
      <div className="w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex flex-col justify-center items-center gap-[15px] fixed z-50">
        <div className="self-stretch flex justify-between items-center">
          <div className="w-6 h-6 flex justify-center items-center">
            <GoBackButton />
          </div>
          <div className="text-center text-white text-2xl font-normal font-sans leading-snug">
            내 선물상자를 골라주세요!
          </div>
          <div className="w-6 h-6" />
        </div>
      </div>

      {/* 선택된 선물상자 이미지 영역 */}
      <div className="mt-28 flex justify-center items-center w-full pl-10">
        {selectedBoxInfo && (
          <img
            src={selectedBoxInfo.image}
            alt={`선택된 선물상자 ${selectedBoxInfo.id}`}
            className="w-60 h-auto" // 사이즈 조절은 필요에 따라 변경
          />
        )}
      </div>

      {/* 선물상자 색상 선택 영역 */}
      <div className="flex flex-row mt-8 mb-4 gap-4 p-4">
        {giftBoxOptions.map((box) => (
          <div
            key={box.id}
            className={`cursor-pointer rounded-lg p-4 flex justify-center items-center border-2 transition-transform ${
              selectedBox === box.id ? "border-black" : "border-transparent"
            }`}
            style={{ backgroundColor: box.color }}
            onClick={() => handleSelectBox(box.id)}
          ></div>
        ))}
      </div>

      {/* 선택 완료 버튼 */}
      <Button
        onClick={handleConfirmSelection}
        className="px-6 py-3 bg-chocoletterPurpleBold text-xl font-medium text-white rounded-lg shadow"
      >
        이걸로 할게요!
      </Button>
    </div>
  );
};

export default SelectGiftBoxView;
