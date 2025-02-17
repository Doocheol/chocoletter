import { useNavigate } from "react-router-dom";
import { OtherModal } from "../../common/OtherModal";
import { PurpleButton } from "../../common/PurpleButton";

interface RTCOpenModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
}

export const RTCOpenModal: React.FC<RTCOpenModalProps> = ({ isOpen, onClose, roomId }) => {
    const navigate = useNavigate();

    const goToVideoCall = () => {
        onClose();
        navigate(`/video/${roomId}`);
    }

    return (
        <div>
            <OtherModal isOpen={isOpen} onClose={onClose}>
                <div className="flex flex-col gap-4">
                    <p className="mb-3">상대방과 영상통화를 진행합니다</p>
                    <p className="text-[#777777] text-sm">편지는 약속 시간 이후부터 볼 수 있습니다.</p>
                </div>
                <div>
                    <PurpleButton onClick={onClose} className="bg-white text-black border border-black">
                        뒤로가기
                    </PurpleButton>
                    <PurpleButton onClick={goToVideoCall} className="text-white bg-chocoletterPurpleBold border border-black">
                        연결하기
                    </PurpleButton>
                </div>
            </OtherModal>
        </div>
    )
}