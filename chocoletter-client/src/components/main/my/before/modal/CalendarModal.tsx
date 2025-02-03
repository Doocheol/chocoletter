import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../../../common/Modal";
import { fetchMyUnboxingSchedule } from "../../../../../services/unboxingApi";
import timerIcon from "../../../../../assets/images/unboxing/timer.svg";

const specialImages = import.meta.glob("../../../../../assets/images/chocolate/special/*.png", {
  eager: true,
});
const specialChocos = Object.values(specialImages).map(
  (module) => (module as { default: string }).default
);

/** 일정 데이터 타입 정의 */
interface Schedule {
  nickName: string;
  unBoxingTime: string; // "HH:mm" 형식
}

/** 더미 일정 데이터 */
const dummySchedules: Schedule[] = [
  { nickName: "Alice", unBoxingTime: "09:00" },
  { nickName: "Iso", unBoxingTime: "09:20" },
  { nickName: "Bob", unBoxingTime: "12:30" },
  { nickName: "Charlie", unBoxingTime: "14:15" },
  { nickName: "David", unBoxingTime: "16:45" },
  { nickName: "Eve", unBoxingTime: "19:00" },
  { nickName: "Andre", unBoxingTime: "19:20" },
  { nickName: "Bolt", unBoxingTime: "21:00" },
  { nickName: "Emily", unBoxingTime: "22:00" },
  { nickName: "Busto", unBoxingTime: "23:40" },
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

// 내 언박싱 일정 확인 API(GET)
const GetMyUnboxingSchedule = async () => {
  try {
    const response = await fetchMyUnboxingSchedule();
    return response.myUnBoxingTimes;
  } catch (err) {
    console.log("내 언박스 일정 조회 실패 : ", err);
    return null;
  }
}

// 시간 설정 AM/PM
const ChangeAmPm = (strTime: string) => {
  const [hour, minute] = strTime.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'Asia/Seoul'
  }).format(date)
}

// 

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // 일정 가져오기
  useEffect(() => {
    let isMounted = true;

    const fetchSchedule = async () => {
      const unboxingSchedule = await GetMyUnboxingSchedule();
      if (isMounted && unboxingSchedule) {
        setSchedules(unboxingSchedule);
      }
    };

    fetchSchedule();

    return () => {
      isMounted = false;
    };
  }, []);

  // 더미 일정을 unboxingTime 기준 오름차순 정렬
  const sortedSchedules = useMemo(() => {
    return [...dummySchedules].sort(
      (a, b) => timeToMinute(a.unBoxingTime) - timeToMinute(b.unBoxingTime)
    );
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-sm sm:max-w-lg md:max-w-xl max-h-[80vh] ml-1 !bg-chocoletterLetterBgBlue"
    >
      <div className="flex flex-col w-full">
        {/* ChatRoomListView 스타일 헤더 */}
        <div className="w-full h-[58px] px-4 py-[17px] bg-chocoletterLetterBgPink rounded-xl border- flex items-center justify-between">
          {/* 좌측: 뒤로가기 버튼 자리 (필요 시 추가) */}
          <div className="w-6 h-6"></div>
          {/* 중앙: 제목 */}
          <div className="text-center text-nowrap text-black text-2xl font-bold">발렌타인데이 일정</div>
          {/* 우측: 빈 공간 */}
          <div className="w-6 h-6"></div>
        </div>

        {/* 일정 목록 영역 */}
        <div className="w-full max-h-[60dvh] flex flex-col space-y-[15px] mt-4 ml-1 pb-4 overflow-y-auto overflow-x-hidden">
          {sortedSchedules.length > 0 ? (
            sortedSchedules.map((item, index) => { 
              const RTCchocolate = specialChocos[Math.floor(Math.random() * specialChocos.length)];
              return(
                <div key={`${item.nickName}-${index}`}>
                  <div className="relative w-[300px] shadow-[-155px_5px_5px_0px_rgba(0,0,0,0.2)] h-32 flex items-end">
                    {/* 왼쪽 초대장 스타일 배경 */}
                    <div className="w-2/3 h-full bg-white text-[#f82e91] p-3 relative z-10" style={{ clipPath: "polygon(0 0, 90% 0, 100% 100%, 0% 100%)" }}>
                      <div className="w-full h-full">
                        <h3 className="text-md font-bold">언박싱 초대장💌</h3>
                        <p className="text-[] text-gray-500 mt-2">{item.nickName}님과 함께<br/>편지를 열어보세요!</p>
                        <p className="text-sm mt-2">{ChangeAmPm(item.unBoxingTime)}</p>
                      </div>
                    </div>
                    
                    {/* 오른쪽 아이콘 스타일 */}
                    <div className="w-2/5 h-[calc(100%-15px)] mb-[2px] shadow-[-5px_5px_5px_2px_rgba(0,0,0,0.2)] bg-chocoletterPink flex items-center justify-center relative -ml-12" style={{ borderTopRightRadius: "20px", borderBottomRightRadius: "20px"}}>
                      <img src={RTCchocolate} className="w-[60%] h-[60%]" />
                    </div>
                  </div>
                </div>
            )})
          ) : (
            <div className="text-gray-300 text-sm text-center">일정이 없어요!</div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CalendarModal;
