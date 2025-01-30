import React, { useMemo } from "react";
import Modal from "../../../../common/Modal";
// import { useRecoilValue } from "recoil";
// import { dummySchedulesAtom } from "../../../../atoms/schedule/scheduleAtoms";

/**
 * 더미 일정
 * - 시작 시각만 주어지고, 실제로는 시작~10분 후까지 일정으로 처리
 */
const dummySchedules = [
  { start: "00:00" },
  { start: "02:10" },
  { start: "09:00" },
  { start: "09:20" },
  { start: "11:00" },
  { start: "11:10" },
  { start: "13:50" },
  { start: "15:30" },
  { start: "20:00" },
  { start: "23:30" },
];

/** "HH:mm" → 해당 일자 기준 총 분(minute) */
function timeToMinute(time: string): number {
  const [HH, MM] = time.split(":").map(Number);
  return HH * 60 + MM;
}

/** 시작 ~ 시작+10분 (UI 표시용 로직) => 여기서는 endTime 계산만 하고 실제 표시 X */
function add10Minutes(time: string): number {
  return timeToMinute(time) + 10;
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 2월 14일 일정 모달
 * - 왼쪽(2/3): 00:00~24:00 (10분 단위 144블록) 세로 표시
 *   - 블록 왼쪽에 "HH" 레이블 (정시 첫 블록일 경우만)
 *   - 일정이 겹치면 bg-chocoletterPurple
 * - 오른쪽(1/3): 시작 시각만 시간순으로 나열 (종료 시각은 UI에서 생략)
 */
const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  // 실제 Recoil 데이터 사용 시:
  // const scheduled = useRecoilValue(dummySchedulesAtom);
  // 여기서는 더미로 대체:
  const scheduled = dummySchedules;

  // 1) 일정 목록을 시작 시각 기준 오름차순 정렬
  const sortedSchedules = useMemo(() => {
    return [...scheduled].sort((a, b) => timeToMinute(a.start) - timeToMinute(b.start));
  }, [scheduled]);

  // 2) 00:00 ~ 24:00(1440분) 10분 간격(144블록)으로 압축
  //    각 블록은 [blockStart, blockEnd) = [hour*60 + sub*10, ...]
  //    "startMin ~ startMin+10"과 겹치면 isScheduled
  const blocks = useMemo(() => {
    const results = [];
    // 일정 파싱
    const parsed = sortedSchedules.map((item) => ({
      startMin: timeToMinute(item.start),
      endMin: add10Minutes(item.start),
    }));

    for (let hour = 0; hour < 24; hour++) {
      for (let sub = 0; sub < 6; sub++) {
        const blockStart = hour * 60 + sub * 10;
        const blockEnd = blockStart + 10;

        // 이 블록이 "어떤 일정이라도" 걸치는지 확인
        const isScheduled = parsed.some(
          (sch) => blockStart < sch.endMin && blockEnd > sch.startMin
        );

        results.push({
          hour,
          sub,
          blockStart,
          blockEnd,
          isScheduled,
        });
      }
    }
    return results;
  }, [sortedSchedules]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      // 화면을 약간 여유 있게 차지하도록 설정
      className="max-w-sm sm:max-w-xl md:max-w-2xl max-h-[80vh] overflow-y-auto"
    >
      <div className="flex flex-col w-full">
        {/* 헤더 영역 */}
        <div className="mb-2 text-center">
          <div className="w-full text-xl font-normal px-20 whitespace-nowrap">
            발렌타인데이 일정
          </div>
        </div>

        {/* 본문: 왼쪽 그래프(2/3), 오른쪽 목록(1/3) */}
        <div className="flex w-full gap-2">
          {/* 왼쪽 막대 그래프 */}
          <div className="w-2/3">
            <div className="relative flex flex-col">
              {blocks.map((block, idx) => {
                // 매 정시(sub===0)마다 굵은 선 + Hour 레이블
                const isHourStart = block.sub === 0;

                return (
                  <div
                    key={idx}
                    className={`
                      relative flex items-center 
                      border-gray-300
                      h-[3px]
                      ${block.isScheduled ? "bg-chocoletterPurple bg-opacity-60" : "bg-white"}
                    `}
                  >
                    {/* Hour 레이블 (정시 첫 블록일 때만) */}
                    {isHourStart && (
                      <span className="w-8 mb-2 text-xxs font-thin text-gray-400">
                        {String(block.hour).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 오른쪽: 약속 시각 목록(시작 시각만 표시) */}
          <div className="w-1/3">
            <div className="h-full px-2">
              <div className="flex flex-col gap-2">
                {sortedSchedules.length > 0 ? (
                  sortedSchedules.map((item, i) => (
                    <div
                      key={`${item.start}-${i}`}
                      className="text-xs bg-chocoletterPurpleBold bg-opacity-20 rounded shadow-s text-center"
                    >
                      {item.start}
                      {/* 종료 시각은 보여주지 않음 */}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm">약속이 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CalendarModal;
