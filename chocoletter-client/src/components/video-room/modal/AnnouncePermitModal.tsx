interface AnnoouncePermitModalProps {
    videoPermit: () => void;
}

export const AnnouncePermitModal: React.FC<AnnoouncePermitModalProps> = ({ videoPermit }) => {
    return (
        <div className="w-full h-screen bg-gray-600 z-[9999] flex justify-center">
            <div className="flex flex-col items-center justify-center text-center text-nowrap text-white">
                <p className="mb-4">초코레터는 모든 음성과 영상을<br/><span className="text-chocoletterTextYellow">녹음, 녹화하지 않습니다!</span></p>
                <p className="mb-4">영상통화를 위해<br/>이후 <span className="text-chocoletterGreen">Ready</span> 버튼을 누르면 나오는<br/>카메라와 비디오 <span className="text-chocoletterTextYellow">권한을 허용</span>해주세요!</p>
                <p className="mb-4">추가로 <span className="text-chocoletterGreen">Ready</span> 버튼을 누르면 편지를 볼 수 있어요<br/>원활한 영상통화를 위해<br/><span className="text-chocoletterTextYellow">페이지를 나가거나 새로고침하지 말아주세요</span></p>
            </div>
            <div className="w-[11dvh] h-[11dvh] bottom-[10dvh] absolute bg-chocoletterGiftBg rounded-[100px] justify-center items-center gap-2.5 inline-flex z-20">
                <button onClick={videoPermit} className="w-full h-full aspect-square flex justify-center items-center" >
                    <p className="text-white text-center font-bold font-sans w-[50%] h-[50%] flex items-center justify-center text-2xl text-nowrap" >확인</p>
                </button>
            </div>
        </div>
    )
}