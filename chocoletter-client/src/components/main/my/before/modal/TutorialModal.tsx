import React from "react";
import Modal from "../../../../common/Modal";
import tutorial_icon from "../../../../../assets/images/main/tutorial_icon.svg"; // 적절한 아이콘 이미지 경로로 변경

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const messages = [
    "[2월 14일 이전]",
    "'일반' 초콜릿을 2개 받을 때마다 1개씩 편지를 열어볼 수 있습니다.",
    " ",
    " ",
    "[2월 14일 발렌타인데이 당일]",
    "1. 모든 편지를 확인할 수 있어요.",
    "2. 비밀스러운 둘만의 채팅 공간과 영상 통화 공간이 열려요.",
    "3. 2월 14일에 들어오면 나의 영상 통화 스케줄표와",
    ".... 영상 통화 공간에 대한 링크를 전부 제공받을 수 있습니다.",
    ".... 카카오톡 나에게 보내기로 일정을 보관하세요.",
    ".... 누가 초콜릿을 만들어줬는지 미리 상상해봐요.",
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div
        className="flex flex-col px-4 py-2 text-lg tracking-tight leading-none text-left text-black bg-white rounded-3xl"
        aria-labelledby="tutorial-modal-title"
      >
        <div className="flex flex-col justify-center items-center w-full">
          {/* 튜토리얼 아이콘 */}
          <img src={tutorial_icon} className="w-6 h-6 mb-2" alt="Tutorial Icon" />

          {/* 제목 */}
          <div id="tutorial-modal-title" className="text-xl font-medium">
            초코레터 공지사항
          </div>

          {/* 메시지 목록 */}
          <div className="mt-4 space-y-1">
            {messages.map((message, index) => (
              <div
                key={index}
                className="text-gray-400 whitespace-nowrap overflow-hidden text-xs wave-down"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TutorialModal;
