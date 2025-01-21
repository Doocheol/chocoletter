import AcceptButton from "../components/receive/button/AcceptButton";
import RejectButton from "../components/receive/button/RejectButton";
// import NotFixedUnboxingTime from "../components/receive/NotFixedUnboxingTime";

function ReceiveView() {
    const giftId = '123' // 선물 id

    // 일정이 수락된 경우 - webRTC시간 확정

    return (
        <div>
            <h1 className="text-2xl font-bold mb-24">
                나에게 마음을 담은 <br />
                특별한 초콜릿이 도착했어요!<br />
                {/* 2월 14일 <NotFixedUnboxingTime giftId={giftId} />에 함께 열어보세요❣️ */}
            </h1>
            {/* 수락/거절 버튼 */}
            <div className="mb-8">
                <AcceptButton />
            </div>
            <div className="mb-8">
                <RejectButton />
            </div>
        </div>
    );
};
export default ReceiveView;