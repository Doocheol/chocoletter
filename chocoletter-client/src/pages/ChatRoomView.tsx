import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import LetterInChatModal from "../components/chat-room/modal/LetterInChatModal";
import LetterInChatOpenButton from "../components/chat-room/button/LetterInChatOpenButton";
import { ImageButton } from "../components/common/ImageButton";
import send_icon from "../assets/images/main/send_icon.svg";
// import { useSelector } from "react-redux"
import { Client, Stomp } from "@stomp/stompjs";
import { changeKSTDate } from "../utils/changeKSTDate";
import useViewportHeight from "../hooks/useViewportHeight";


// ✅Todo : 수정하기
interface MessageType {
    // roomId: number;
    senderId: number; 
    // senderName: string; // 메시지 데이터에 없는 경우, 기본값이나 null로 설정 가능
    content: string;
    createdAt: string; // 메시지 생성 시간
    read: boolean; // 읽음 여부
}

const ChatRoonView = () => {
    // useViewportHeight();

    const location = useLocation();
    const sender = location.state?.nickName  ?? "예슬";
    // const roomId = location.state?.roomId;
    const { roomId } = useParams()
    const parsedRoomId = parseInt(roomId ?? "0", 10)

    const [isOpenLetter, setIsOpenLetter] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0); // 키보드 높이
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false); // 키보드 사용 여부

    const [messages, setMessages] = useState<MessageType[]>([]); // 현재 채팅방의 메시지 리스트를 관리
    const [message, setMessage] = useState(""); // 사용자가 입력한 메시지를 저장
    const stompClient = useRef<Client | null>(null); // STOMP(WebSocket) 연결을 관리하는 객체
    // const currentUser = useSelector((state) => state.user); // 현재 로그인된 사용자 정보(id, 프로필 이미지 등)를 가져옴.
    const messagesEndRef = useRef<HTMLDivElement | null>(null);//채팅창 스크롤을 맨 아래로 이동
    // const [customerSeq, setCustomerSeq] = useState(""); // 대화 중인 상대방의 사용자 ID

    // 키보드 사용시 입력창 높이 조정
    useEffect(() => {
        const handleResize = () => {
            const fullHeight = window.innerHeight; //Android에서 사용할 기본 화면 높이
            const viewportHeight = window.visualViewport?.height || fullHeight; //iOS에서는 visualViewport 사용

            const keyboardSize = fullHeight - viewportHeight;

            if (keyboardSize > 100) {
                setKeyboardHeight(keyboardSize); //키보드가 차지하는 높이 설정
                setIsKeyboardOpen(true);
            } else {
                setKeyboardHeight(0);
                setIsKeyboardOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // ✅TODO : 편지 데이터 get
    // 더미데이터
    const Letters = [
        {
            nickName: "예슬", 
            content: "내가 누구게 ?????",
            question: null,
            answer: null
        },
        
        {
            nickName: "준희",
            content: null,
            question: "우리 둘이 함께했던 장소 중에서 가장 기억에 남는 곳은 어디야?",
            answer: "롯데타워"
        }
    ]

    const ReceivedData = Letters.find(letter => letter.nickName === sender);

    ///////////////////////////////////////////// 채팅방 관련 코드

    // 기존 채팅 메시지를 가져오기
    // ✅ TODO : 위로 더 올리면 페이지 바뀌게 하는 로직 추가
    const fetchMessages = async () => {
        try {
            console.log("기존 메시지 불러오는 중...");
            const baseUrl = import.meta.env.VITE_CHAT_API_URL;
            const response = await axios.get(`${baseUrl}/api/v1/chat/${parsedRoomId}/all?page=0&size=20`); // ✅ TODO 수정

            if (response.data && Array.isArray(response.data)) {
                setMessages(response.data);
                // console.log("기존 메시지 불러오기 성공!", response.data);
            } else {
                console.warn("받은 데이터가 배열 형식이 아닙니다.", response.data);
            }
        } catch (error) {
            console.error("기존 메시지 불러오기 실패!", error);
        }
    };
    
    // WebSocket을 통해 STOMP 연결 설정
    const connect = () => {
        stompClient.current = new Client({
            brokerURL: import.meta.env.VITE_CHAT_WEBSOCKET_ENDPOINT, // WebSocket 서버 주소
            reconnectDelay: 5000, // WebSocket 연결이 끊겼을 때 5초마다 자동으로 다시 연결
            heartbeatIncoming: 4000, // 서버가 4초 동안 데이터를 보내지 않으면 연결이 끊겼다고 판단
            heartbeatOutgoing: 4000, // 클라이언트가 4초마다 서버에 "살아 있음" 신호를 보냄

            onConnect: () => {
                console.log("WebSocket 연결 성공! (채팅방 ID:", parsedRoomId, ")");
                
                // 채팅방 메시지 구독
                stompClient.current?.subscribe(`/topic/${parsedRoomId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    console.log("Received message:", newMessage);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                    // if (newMessage.senderSeq !== currentUser.userSeq) {
                    // setCustomerSeq(newMessage.senderSeq); // 상대방 ID 저장
                    // }
                });
            },

            onDisconnect: () => {
                console.log("❌ WebSocket 연결 해제됨!");
            },

            onStompError: (error) => {
                console.error("🚨 STOMP 오류 발생:", error);
            },
        });

        stompClient.current.activate(); //STOMP 클라이언트 활성화
    };

    // 메시지 전송 함수
    const [testSenderId, setTestSenderId] = useState(""); // senderId를 입력받기 위한 상태 추가
    const sendMessage = () => {
        if (stompClient.current && message.trim()) {
            const msgObject = {
                roomId: parsedRoomId,       
                senderId: testSenderId, // currentUser.id, // 현재 로그인한 사용자 ID
                senderName: "none",
                content: message,   
            };
            stompClient.current.publish({
                destination: `/app/send`,
                body: JSON.stringify(msgObject),
            });
            // setMessages((prevMessages) => [...prevMessages, msgObject]); // ✅추후삭제!! 바로 화면에 추가
            setMessage(""); // 입력 필드 초기화
        }
    };
    
    useEffect(() => {
        connect(); // 웹소켓 연결
        fetchMessages(); // ✅ TODO : 주석 풀기 //이전 메세지 불러오기
        return () => {
            stompClient.current?.deactivate(); // 컴포넌트 언마운트 시 연결 해제
        };
    }, [parsedRoomId]);

    // 최하단 자동 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 엔터 키 이벤트 핸들러
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // 기본 엔터 키 동작 방지 (줄바꿈 방지)
            sendMessage(); // 메시지 전송 함수 호출
        }
    };

    return (
        // TODO : 스타일 추후에 파일 따로 빼기
        <div className="flex flex-col items-center justify-between min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg">
            <LetterInChatModal
                isOpen={isOpenLetter}
                onClose={() => setIsOpenLetter(false)}
                nickName={sender}
                content={ReceivedData?.content ?? ""} 
                question={ReceivedData?.question ?? ""}
                answer={ReceivedData?.answer ?? ""}
            />
            {/* 상단바 */}
            <div className="w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex flex-col justify-center items-center gap-[15px] fixed z-50">
                <div className="self-stretch justify-between items-center inline-flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                        <GoBackButton />
                    </div>
                    <div className="text-center text-white text-2xl font-normal font-sans leading-snug">{sender}</div>
                    <div className="w-6 h-6"><LetterInChatOpenButton onPush={() => setIsOpenLetter(true)} /></div>
                </div>
            </div>

            {/* 채팅 내용 */}
            <div className="flex-1 w-full md:max-w-[343px] flex flex-col space-y-[15px] justify-start items-stretch mt-[58px] pt-4 pb-[60px] overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={clsx(
                        "flex items-end mx-2",
                        msg.senderId === Number(testSenderId) ? "justify-end" : "justify-start"
                    )}>
                        {/* 상대방 말풍선 */}
                        {msg.senderId !== Number(testSenderId) && (
                            <div className="flex w-full gap-[5px]">
                                <div 
                                    className="max-w-[200px] flex p-[10px_15px] rounded-r-[15px] rounded-bl-[15px] break-words bg-white border border-black"
                                >
                                    <div className="text-sans text-[15px]">{msg.content}</div>
                                </div>
                                <div className="font-[Pretendard] text-[12px] text-[#7F8087] self-end">{changeKSTDate({ givenDate: msg.createdAt, format: "HH:mm" })}</div>
                            </div>
                        )}

                        {/* 내 말풍선 */}
                        {msg.senderId === Number(testSenderId) && (
                            <div className="flex items-center space-x-2">
                                <div className="font-[Pretendard] text-xs text-[#7F8087] self-end">{changeKSTDate({ givenDate: msg.createdAt, format: "HH:mm" })}</div>
                                <div 
                                    className="max-w-[200px] flex p-[10px_15px] rounded-l-[15px] rounded-br-[15px] break-words border border-black bg-chocoletterPurpleBold text-white"
                                >
                                    <div className="text-sans text-[15px]">{msg.content}</div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>


            {/* 입력창 */}
            <div
                className={clsx(
                    "fixed inset-x-0 p-[7px_15px] bg-[#F7F7F8] flex flex-row justify-between mx-auto w-full md:max-w-sm gap-[15px] transition-all duration-300",
                    isKeyboardOpen ? `bottom-[${keyboardHeight}px]` : "bottom-0"
                )}
            >
                {/* ✅추후 삭제 senderId 입력창 (테스트용) */}
                <div className="w-[80px] h-[30px] bg-gray-100 rounded-md mb-2">
                    <input
                        type="text"
                        placeholder="senderId 입력"
                        className="w-full h-full border border-gray-300 rounded-md text-[10px]"
                        value={testSenderId}
                        onChange={(e) => setTestSenderId(e.target.value)}
                    />
                </div>
                {/* 입력창 컨테이너 */}
                <div className="flex items-center w-full max-w-md p-[5px_15px] bg-white rounded-[16px] gap-[10px]">
                    <input
                        type="text"
                        placeholder="내용을 입력하세요"
                        className="flex-1 outline-none placeholder-[#CBCCD1] text-[15px]"
                        value={message} // 현재 message 상태를 input 필드에 반영
                        onChange={(e) => setMessage(e.target.value)} // 입력할 때마다 message 상태 변경
                        onKeyDown={(e) => handleKeyDown(e)}
                    />
                </div>
                {/* 전송 버튼 */}
                <ImageButton
                    onClick={sendMessage}
                    src={send_icon}
                    className="w-[24px]"
                />
            </div>
        </div>
    )
};

export default ChatRoonView;