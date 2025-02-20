import { useEffect } from "react";
import { getNotFixedUnboxingTime } from "../../services/unboxingApi";

interface NotFixedUnboxingTimeProps {
	giftId: number;
	onTimeFetched: (time: string | null, error: boolean) => void;
}

const NotFixedUnboxingTime: React.FC<NotFixedUnboxingTimeProps> = ({
	giftId,
	onTimeFetched,
}) => {
	useEffect(() => {
		const fetchUnboxingTime = async () => {
			try {
				const data = await getNotFixedUnboxingTime(giftId);
				if (data && data.unboxingTime) {
					onTimeFetched(data.unboxingTime, false); // time 전달
				} else {
					onTimeFetched(null, true); // 에러 전달
				}
			} catch (err) {
				onTimeFetched(null, true); // 에러 전달
			}
		};

		fetchUnboxingTime();
	}, [giftId, onTimeFetched]);

	return null; // UI는 렌더링하지 않음
};

export default NotFixedUnboxingTime;
