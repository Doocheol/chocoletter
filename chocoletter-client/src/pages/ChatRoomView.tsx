import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { memberIdAtom } from "../atoms/auth/userAtoms";
import clsx from "clsx";
import axios from "axios";
import { getUserInfo } from "../services/userInfo";
import { GoBackButton } from "../components/common/GoBackButton";
import { ImageButton } from "../components/common/ImageButton";
import LetterInChatModal from "../components/chat-room/modal/LetterInChatModal";
import LetterInChatOpenButton from "../components/chat-room/button/LetterInChatOpenButton";
import send_icon from "../assets/images/main/send_icon.svg";
// import { useSelector } from "react-redux"
import { Client, Stomp } from "@stomp/stompjs";
import { changeKSTDate } from "../utils/changeKSTDate";
import useViewportHeight from "../hooks/useViewportHeight";
import { MdRecommend } from "react-icons/md";
import { getLetterInchat } from "../services/chatApi";
import { FaArrowDown } from "react-icons/fa"; // ⬇ 아이콘 추가
import { CgChevronDown } from "react-icons/cg";

interface MessageType {
    messageType: string;
    senderId: string | null;
    senderName: string | null; 
    content: string;
    createdAt: string; 
    isRead: boolean;
}

interface LetterData {
    type: "FREE" | "QUESTION";
    nickName: string;
    content: string;
    question: string;
    answer: string;
}

const ChatRoomView = () => {
    useViewportHeight();
    
    // 채팅방 및 유저 정보 
    const location = useLocation();
    const sender = location.state?.nickName
    const { roomId } = useParams()
    const memberId = useRecoilValue(memberIdAtom);
    const userInfo = getUserInfo();
    // const roomId = "1"
    
    // 키보드 관련 변수 
    const [keyboardHeight, setKeyboardHeight] = useState(0); // 키보드 높이
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false); // 키보드 사용 여부
    const [isComposing, setIsComposing] = useState(false); // IME(한글 조합) 상태 관리
    const [placeholder, setPlaceholder] = useState("내용을 입력하세요");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);// 채팅창 스크롤을 맨 아래로 이동
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    const [showScrollButton, setShowScrollButton] = useState(false); // 최하단 버튼 상태 추가
    const chatContainerRef = useRef<HTMLDivElement | null>(null); // 스크롤 감지용 Ref 추가
    
    // 편지 및 채팅 메세지
    const [isOpenLetter, setIsOpenLetter] = useState(false);
    const [letter, setLetter] = useState<LetterData | null>(null);
    const [messages, setMessages] = useState<MessageType[]>([]); // 현재 채팅방의 메시지 리스트를 관리
    const [message, setMessage] = useState(""); // 사용자가 입력한 메시지를 저장
    const stompClient = useRef<Client | null>(null); // STOMP(WebSocket) 연결을 관리하는 객체
    // const currentUser = useSelector((state) => state.user); // 현재 로그인된 사용자 정보(id, 프로필 이미지 등)를 가져옴.
    // const [customerSeq, setCustomerSeq] = useState(""); // 대화 중인 상대방의 사용자 ID
    
    //입력 구성 시작 핸들러
    const handleCompositionStart = () => {
        setIsComposing(true);
    };
    
    //입력 구성 끝 핸들러
    const handleCompositionEnd = (
        e: React.CompositionEvent<HTMLTextAreaElement>
    ) => {
        setIsComposing(false);
        setMessage(e.currentTarget.value);
    };
    
    // 엔터 키 이벤트 핸들러
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // 기본 Enter 키 동작 방지 (줄바꿈 방지), 기본 `blur` 동작 방지
            if (message.trim() !== "") {
                const currentInput = inputRef.current;
                if (currentInput) {
                    currentInput.setAttribute("readonly", "true"); // ✅ 입력 필드가 비활성화되지 않도록 방지
                }
                sendMessage();
                setTimeout(() => {
                if (currentInput) {
                    currentInput.removeAttribute("readonly"); // ✅ 메시지 전송 후 다시 활성화
                    currentInput.focus(); // ✅ 키보드 유지
                }
            }, 10);
            }
        }
    };

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

    // 최하단으로 자동 스크롤 함수 
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowScrollButton(false); // 하단 버튼 숨김
    };

    // 스크롤 이벤트 감지
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (!chatContainer) return;

        const handleScroll = () => {
            const isAtBottom = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 50;
            console.log("스크롤 이벤트 발생: isAtBottom =", isAtBottom);
            setShowScrollButton(!isAtBottom);
        };

        chatContainer.addEventListener("scroll", handleScroll);
        return () => chatContainer.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    console.log("🔍 scrollHeight:", chatContainer.scrollHeight);
    console.log("🔍 clientHeight:", chatContainer.clientHeight);
    console.log("🔍 scrollTop:", chatContainer.scrollTop);
}, []);



    // 새로운 메세지 보내면 최하단 이동 
    useEffect(() => {
       scrollToBottom();
    }, [messages]);

    // 키보드 열려있지 않고 페이지 처음 렌더링되면 최하단 이동동
    useEffect(() => {
        if (!isKeyboardOpen) { 
            setTimeout(scrollToBottom, 100);
        }
    }, []);

    // 편지 불러오기 
    useEffect(() => {
        const fetchLetter = async () => {
            try {
                if (!roomId) {
                    return;
                }
                const data = await getLetterInchat(roomId);
                console.log("편지 내용 : ", data)
                setLetter(data);
            } catch (error) {
                console.error("편지지 불러오기 실패!", error);
            } 
        };
        fetchLetter();
    }, [roomId]);
        
    
    ///////////////////////////////////////////// 채팅방 관련 코드
    ///////////////////////////////////////////// 나중에 파일 따로 빼기
    
    // 기존 채팅 메시지를 가져오기
    const fetchChatHistory = async () => {
        if (!roomId) return;
        
        try {
            // console.log("기존 메시지 불러오는 중...");
            const baseUrl = import.meta.env.VITE_CHAT_API_URL;
            const response = await axios.get(`${baseUrl}/api/v1/chat/${roomId}/all`)
            
            if (response.data.chatMessages && Array.isArray(response.data.chatMessages)) {
                setMessages(response.data.chatMessages.reverse());
                // console.log("⭕기존 메시지 불러오기 성공!", response.data);
            }
        } catch (error) {
            // console.error("기존 메시지 불러오기 실패!", error);
        }
    };
    
    // WebSocket을 통해 STOMP 연결 설정
    const connect = () => {
        
        if (!userInfo || !userInfo.accessToken) {
                // console.error("🚨 connect : Access token is missing!");
                return;
            }
    
        stompClient.current = new Client({
            brokerURL: import.meta.env.VITE_CHAT_WEBSOCKET_ENDPOINT, // WebSocket 서버 주소
            reconnectDelay: 5000, // WebSocket 연결이 끊겼을 때 5초마다 자동으로 다시 연결
            heartbeatIncoming: 4000, // 서버가 4초 동안 데이터를 보내지 않으면 연결이 끊겼다고 판단
            heartbeatOutgoing: 4000, // 클라이언트가 4초마다 서버에 "살아 있음" 신호를 보냄
            connectHeaders: {
                Authorization: `Bearer ${userInfo?.accessToken}`, // 인증 토큰 포함 userInfo?.accessToken
            },
            
            onConnect: () => {
                // console.log("WebSocket 연결 성공! (채팅방 ID:", roomId, ")");
                
                if (!stompClient.current || !stompClient.current.connected) {
                    // console.error("🚨 STOMP 연결되지 않음. 구독 불가능.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${userInfo?.accessToken}`, // 헤더 추가
                };
                
                stompClient.current?.subscribe(`/topic/${roomId}`, (message) => {                    
                    try {
                        const newMessage = JSON.parse(message.body);
                            
                        if (newMessage.messageType) {
                            if (newMessage.messageType === "CHAT") {
                                setMessages((prevMessages) => [...prevMessages, newMessage]);
                            } else if (newMessage.messageType === "READ_STATUS") {
                                // console.log("읽음 상태 변경 감지, 메시지 새로고침");
                                fetchChatHistory()
                            }
                        }
                    } catch (error) {
                        // console.error("메시지 JSON 파싱 오류:", error);
                    }
                }, 
                headers
            );
                // console.log(`✅ 채팅방 구독 완료`);
            },
            
            onDisconnect: () => {
                // console.log("WebSocket 연결 해제됨");
            },
            
            onStompError: (error) => {
                // console.error("STOMP 오류 발생:", error);
            },
        });        
        stompClient.current.activate(); //STOMP 클라이언트 활성화
    };
        
    // WebSocket을 통해 메시지 전송
    const sendMessage = () => {

        if (!userInfo || !userInfo.accessToken) {
                // console.error("sendMessage : 🚨 Access token is missing!");
                return;
        }

        if (!stompClient.current || !stompClient.current.connected) {
            // console.error("STOMP 연결이 없습니다. 메시지를 보낼 수 없습니다.");
            return;
        }
        
        if (stompClient.current && message.trim()) {
            const msgObject = {
                messageType: "CHAT",
                roomId: roomId,       
                senderId: memberId, // 현재 로그인한 사용자 ID
                senderName: "none",
                content: message,   
            };

            // WebSocket을 통해 메시지 전송
            stompClient.current.publish({
                destination: `/app/send`,
                body: JSON.stringify(msgObject),
                headers: {
                    Authorization: `Bearer ${userInfo?.accessToken}`,
                }
            });

            setMessage(""); // 입력 필드 초기화
            
            // 메시지 전송 후 입력 필드에 포커스 유지
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };
    
    // 채팅방 나가기
    const disconnect = async () => {
        try {
            const baseUrl = import.meta.env.VITE_CHAT_API_URL;
            const response = await axios.post(`${baseUrl}/api/v1/chat/${roomId}/${memberId}/disconnect`)
            
            stompClient.current?.deactivate()
            // console.log("채팅방 연결이 정상적으로 종료되었습니다.");
        } catch (error) {
            stompClient.current?.deactivate() // 옵션: 에러 발생해도 STOMP 연결은 종료
            // console.error("채팅방 연결 끊기 실패:", error);
        }
    };
        
    // 웹소켓 연결 및 이전메세지 불러오기
    useEffect(() => {
        if (!stompClient.current || !stompClient.current.connected) {
            connect();
        }
        fetchChatHistory(); 
        return () => {
            disconnect(); // 컴포넌트 언마운트 시 연결 해제
        };
    }, [roomId]);
    

    return (
        <div className="flex flex-col items-center justify-between min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg">
            {/* 편지 모달 */}
            <LetterInChatModal
                isOpen={isOpenLetter}
                onClose={() => setIsOpenLetter(false)}
                nickName={letter?.nickName}
                content={letter?.content ?? ""} 
                question={letter?.question ?? ""}
                answer={letter?.answer ?? ""}
            />
            {/* 상단바 */}
            <div className="w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex flex-col justify-center items-center gap-[15px] fixed z-50">
                <div className="self-stretch justify-between items-center inline-flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                        <GoBackButton />
                    </div>
                    <div className="text-center text-white text-2xl font-normal font-sans leading-snug">{letter?.nickName}</div>
                    <div className="w-6 h-6"><LetterInChatOpenButton onPush={() => setIsOpenLetter(true)} /></div>
                </div>
            </div>

            {/* 채팅 내용 */}
            <div
                ref={chatContainerRef}
                className="flex-1 w-full md:max-w-[360px] flex flex-col space-y-[15px] justify-start items-stretch mt-[58px] pt-4 pb-[55px] overflow-y-auto"
                style={{ height: "400px", minHeight: "400px", maxHeight: "100vh" }} 
            >
                {messages.map((msg, index) => (
                    <div key={index} className={clsx(
                        "flex items-end mx-2",
                        msg.senderId === memberId ? "justify-end" : "justify-start"
                    )}>
                        {/* 상대방 말풍선 */}
                        {msg.senderId !== memberId && (
                            <div className="flex w-full gap-[5px]">
                                <div 
                                    className="max-w-[200px] flex p-[10px_15px] rounded-r-[15px] rounded-bl-[15px] break-words bg-white border border-black"
                                >
                                    <div className="text-sans text-[15px]">{msg.content}</div>
                                </div>
                                <div className="flex flex-col justify-end">
                                    <div className="text-[12px] text-[#7F8087]">{changeKSTDate({ givenDate: msg.createdAt.split('.')[0] + 'Z', format: "HH:mm" })}</div>
                                </div>
                            </div>
                        )}

                        {/* 내 말풍선 */}
                        {msg.senderId === memberId && (
                            <div className="flex w-full gap-[5px] justify-end">
                                <div className="flex flex-col justify-end items-end">
                                    {!msg.isRead && (
                                        <div className="text-[10px] text-red-500">
                                            1 {/* 읽지 않은 경우 표시 */}
                                        </div>
                                    )}
                                    <div className="text-[12px] text-[#7F8087]">{changeKSTDate({ givenDate: msg.createdAt.split('.')[0] + 'Z', format: "HH:mm" })}</div>
                                </div>
                                <div 
                                    className="max-w-[200px] flex p-[10px_15px] rounded-l-[15px] rounded-br-[15px] break-words border border-black bg-chocoletterPurpleBold text-white"
                                >
                                    <div className="text-sans text-[15px]">{msg.content}</div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef}/>
            </div>

            {/* 최하단 이동 버튼 */}
            {showScrollButton && (
                <button 
                    onClick={scrollToBottom}
                    className="fixed bottom-[80px] right-3 bg-white text-black p-2 rounded-full shadow-md"
                >
                    <CgChevronDown size={25} />
                </button>
            )}


            {/* 입력창 */}
            {/* <div
                className={clsx(
                    "fixed inset-x-0 p-[7px_15px] bg-[#F7F7F8] flex flex-row justify-between mx-auto w-full md:max-w-sm gap-[15px] transition-all duration-300",
                    isKeyboardOpen ? `bottom-[${keyboardHeight}px]` : "bottom-0"
                )}
            > */}
            <div
                className={clsx(
                    "fixed inset-x-0 p-[7px_15px] bg-[#F7F7F8] flex flex-row justify-between mx-auto w-full md:max-w-sm gap-[15px] transition-all duration-300"
                )}
                style={{
                    bottom: 0, //화면 하단에 고정
                    transform: `translateY(-${isKeyboardOpen ? keyboardHeight : 0}px)`
                }}
            >
                {/* 입력창 컨테이너 */}
                <div className="flex items-center w-full max-w-md p-[5px_15px] bg-white rounded-[16px] gap-[10px]">
                    <textarea
                        ref={inputRef} // 입력 필드 참조 설정
                        placeholder="내용을 입력하세요"
                        className="flex-1 outline-none placeholder-[#CBCCD1] text-[16px] resize-none h-[30px] text-left py-[5px] leading-[20px]"
                        value={message} // 현재 message 상태를 textarea에 반영
                        onChange={(e) => setMessage(e.target.value)} // 입력할 때마다 message 상태 변경
                        onKeyDown={(e) => handleKeyDown(e)}
                        onCompositionStart={handleCompositionStart} // 한글 입력 지원
                        onCompositionEnd={handleCompositionEnd}
                        onBlur={(e) => {
                            setPlaceholder("내용을 입력하세요"); // Placeholder 복원
                            setTimeout(() => e.target.focus(), 0); // 블러 방지 & 포커스 유지
                        }}                        
                    />


                    {/* <input
                        // ref={inputRef} // 입력 필드 참조 설정
                        type="text"
                        placeholder="내용을 입력하세요"
                        className="flex-1 outline-none placeholder-[#CBCCD1] text-[15px]"
                        value={message} // 현재 message 상태를 input 필드에 반영
                        onChange={(e) => setMessage(e.target.value)} // 입력할 때마다 message 상태 변경
                        onKeyDown={(e) => handleKeyDown(e)}
                    /> */}
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

export default ChatRoomView;