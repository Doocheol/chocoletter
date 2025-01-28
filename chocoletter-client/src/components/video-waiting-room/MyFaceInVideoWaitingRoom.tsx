import { useEffect, useRef } from "react";

export const MyFaceInVideoWaitingRoom = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(error => {
                console.error("문제가 발생했습니다 : ", error);
            });

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="w-full min-h-screen relative">
            <video 
                ref={videoRef} 
                autoPlay={true}
                className="w-full h-full object-cover absolute"
                style={{ transform: "scaleX(-1)" }}
            />
        </div>
    );
};