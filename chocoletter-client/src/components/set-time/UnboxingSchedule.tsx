import { useEffect } from 'react';
import { getUnboxingSchedule } from "../../services/unboxingApi";

interface UnboxingScheduleProps {
    giftBoxId: number;
    onTimeFetched: (time: string[], error: boolean) => void;
}

const UnboxingSchedule: React.FC<UnboxingScheduleProps> = ({
    giftBoxId,
    onTimeFetched,
}) => {
    useEffect(() => {
        const fetchUnboxingTime = async () => {
            try {
                const data = await getUnboxingSchedule(giftBoxId);
                if (data && data.unboxingTimes) {
                    onTimeFetched(data.unboxingTimes, false); 
                } else {
                    onTimeFetched([], true); 
                }
            } catch (err) {
                console.error("Error fetching unboxing times:", err);
                onTimeFetched([], true); 
            }
        };
  
        fetchUnboxingTime();
    }, [giftBoxId, onTimeFetched]);
  
    return null; // UI는 렌더링하지 않음
};

export default UnboxingSchedule;

