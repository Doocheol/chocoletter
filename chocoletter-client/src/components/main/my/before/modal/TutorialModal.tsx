import React from "react";
import Modal from "../../../../common/Modal";
import tutorial_icon from "../../../../../assets/images/main/tutorial_icon.svg"; // 적절한 아이콘 이미지 경로로 변경

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const messages = [
    "'초코레터'의 초콜릿은 특별합니다.",
    "- 익명으로 상대방에게 편지를 쓰고 초콜릿을 전달할 수 있어요.",
    "- 편지는 자유 양식과 랜덤 질문으로 구성되어 있어요.",
    "- 그리고 스페셜 초콜릿을 만드시면 둘만의 영상 통화 공간이 열려요.",
    " ",
    " ",
    "[2월 14일 이전]",
    "- 알림 아이콘을 클릭하여 영상 통화 수락/거절 여부를 선택해주세요.",
    "- 그리고 2월 14일에 설정된 본인의 스케줄을 미리 확인하실 수 있어요.",
    "- '일반' 초콜릿을 2개 받을 때마다 1개씩 편지를 열어볼 수 있습니다.",
    " ",
    " ",
    "[2월 14일 당일] Valentine's Day !",
    "- 선물상자를 오픈하면 모든 편지를 확인할 수 있어요.",
    "- 채팅 아이콘을 클릭하면 익명의 상대방과 대화할 수 있어요.",
    "- 2월 14일에 접속하면 오늘 일정을 제공해드려요.",
    "- 그리고 일정에 해당하는 모든 링크를 복사하실 수 있습니다.",
    "- 복사하신 링크는 카카오톡 나에게 보내기로 일정을 보관하세요.",
    " ",
    " ",
    "그러면, 이제 누가 초콜릿을 만들어줬는지 같이 상상해 볼까요?",
    "작성된 모든 개인정보와 편지는 암호화되어 안전하게 보관됩니다.",
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md ml-1">
      <div
        className="flex flex-col px-4 py-2 tracking-tight leading-none text-left text-black bg-white rounded-3xl"
        aria-labelledby="tutorial-modal-title"
      >
        <div className="flex flex-col justify-center items-center w-full">
          {/* 튜토리얼 아이콘 */}
          <img src={tutorial_icon} className="w-6 h-6 mb-4 ml-2" alt="Tutorial Icon" />

          {/* 제목 */}
          <div id="tutorial-modal-title" className="text-xl font-medium mb-2 ml-2">
            초코레터 공지사항
          </div>

          {/* 메시지 목록 */}
          <div className="mt-4 space-y-1">
            {messages.map((message, index) => (
              <div
                key={index}
                className="text-gray-400 whitespace-nowrap overflow-hidden text-sm wave-down"
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
