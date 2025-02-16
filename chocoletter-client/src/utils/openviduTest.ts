import { OpenVidu } from 'openvidu-browser';
import { User, VideoState } from "../types/openvidutest";
import { getUserInfo } from '../services/userInfo';
import { toast } from 'react-toastify';
import axios from 'axios';
import React from 'react';

const APPLICATION_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
const OPENVIDU_URL = import.meta.env.VITE_OPENVIDU_SERVER_URL
const OPENVIDU_SECRET_BASE = import.meta.env.VITE_OPENVIDU_SECRET_BASE

const userInfo = getUserInfo();

export const joinSession = async (
	user: User,
	setVideo: React.Dispatch<React.SetStateAction<VideoState>>,
	setIsTerminate: React.Dispatch<React.SetStateAction<boolean>>,
    setIsItThere: React.Dispatch<React.SetStateAction<boolean>>,
) => {
	if (!user.sessionId) return;

	// Openvidu 객체 생성
	const OV = new OpenVidu();

	// 세션 생성
	const session = OV.initSession();

    // 인원 확인
    session.on("connectionCreated", async () => {
        try {
            console.log("openvidu is connected")
        } catch (err) {
            if (!toast.isActive("no-connect")) {
                toast.error("연결에 실패했습니다. 새로고침 해주세요!", { 
                    toastId: "no-connect",
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        }
    });

	// stream 생성
	session.on("streamCreated", async (event) => {
		try {
			const subscriber = session.subscribe(event.stream, undefined)
			await setVideo((prevVideo) => ({
				...prevVideo,
				subscribers: subscriber,
			}));
			if (user.sessionId && await countConnection(user.sessionId) === 2) {
				setIsItThere(true);
			};
		} catch (err) {
			if (!toast.isActive("no-create-stream")) {
                toast.error("비디오 생성성에 실패했습니다. 새로고침 해주세요!", { 
                    toastId: "no-create-stream",
                    position: "top-center",
                    autoClose: 3000,
                });
            }
		}
	});

	session.on("streamDestroyed", () => {
		setVideo((prevVideo) => {
			return {
				...prevVideo,
				subscribers: undefined
			}
		})
	});

    session.on("sessionDisconnected", (event) => {
		setIsTerminate(true)
    });

	// On every asynchronous exception...
	session.on('exception', (exception) => {
		console.warn(exception);
	});

	// publish 저장
	getToken(user.sessionId).then((token) => {
		session
			.connect(token, { clientData: user.username })
			.then(async () => {
				const publisher = await OV.initPublisherAsync(undefined, {
					audioSource: undefined, // 기본 마이크
					videoSource: undefined, // 기본 카메라
					publishAudio: true, // 오디오 송출 여부
					publishVideo: true, // 비디오 송출 여부
					resolution: '640x480', // 해상도
					frameRate: 30, // 프레임 레이트
					mirror: true, // 거울모드
				});
                
                session.publish(publisher)

				// 비디오 상태 저장
				setVideo((prev) => ({
					...prev,
					session: session,
					mainStreamManager: publisher,
					publisher: publisher,
				}));
			})
			.catch((error) => {
				new Error('There was an error connecting to the session:');
			});
	});
}

export const pushPublish = async (
    manageVideo: VideoState
) => {
    if (manageVideo.publisher) {
        manageVideo.publisher.publishAudio(true);
    }
}

export const leaveSession = async (
	manageVideo: VideoState,
	setVideo: React.Dispatch<React.SetStateAction<VideoState>>,
) => {
	if (manageVideo.session) {
		try {
			if (manageVideo.publisher) {
				manageVideo.publisher.stream.getMediaStream().getTracks().forEach(track => {
					track.stop();
					track.enabled = false;
				});
				manageVideo.publisher.stream.disposeWebRtcPeer();
				manageVideo.publisher.stream.disposeMediaStream();
				manageVideo.publisher = undefined;
			}

            manageVideo.session.disconnect();
		} catch (err) {
			new Error("연결 해제 오류")
		} finally {
			setVideo((prevVideo) => ({
				...prevVideo,
				session: undefined,
				mainStreamManager: undefined,
				publisher: undefined,
				subscribers: undefined,
			}));
		}
	}
}

// 세션ID와 토큰 생성
const getToken = async (roomId: string) => {
	const sessionId = await createSession(roomId);
	return await createToken(sessionId);
};

const createSession = async (roomId: string) => {
	const response = await axios.post(APPLICATION_SERVER_URL + '/api/v1/openvidu/sessions', { customSessionId: roomId }, {
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${userInfo?.accessToken}`
		},
        withCredentials: true,
	});
	return response.data; // The sessionId
};

const createToken = async (sessionId: string) => {
	const response = await axios.post(APPLICATION_SERVER_URL + '/api/v1/openvidu/sessions/' + sessionId + '/connections', {}, {
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${userInfo?.accessToken}`
		},
        withCredentials: true,
	});
	return response.data; // The token
};

const countConnection = async (sessionId: string) => {
    if (!sessionId) return;
    try {
        const res = await axios.get(`${OPENVIDU_URL}openvidu/api/sessions/${sessionId}/connection`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${OPENVIDU_SECRET_BASE}`
            },
        });
        return res.data?.numberOfElements
    } catch (err) {
        return -1;
    }
};

export const deleteSession = async (sessionId: string) => {
    if (!sessionId) return;
    try {
        const res = await axios.delete(`${OPENVIDU_URL}openvidu/api/sessions/${sessionId}`, {
            headers: {
                'Authorization': `Basic ${OPENVIDU_SECRET_BASE}`
            },
        });
        return res.data
    } catch (err) {
        return null;
    }
};
