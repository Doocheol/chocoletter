import React, { useMemo } from "react";
import Modal from "../../../../common/Modal";

/** 일정 데이터 타입 정의 */
interface Schedule {
  senderName: string;
  unboxingTime: string; // "HH:mm" 형식
}

/** 더미 일정 데이터 */
const dummySchedules: Schedule[] = [
  { senderName: "Alice", unboxingTime: "09:00" },
  { senderName: "Bob", unboxingTime: "11:30" },
  { senderName: "Charlie", unboxingTime: "14:15" },
  { senderName: "David", unboxingTime: "16:45" },
  { senderName: "Eve", unboxingTime: "19:00" },
];

/** "HH:mm" 형식을 분(minute) 단위로 변환 */
function timeToMinute(time: string): number {
  const [HH, MM] = time.split(":").map(Number);
  return HH * 60 + MM;
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  // 더미 일정을 unboxingTime 기준 오름차순 정렬
  const sortedSchedules = useMemo(() => {
    return [...dummySchedules].sort(
      (a, b) => timeToMinute(a.unboxingTime) - timeToMinute(b.unboxingTime)
    );
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-sm sm:max-w-xl md:max-w-2xl max-h-[80vh] overflow-y-auto px-2"
    >
      <div className="flex flex-col w-full">
        {/* ChatRoomListView 스타일 헤더 */}
        <div className="w-full h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex items-center justify-between">
          {/* 좌측: 뒤로가기 버튼 자리 (필요 시 추가) */}
          <div className="w-6 h-6"></div>
          {/* 중앙: 제목 */}
          <div className="text-center text-white text-xl font-normal">발렌타인데이 일정</div>
          {/* 우측: 빈 공간 */}
          <div className="w-6 h-6"></div>
        </div>

        {/* 일정 목록 영역 */}
        <div className="w-full flex flex-col space-y-[15px] mt-4 px-4 pb-4">
          {sortedSchedules.length > 0 ? (
            sortedSchedules.map((item, index) => (
              <div
                key={`${item.senderName}-${index}`}
                className="flex h-[71px] px-[20px] py-[10px] justify-between items-center self-stretch rounded-[15px] border border-black bg-white shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)]"
              >
                <div className="flex flex-row">
                  <p className="text-[18px] leading-[22px]">
                    {item.senderName} 님과 만남이 예정되어 있어요!
                  </p>
                  <p className="text-[15px] leading-[22px] text-white bg-chocoletterPurpleBold">
                    {item.unboxingTime}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-300 text-sm text-center">일정이 없어요!</div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CalendarModal;
