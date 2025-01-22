// import { StreamManager } from 'openvidu-browser';
import { OpenVidu, Subscriber } from 'openvidu-browser';
import { User, VideoState } from "../types/openvidu";

import axios from 'axios';
import React from 'react';

const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000/';

export const joinSession = async (
	user: User,
	setSessionId: React.Dispatch<React.SetStateAction<string | undefined>>,
	setVideo: React.Dispatch<React.SetStateAction<VideoState>>,
) => {
	if (!user.sessionId) return;

	// Openvidu 객체 생성
	const OV = new OpenVidu();

	// 세션 생성
	const session = OV.initSession();

	// stream 생성
	session.on("streamCreated", (event) => {
		try {
			const subscriber = session.subscribe(event.stream, undefined)
			setVideo((prevVideo) => ({
				...prevVideo,
				subscribers: [...prevVideo.subscribers, subscriber],
			}));
		} catch (err) {
			console.log("stream 생성 중 오류 발생! : ", err);
		}
	});

	session.on("streamDestroyed", (event) => {
		setVideo((prevVideo) => {
			const StreamManager = event.stream.streamManager;
			return {
				...prevVideo,
				subscribers: prevVideo.subscribers.filter(
					(sub) => sub !== StreamManager
				)
			}
		})
	});

	// On every asynchronous exception...
	session.on('exception', (exception) => {
		console.warn(exception);
	});

	// publish 연결
	getToken(user.sessionId).then((token) => {
		console.log('token : ', token)
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
					// insertMode: 'APPEND',
					mirror: true, // 거울모드
				});

				session.publish(publisher);

				// var devices = await OV.getDevices();
				// var videoDevices = devices.filter(device => device.kind === 'videoinput');
				// var currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
				// var currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

				// Set the main video in the page to display our webcam and store our Publisher
				setVideo((prev) => ({
					...prev,
					session: session,
					mainStreamManager: publisher,
					publisher: publisher,
				}));
			})
			.catch((error) => {
				console.log('토큰 연결 오류:', error.code, error.message);
			});
	});
}

// export const leaveSession = async () => {

// 	// --- 7) Leave the session by calling 'disconnect' method over the Session object ---

// 	const mySession = state.session;

// 	if (mySession) {
// 		mySession.disconnect();
// 	}

// 	// Empty all properties...
// 	this.OV = null;
// 	this.setState({
// 		session: undefined,
// 		subscribers: [],
// 		mySessionId: 'SessionA',
// 		myUserName: 'Participant' + Math.floor(Math.random() * 100),
// 		mainStreamManager: undefined,
// 		publisher: undefined
// 	});
// }

// 세션ID와 토큰 생성
const getToken = async (roomId: string) => {
	const sessionId = await createSession(roomId);
	return await createToken(sessionId);
};

const createSession = async (roomId: string) => {
	const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: roomId }, {
		headers: { 'Content-Type': 'application/json', },
	});
	return response.data; // The sessionId
};

const createToken = async (sessionId: string) => {
	const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
		headers: { 'Content-Type': 'application/json', },
	});
	return response.data; // The token
};
