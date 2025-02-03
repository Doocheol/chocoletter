import React, { useEffect, useState } from "react";
import Modal from "../../../../common/Modal";
import { getAllAlarms } from "../../../../../services/alarmApi";

// API에서 전달받는 알림 데이터 타입 정의 (API 응답의 unBoxingTime 키와 맞춥니다)
export interface Alarm {
	alarmId: number;
	alarmType:
		| "ACCEPT_SPECIAL"
		| "REJECT_SPECIAL"
		| "RECEIVER_SPECIAL"
		| "UNBOXING_NOTICE";
	partnerName: string;
	unBoxingTime?: string; // API 응답에서는 'unBoxingTime'으로 전달됩니다.
	giftId: number | null;
	read: boolean;
}

interface NotificationModalProps {
	isOpen: boolean;
	onClose: () => void;
}

// 알림 종류에 따른 메시지를 생성하는 헬퍼 함수
const getAlarmMessage = (alarm: Alarm): string => {
	switch (alarm.alarmType) {
		case "ACCEPT_SPECIAL":
			return (
				`${alarm.partnerName}님이 보낸 특별 초콜릿이 수락되었습니다.` +
				(alarm.unBoxingTime
					? ` (언박싱 시간: ${alarm.unBoxingTime})`
					: "")
			);
		case "REJECT_SPECIAL":
			return (
				`${alarm.partnerName}님이 보낸 특별 초콜릿이 거절되었습니다.` +
				(alarm.unBoxingTime
					? ` (언박싱 시간: ${alarm.unBoxingTime})`
					: "")
			);
		case "RECEIVER_SPECIAL":
			return (
				`${alarm.partnerName}님에게서 특별 초콜릿을 받았습니다.` +
				(alarm.unBoxingTime
					? ` (언박싱 시간: ${alarm.unBoxingTime})`
					: "")
			);
		case "UNBOXING_NOTICE":
			return `화상 채팅 30분 전 알림 - ${alarm.partnerName}님과의 채팅 예정입니다.`;
		default:
			return "";
	}
};

const NotificationModal: React.FC<NotificationModalProps> = ({
	isOpen,
	onClose,
}) => {
	const [alarms, setAlarms] = useState<Alarm[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// 알림 데이터 불러오기 함수
	const fetchAlarms = async () => {
		setIsLoading(true);
		try {
			const data = await getAllAlarms();
			const alarmsData = data;
			setAlarms(alarmsData);
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
			className="animate-fadeIn px-4 w-full max-w-xl"
		>
			{/* 헤더 영역 - 모달 제목과 새로고침 버튼 */}
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-bold text-gray-800">알림</h2>
				<button
					onClick={fetchAlarms}
					className="text-sm text-blue-500 hover:underline focus:outline-none"
				>
					새로고침
				</button>
			</div>

			{/* 알림 리스트 영역 */}
			<div className="max-h-64 overflow-y-auto">
				{isLoading ? (
					<p className="text-center text-gray-500 py-8">로딩 중...</p>
				) : alarms.length === 0 ? (
					<p className="text-center text-gray-500 py-8">
						아직 새로운 알림이 없어요.
					</p>
				) : (
					<ul>
						{alarms.map((alarm) => (
							<li
								key={alarm.alarmId}
								className="py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
							>
								<p className="text-gray-700">
									{getAlarmMessage(alarm)}
								</p>
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
