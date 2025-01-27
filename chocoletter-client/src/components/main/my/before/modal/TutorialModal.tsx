import React from "react";
import Modal from "../../../../common/Modal";
import { IoMdInformationCircleOutline } from "react-icons/io";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const tutorialSteps = [
    {
      title: "1. 초콜릿 받기",
      description: "친구로부터 초콜릿을 받아보세요.",
    },
    {
      title: "2. 초콜릿 개봉",
      description: "받은 초콜릿을 개봉하여 내용을 확인하세요.",
    },
    {
      title: "3. 채팅 참여",
      description: "채팅방에 참여하여 친구들과 대화하세요.",
    },
    {
      title: "4. 선물 보내기",
      description: "다른 친구에게 초콜릿을 보내보세요.",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div
        className="flex flex-col items-center px-4 py-4 text-sm tracking-tight leading-none text-center text-black bg-white rounded-3xl"
        aria-labelledby="tutorial-modal-title"
      >
        <div className="flex flex-col justify-center items-center w-full">
          {/* 튜토리얼 아이콘 */}
          <IoMdInformationCircleOutline className="w-6 h-6 text-chocoletterPurpleBold mb-2" />

          {/* 제목 */}
          <div id="tutorial-modal-title" className="text-base font-medium">
            초콜릿 선물 가이드
          </div>

          {/* 튜토리얼 단계 */}
          <div className="flex flex-col justify-center items-center mt-4 space-y-2 w-full">
            {tutorialSteps.map((step, index) => (
              <div
                key={index}
                className="items-start space-x-2"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex-shrink-0"></div>
                <div>
                  <div className="font-semibold text-gray-700">{step.title}</div>
                  <div className="text-gray-500">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TutorialModal;
