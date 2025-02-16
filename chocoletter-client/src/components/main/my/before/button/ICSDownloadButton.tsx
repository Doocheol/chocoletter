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

  // isAccept가 true인 스케줄만 필터링
  const acceptedSchedules = schedules.filter((schedule) => schedule.isAccept);

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

  // 각 Schedule 항목에 대해 VEVENT 생성 (예: 1시간짜리 이벤트, 5분 전 알림 포함)
  const generateEventICS = (schedule: Schedule): string => {
    const startTime = getEventTime(schedule.unBoxingTime);
    // 이벤트 종료시간은 시작 시간으로부터 1시간 후 (필요시 조정 가능)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    const title = "초코레터 - 영상통화 입장 알림!";
    const description =
      import.meta.env.VITE_FRONTEND_SERVER_URL || "https://www.chocolate-letter.com";
    const location = "초콜릿보다 달콤한 설렘을 전하세요!";

    return [
      "BEGIN:VEVENT",
      `UID:${Date.now()}-${Math.random()}@${description}`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(startTime)}`,
      `DTEND:${formatDate(endTime)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT5M",
      "ACTION:DISPLAY",
      "DESCRIPTION:5분 전 알림",
      "END:VALARM",
      "END:VEVENT",
    ].join("\r\n");
  };

  // 모든 VEVENT를 포함하는 ICS 콘텐츠 생성
  const generateICSContent = (): string => {
    const eventsICS = acceptedSchedules.map(generateEventICS).join("\r\n");
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//초코레터//v1.0//EN",
      eventsICS,
      "END:VCALENDAR",
    ].join("\r\n");
  };

  const handleOpenICS = async () => {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const file = new File([blob], "chocoletter.ics", {
      type: "text/calendar",
    });
    const url = URL.createObjectURL(file);

    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.indexOf("android") > -1;
    const isIOS = /iphone|ipad|ipod/.test(ua);

    if (isAndroid) {
      // Android: 앵커 태그의 download 속성을 사용하여 ICS 파일 다운로드
      const link = document.createElement("a");
      link.href = url;
      link.download = "chocoletter.ics";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (isIOS) {
      // iOS: Web Share API를 시도. (Safari에서 ICS 파일 공유 후, 취소되면 fallback)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
          return; // 공유 성공 시 더 이상 진행하지 않음.
        } catch (err) {
          console.log("Web Share API 호출 실패 또는 취소됨:", err);
          // 취소 또는 에러 발생 시 fallback으로 window.location.href를 사용.
        }
      }
      // Web Share API 사용 불가 또는 실패 시 fallback
      window.location.href = url;
    } else {
      // 그 외 환경: window.location.href 사용
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
      className="px-3 py-1 bg-chocoletterPurpleBold hover:bg-chocoletterPurple text-white text-sm rounded"
    >
      캘박
    </button>
  );
};

export default ICSDownloadButton;
