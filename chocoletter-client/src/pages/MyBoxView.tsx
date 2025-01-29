// src/views/MyBoxView.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import { toast } from "react-toastify";

const MyBoxView: React.FC = () => {
  const navigate = useNavigate();

  // 상태 타입 정의: 'specialChocolates'는 'status' 포함, 'confirmedTimes'는 제외
  const [specialChocolates, setSpecialChocolates] = useState<
    { id: number; unboxingTime: string; status: string }[]
  >([]);
  const [confirmedTimes, setConfirmedTimes] = useState<{ id: number; unboxingTime: string }[]>([]);
  const [giftBoxId, setGiftBoxId] = useState<number>(1); // 예시 giftBoxId

  useEffect(() => {
    // 더미 데이터 설정 (총 20개)
    const dummyData = [
      { id: 1, unboxingTime: "08:30", status: "pending" },
      { id: 2, unboxingTime: "09:00", status: "confirmed" },
      { id: 3, unboxingTime: "10:15", status: "pending" },
      { id: 4, unboxingTime: "11:45", status: "confirmed" },
      { id: 5, unboxingTime: "12:30", status: "pending" },
      { id: 6, unboxingTime: "13:00", status: "confirmed" },
      { id: 7, unboxingTime: "14:20", status: "pending" },
      { id: 8, unboxingTime: "15:50", status: "confirmed" },
      { id: 9, unboxingTime: "16:30", status: "pending" },
      { id: 10, unboxingTime: "17:00", status: "confirmed" },
      { id: 11, unboxingTime: "17:30", status: "pending" },
      { id: 12, unboxingTime: "18:45", status: "confirmed" },
      { id: 13, unboxingTime: "19:00", status: "pending" },
      { id: 14, unboxingTime: "19:30", status: "confirmed" },
      { id: 15, unboxingTime: "20:15", status: "pending" },
      { id: 16, unboxingTime: "21:00", status: "confirmed" },
      { id: 17, unboxingTime: "21:30", status: "pending" },
      { id: 18, unboxingTime: "22:00", status: "confirmed" },
      { id: 19, unboxingTime: "22:30", status: "pending" },
      { id: 20, unboxingTime: "23:00", status: "confirmed" },
    ];

    // 상태 업데이트: 'pending' 상태의 초콜릿 리스트
    const pendingChocos = dummyData.filter((choco) => choco.status === "pending");
    setSpecialChocolates(pendingChocos);

    // 상태 업데이트: 'confirmed' 상태의 초콜릿 리스트를 시간순으로 정렬
    const confirmed = dummyData
      .filter((choco) => choco.status === "confirmed")
      .sort((a, b) => {
        const [aH, aM] = a.unboxingTime.split(":").map(Number);
        const [bH, bM] = b.unboxingTime.split(":").map(Number);
        return aH !== bH ? aH - bH : aM - bM;
      });
    setConfirmedTimes(confirmed);

    // 실제 API 호출을 원할 경우 아래 주석을 해제하고 API 함수를 사용하세요.
    /*
    // 언박싱 전체 일정 조회
    const fetchUnboxingSchedule = async () => {
      const data = await getUnboxingSchedule(giftBoxId);
      if (data) {
        // 상태 업데이트: 'pending' 상태의 초콜릿 리스트
        const pendingChocos = data.filter(
          (choco) => choco.status === "pending"
        );
        setSpecialChocolates(pendingChocos);

        // 상태 업데이트: 'confirmed' 상태의 초콜릿 리스트를 시간순으로 정렬
        const confirmed = data
          .filter((choco) => choco.status === "confirmed")
          .sort((a, b) => {
            const [aH, aM] = a.unboxingTime.split(":").map(Number);
            const [bH, bM] = b.unboxingTime.split(":").map(Number);
            return aH !== bH ? aH - bH : aM - bM;
          });
        setConfirmedTimes(confirmed);
      } else {
        toast.error("언박싱 일정을 불러오는 데 실패했습니다.");
      }
    };

    fetchUnboxingSchedule();
    */
  }, [giftBoxId]);

  const handleAccept = async (giftId: number) => {
    // 더미 데이터에서는 실제 API 호출을 하지 않습니다.
    // 실제 API를 사용하려면 아래 주석을 해제하고 'patchUnboxingAccept' 함수를 사용하세요.
    /*
    const response = await patchUnboxingAccept(giftId);
    if (response && response.success) {
      // 상태 업데이트: 해당 초콜릿을 'pending' 리스트에서 제거
      setSpecialChocolates((prev) => prev.filter((choco) => choco.id !== giftId));

      // 'confirmedTimes' 리스트에 추가하고 시간순으로 정렬
      const updatedChoco = specialChocolates.find((choco) => choco.id === giftId);
      if (updatedChoco) {
        setConfirmedTimes((prev) =>
          [...prev, { id: updatedChoco.id, unboxingTime: updatedChoco.unboxingTime }]
            .sort((a, b) => {
              const [aH, aM] = a.unboxingTime.split(":").map(Number);
              const [bH, bM] = b.unboxingTime.split(":").map(Number);
              return aH !== bH ? aH - bH : aM - bM;
            })
        );
        toast.success("초콜릿을 성공적으로 수락했습니다.");
      }
    } else {
      toast.error("초콜릿 수락에 실패했습니다.");
    }
    */

    // 더미 데이터에서 'pending' 상태의 초콜릿을 'confirmedTimes'로 이동
    const updatedChoco = specialChocolates.find((choco) => choco.id === giftId);
    if (updatedChoco) {
      setSpecialChocolates((prev) => prev.filter((choco) => choco.id !== giftId));
      setConfirmedTimes((prev) =>
        [...prev, { id: updatedChoco.id, unboxingTime: updatedChoco.unboxingTime }].sort((a, b) => {
          const [aH, aM] = a.unboxingTime.split(":").map(Number);
          const [bH, bM] = b.unboxingTime.split(":").map(Number);
          return aH !== bH ? aH - bH : aM - bM;
        })
      );
      toast.success("좋아요! 그때 봐요!");
    } else {
      toast.error("초콜릿 수락에 실패했습니다.");
    }
  };

  const handleReject = async (giftId: number) => {
    // 더미 데이터에서는 실제 API 호출을 하지 않습니다.
    // 실제 API를 사용하려면 아래 주석을 해제하고 'patchUnboxingReject' 함수를 사용하세요.
    /*
    const response = await patchUnboxingReject(giftId);
    if (response && response.success) {
      // 상태 업데이트: 해당 초콜릿을 'pending' 리스트에서 제거
      setSpecialChocolates((prev) => prev.filter((choco) => choco.id !== giftId));
      toast.success("초콜릿을 성공적으로 거절했습니다.");
    } else {
      toast.error("초콜릿 거절에 실패했습니다.");
    }
    */

    // 더미 데이터에서 'pending' 상태의 초콜릿을 제거
    const updatedChoco = specialChocolates.find((choco) => choco.id === giftId);
    if (updatedChoco) {
      setSpecialChocolates((prev) => prev.filter((choco) => choco.id !== giftId));
      toast.error("안돼요! 거절했어요!");
    } else {
      toast.error("초콜릿 거절에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden">
      {/* 상단 헤더 */}
      <div className="w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex flex-col justify-center items-center gap-[15px] fixed z-50">
        <div className="self-stretch justify-between items-center inline-flex">
          <div className="w-6 h-6 justify-center items-center flex">
            <GoBackButton />
          </div>
          <div className="text-center text-white text-2xl font-normal font-sans leading-snug">
            나의 스페셜 초콜릿 박스
          </div>
          <div className="w-6 h-6" />
        </div>
      </div>

      {/* 특별 초콜릿 리스트 */}
      <div className="w-full md:max-w-[343px] flex flex-col space-y-4 justify-start items-stretch mt-20 pt-4 px-4">
        {specialChocolates.length === 0 ? (
          <p className="text-gray-500 text-center">수락하거나 거절할 특별 초콜릿이 없습니다.</p>
        ) : (
          specialChocolates.map((choco) => (
            <div
              key={choco.id}
              className="flex flex-row justify-between items-center p-4 bg-white rounded-lg border border-gray-300 shadow-md"
            >
              <p className="text-lg font-semibold">{choco.unboxingTime}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAccept(choco.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  수락
                </button>
                <button
                  onClick={() => handleReject(choco.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  거절
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 나의 발렌타이데이 일정 리스트 */}
      <div className="w-full md:max-w-[343px] mt-8 px-4">
        <h2 className="text-xl font-bold mb-4">나의 발렌타이데이 일정</h2>
        {confirmedTimes.length === 0 ? (
          <p className="text-gray-500 text-center">확정된 시간이 없습니다.</p>
        ) : (
          confirmedTimes.map((choco) => (
            <div
              key={choco.id}
              className="flex justify-center items-center p-3 bg-white rounded-lg border border-gray-300 shadow-md mb-2"
            >
              <p className="text-lg font-semibold">{choco.unboxingTime}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBoxView;
