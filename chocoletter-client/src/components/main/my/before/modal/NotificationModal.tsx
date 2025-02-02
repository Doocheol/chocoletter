import React from "react";
import Modal from "../../../../common/Modal";

// 알림 데이터 타입 정의
export interface Alarm {
  alarmId: number;
  alarmType: "ACCEPT_SPECIAL" | "REJECT_SPECIAL" | "RECEIVER_SPECIAL" | "UNBOXING_NOTICE";
  partnerName: string;
  unboxingTime?: string; // 일부 알림은 시간 정보가 있을 수 있음
  giftId: number | null;
  read: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 서버에서 내려오는 알림 배열
  alarms: Alarm[];
}

// 알림 종류에 따른 메시지를 생성하는 헬퍼 함수
const getAlarmMessage = (alarm: Alarm): string => {
  switch (alarm.alarmType) {
    case "ACCEPT_SPECIAL":
      return (
        `${alarm.partnerName}님이 보낸 특별 초콜릿이 수락되었습니다.` +
        (alarm.unboxingTime ? ` (언박싱 시간: ${alarm.unboxingTime})` : "")
      );
    case "REJECT_SPECIAL":
      return (
        `${alarm.partnerName}님이 보낸 특별 초콜릿이 거절되었습니다.` +
        (alarm.unboxingTime ? ` (언박싱 시간: ${alarm.unboxingTime})` : "")
      );
    case "RECEIVER_SPECIAL":
      return (
        `${alarm.partnerName}님에게서 특별 초콜릿을 받았습니다.` +
        (alarm.unboxingTime ? ` (언박싱 시간: ${alarm.unboxingTime})` : "")
      );
    case "UNBOXING_NOTICE":
      return `화상 채팅 30분 전 알림 - ${alarm.partnerName}님과의 채팅 예정입니다.`;
    default:
      return "";
  }
};

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, alarms }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="animate-fadeIn">
      {/* 헤더 (Modal 내부에 기본 닫기 버튼이 있으므로 별도 닫기 버튼은 생략) */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">알림</h2>
      </div>

      {/* 알림 리스트 영역 */}
      <div className="max-h-64 overflow-y-auto">
        {alarms.length === 0 ? (
          <p className="text-center text-gray-500 py-8">아직 새로운 알림이 없어요.</p>
        ) : (
          <ul>
            {alarms.map((alarm) => (
              <li
                key={alarm.alarmId}
                className="py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <p className="text-gray-700">{getAlarmMessage(alarm)}</p>
                <span className="block text-xs text-gray-400 mt-1">
                  {alarm.read ? "읽음" : "읽지 않음"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
};

export default NotificationModal;
