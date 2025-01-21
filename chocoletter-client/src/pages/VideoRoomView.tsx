// import { useState, useEffect, useRef } from 'react';
// import { useRecoilValue } from 'recoil';
// import { sessionAtom, tokenAtom } from "../atoms/video/videoAtoms"

// import classes from '../styles/videoRoom.module.css';
// import CloseVideoRoomButton from '../components/videoRoom/button/CloseVideoRoomButton';
// import OutVideoRoomModal from '../components/videoRoom/modal/OutVideoRoomModal';

// import { OpenVidu, Session, Publisher, Subscriber } from 'openvidu-browser';

// export default function VideoRoomView() {
//     const [isTerminate, setIsTerminate] = useState(false);
//     const [leftTime, setLeftTime] = useState(60);
//     const sessionId = useRecoilValue(sessionAtom);
//     const token = useRecoilValue(tokenAtom)

//     const endCall = () => {
//         setIsTerminate(true);
//     }

//     const OV = new OpenVidu();
//     const sessionRef = useRef<Session | null>(null);
//     const [publisher, setPublisher] = useState<Publisher | null>(null);
//     const [subscribers, setSubscribers] = useState<(Subscriber | Subscriber)[]>([]);

//     useEffect(() => {
//         // OpenVidu 세션 초기화
//         const session = OV.initSession();
//         sessionRef.current = session; // 세션 객체를 참조값에 저장

//         // 상대방의 스트림이 생성되었을 때 이벤트 처리
//         session.on("streamCreated", (event) => {
//             const subscriber = session.subscribe(event.stream, undefined); // 상대방 스트림 구독
//             setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]); // 구독자 리스트에 추가
//         });

//         // 상대방의 스트림이 종료되었을 때 이벤트 처리
//         session.on("streamDestroyed", (event) => {
//             setSubscribers((prevSubscribers) =>
//                 prevSubscribers.filter((sub) => sub !== event.stream.streamManager)
//             ); // 종료된 스트림 제거
//         });

//         // 세션 연결: 토큰을 사용하여 OpenVidu 서버와 연결
//         const connectOpenvidu = ((token: string) => {
//             session
//                 .connect(token, { clientData: "User" }) // 사용자 이름 또는 기타 데이터 전달 가능
//                 .then(() => {
//                     const publisherInstance = OV.initPublisher(undefined, {
//                         videoSource: undefined, // 기본 카메라 사용
//                         audioSource: undefined, // 기본 마이크 사용
//                         publishAudio: true, // 오디오 송출 여부
//                         publishVideo: true, // 비디오 송출 여부
//                         resolution: "640x480", // 해상도 설정
//                         frameRate: 30, // 프레임 레이트 설정
//                     });

//                     session.publish(publisherInstance); // 내 화면 송출 시작
//                     setPublisher(publisherInstance); // 퍼블리셔 상태 업데이트
//                 })
//                 .catch((error) => {
//                     console.error("Error connecting to the session:", error); // 연결 실패 시 에러 출력
//                 });
//         });

//         connectOpenvidu(token);

//         return () => {
//             if (sessionRef.current) {
//                 sessionRef.current.disconnect(); // 컴포넌트 언마운트 시 세션 연결 해제
//             }
//         };
//     }, [OV, sessionId, token]);

//     useEffect(() => {
//         if (leftTime <= 0) {
//             alert("채팅 시간이 종료되었습니다.");
//             window.location.href = "/"; // 메인 페이지로 리다이렉트
//         }

//         const timerInterval = setInterval(() => {
//             setLeftTime((prevTime) => prevTime - 1);
//         }, 1000);

//         return () => clearInterval(timerInterval);
//     }, [leftTime]);

//     return (
//         <>
//             {isTerminate && (
//                 <OutVideoRoomModal />
//             )}
//             <div className="flex justify-center items-center h-screen">
//                 <div className={classes.back}>
//                     <h1>화상채팅</h1>
//                     {/* 상대방 화면 표시 */}
//                     <div id="subscriber">
//                         {subscribers.map((subscriber, index) => (
//                             <div key={index} style={{ width: "70%", float: "left" }}>
//                                 {/* 상대방의 비디오 엘리먼트를 렌더링 */}
//                                 <div ref={(el) => el && subscriber.addVideoElement(el)} />
//                             </div>
//                         ))}
//                     </div>

//                     {/* 내 화면 표시 */}
//                     <div id="publisher" style={{ width: "30%", float: "right" }}>
//                         {publisher && (
//                             <video autoPlay ref={(el) => el && publisher.addVideoElement(el)} />
//                         )}
//                     </div>
//                     <CloseVideoRoomButton onEnd={endCall} />
//                 </div>
//             </div>
//         </>
//     )
// }