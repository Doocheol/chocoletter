import React, { useEffect, useState } from "react";
import Modal from "../../../../common/Modal";
import { getAllAlarms } from "../../../../../services/alarmApi";

export interface Alarm {
  alarmId: number;
  alarmType: "ACCEPT_SPECIAL" | "REJECT_SPECIAL" | "RECEIVER_SPECIAL" | "UNBOXING_NOTICE";
  partnerName: string;
  unBoxingTime?: string; // API 응답에 맞게 대문자 B 사용
  giftId: number | null;
  read: boolean;
}

const getAlarmMessage = (alarm: Alarm): string => {
  switch (alarm.alarmType) {
    case "ACCEPT_SPECIAL":
      return `${alarm.partnerName}님이 보낸 특별 초콜릿이 수락되었습니다.${
        alarm.unBoxingTime ? ` (언박싱 시간: ${alarm.unBoxingTime})` : ""
      }`;
    case "REJECT_SPECIAL":
      return `${alarm.partnerName}님이 보낸 특별 초콜릿이 거절되었습니다.${
        alarm.unBoxingTime ? ` (언박싱 시간: ${alarm.unBoxingTime})` : ""
      }`;
    case "RECEIVER_SPECIAL":
      return `${alarm.partnerName}님에게서 특별 초콜릿을 받았습니다.${
        alarm.unBoxingTime ? ` (언박싱 시간: ${alarm.unBoxingTime})` : ""
      }`;
    case "UNBOXING_NOTICE":
      return `화상 채팅 30분 전 알림 - ${alarm.partnerName}님과의 채팅 예정입니다.`;
    default:
      return "";
  }
};

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAlarms = async () => {
    setIsLoading(true);
    try {
      const data = await getAllAlarms();
      setAlarms(data);
    } catch (err) {
      console.error("알림 데이터를 불러오는 도중 에러 발생:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 모달이 열릴 때마다 알림 데이터를 불러옵니다.
  useEffect(() => {
    if (isOpen) {
      fetchAlarms();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-sm sm:max-w-lg md:max-w-xl max-h-[80vh] ml-1 !bg-chocoletterLetterBgBlue"
    >
      <div className="flex flex-col w-full">
        {/* 헤더 영역 (캘린더 모달 스타일) */}
        <div className="w-full h-[58px] px-4 py-[17px] bg-chocoletterLetterBgPink rounded-xl flex items-center justify-between">
          {/* 좌측: 빈 공간 */}
          <div className="w-6 h-6"></div>
          {/* 중앙: 제목 */}
          <div className="text-center text-nowrap text-black text-2xl font-bold">알림</div>
          {/* 우측: 새로고침 버튼 */}
          <button
            onClick={fetchAlarms}
            className="text-sm text-blue-500 hover:underline focus:outline-none"
          >
            새로고침
          </button>
        </div>

        {/* 알림 목록 영역 */}
        <div className="w-full max-h-[60dvh] flex flex-col space-y-[15px] mt-4 ml-1 pb-4 overflow-y-auto overflow-x-hidden">
          {isLoading ? (
            <p className="text-center text-gray-500 py-8">로딩 중...</p>
          ) : alarms.length === 0 ? (
            <p className="text-center text-gray-500 py-8">아직 새로운 알림이 없어요.</p>
          ) : (
            alarms.map((alarm) => (
              <div key={alarm.alarmId} className="w-full p-4 bg-white rounded-lg shadow-md">
                <p className="text-black text-lg font-semibold">{getAlarmMessage(alarm)}</p>
                <p className="text-xs text-gray-500 mt-1">{alarm.read ? "읽음" : "읽지 않음"}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NotificationModal;
