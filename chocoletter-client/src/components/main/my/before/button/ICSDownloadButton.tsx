import React from "react";

export interface Schedule {
  nickName: string;
  unBoxingTime: string; // "HH:mm" 형식
  unboxingRoomId: string | null;
  isAccept: boolean;
}

// VITE_EVENT_DAY 환경변수를 기준으로 이벤트 날짜를 계산하는 함수
const getEventDate = (): Date => {
  const raw = import.meta.env.VITE_EVENT_DAY || "0214";
  // raw가 "0214" 형식이면 앞의 두 자리는 월, 뒤의 두 자리는 일
  const month = Number(raw.slice(0, 2));
  const day = Number(raw.slice(2, 4));
  const currentYear = new Date().getFullYear();
  return new Date(currentYear, month - 1, day);
};

interface ICSDownloadButtonProps {
  schedules: Schedule[];
}

const ICSDownloadButton: React.FC<ICSDownloadButtonProps> = ({ schedules }) => {
  const eventDate = getEventDate();

  // unBoxingTime("HH:mm")을 기반으로 해당 일정의 Date 객체를 생성
  const getEventTime = (timeStr: string): Date => {
    const [hour, minute] = timeStr.split(":").map(Number);
    return new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      hour,
      minute,
      0
    );
  };

  // Date를 ICS 형식(UTC 기준)으로 포맷팅하는 헬퍼 함수
  const formatDate = (date: Date): string => {
    const pad = (num: number) => (num < 10 ? "0" + num : num);
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  };

  // 각 Schedule 항목에 대해 VEVENT 생성 (예: 1시간짜리 이벤트, 30분 전 알림 포함)
  const generateEventICS = (schedule: Schedule): string => {
    const startTime = getEventTime(schedule.unBoxingTime);
    // 이벤트 종료시간은 시작 시간으로부터 1시간 후 (필요시 변경 가능)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    const title = "초코레터 영상통화!";
    const description = "https://www.chocolate-letter.com";
    const location = "chocoletter";

    return [
      "BEGIN:VEVENT",
      `UID:${Date.now()}-${Math.random()}@onVD.chocolate-letter.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(startTime)}`,
      `DTEND:${formatDate(endTime)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT30M",
      "ACTION:DISPLAY",
      "DESCRIPTION:30분 전 알림",
      "END:VALARM",
      "END:VEVENT",
    ].join("\r\n");
  };

  // 모든 VEVENT를 포함하는 ICS 콘텐츠 생성
  const generateICSContent = (): string => {
    const eventsICS = schedules.map(generateEventICS).join("\r\n");
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//초코레터//v1.0//EN",
      eventsICS,
      "END:VCALENDAR",
    ].join("\r\n");
  };

  // 버튼 클릭 시 ICS 파일 생성 후 Blob URL로 이동 (자동 열기 시도)
  const handleOpenICS = () => {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("android") > -1) {
      // Android: 앵커 태그의 download 속성을 사용하여 ICS 파일 다운로드
      const link = document.createElement("a");
      link.href = url;
      link.download = "events.ics";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // iOS 및 그 외: window.location.href로 파일 열기 시도
      window.location.href = url;
    }

    // 메모리 해제
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);
  };

  return (
    <button
      onClick={handleOpenICS}
      className="px-2 py-1 bg-chocoletterPurpleBold text-white text-sm rounded"
    >
      캘박 !
    </button>
  );
};

export default ICSDownloadButton;
