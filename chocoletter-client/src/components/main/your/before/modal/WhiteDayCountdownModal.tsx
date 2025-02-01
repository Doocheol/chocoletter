import React, { useState, useEffect } from "react";
import Modal from "../../../../common/Modal";

interface WhiteDayCountdownModalProps {
  targetDate: Date;
  isOpen: boolean;
  onClose: () => void;
}

const WhiteDayCountdownModal: React.FC<WhiteDayCountdownModalProps> = ({
  targetDate,
  isOpen,
  onClose,
}) => {
  const [daysLeft, setDaysLeft] = useState<number>(0);

  useEffect(() => {
    const calculateDaysLeft = () => {
      const now = new Date();
      const diffTime = targetDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(diffDays);
    };

    calculateDaysLeft();
    const interval = setInterval(calculateDaysLeft, 60 * 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">D-DAY Countdown</h2>
        <p className="mb-4">화이트데이까지 {daysLeft}일 남았습니다!</p>
      </div>
    </Modal>
  );
};

export default WhiteDayCountdownModal;
