import { StreamManager } from 'openvidu-browser';
import { OpenVidu, Subscriber } from 'openvidu-browser';
import { User, VideoState } from "../types/openvidu";

import axios from 'axios';
import React, { Component } from 'react';
import UserVideoComponent from './UserVideoComponent';

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
},

export const leaveSession = async () => {

	// --- 7) Leave the session by calling 'disconnect' method over the Session object ---

	const mySession = state.session;

	if (mySession) {
		mySession.disconnect();
	}

	// Empty all properties...
	this.OV = null;
	this.setState({
		session: undefined,
		subscribers: [],
		mySessionId: 'SessionA',
		myUserName: 'Participant' + Math.floor(Math.random() * 100),
		mainStreamManager: undefined,
		publisher: undefined
	});
}

render() {
	const mySessionId = this.state.mySessionId;
	const myUserName = this.state.myUserName;

	return (
		<div className="container">
			{this.state.session === undefined ? (
				<div id="join">
					<div id="img-div">
						<img src="resources/images/openvidu_grey_bg_transp_cropped.png" alt="OpenVidu logo" />
					</div>
					<div id="join-dialog" className="jumbotron vertical-center">
						<h1> Join a video session </h1>
						<form className="form-group" onSubmit={this.joinSession}>
							<p>
								<label>Participant: </label>
								<input
									className="form-control"
									type="text"
									id="userName"
									value={myUserName}
									onChange={this.handleChangeUserName}
									required
								/>
							</p>
							<p>
								<label> Session: </label>
								<input
									className="form-control"
									type="text"
									id="sessionId"
									value={mySessionId}
									onChange={this.handleChangeSessionId}
									required
								/>
							</p>
							<p className="text-center">
								<input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
							</p>
						</form>
					</div>
				</div>
			) : null}

			{this.state.session !== undefined ? (
				<div id="session">
					<div id="session-header">
						<h1 id="session-title">{mySessionId}</h1>
						<input
							className="btn btn-large btn-danger"
							type="button"
							id="buttonLeaveSession"
							onClick={this.leaveSession}
							value="Leave session"
						/>
						<input
							className="btn btn-large btn-success"
							type="button"
							id="buttonSwitchCamera"
							onClick={this.switchCamera}
							value="Switch Camera"
						/>
					</div>

					{this.state.mainStreamManager !== undefined ? (
						<div id="main-video" className="col-md-6">
							<UserVideoComponent streamManager={this.state.mainStreamManager} />

						</div>
					) : null}
					<div id="video-container" className="col-md-6">
						{this.state.publisher !== undefined ? (
							<div className="stream-container col-md-6 col-xs-6" onClick={() => this.handleMainVideoStream(this.state.publisher)}>
								<UserVideoComponent
									streamManager={this.state.publisher} />
							</div>
						) : null}
						{this.state.subscribers.map((sub, i) => (
							<div key={sub.id} className="stream-container col-md-6 col-xs-6" onClick={() => this.handleMainVideoStream(sub)}>
								<span>{sub.id}</span>
								<UserVideoComponent streamManager={sub} />
							</div>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
}


/**
 * --------------------------------------------
 * GETTING A TOKEN FROM YOUR APPLICATION SERVER
 * --------------------------------------------
 * The methods below request the creation of a Session and a Token to
 * your application server. This keeps your OpenVidu deployment secure.
 *
 * In this sample code, there is no user control at all. Anybody could
 * access your application server endpoints! In a real production
 * environment, your application server must identify the user to allow
 * access to the endpoints.
 *
 * Visit https://docs.openvidu.io/en/stable/application-server to learn
 * more about the integration of OpenVidu in your application server.
 */
const getToken = async (roomId: string) => {
	const sessionId = await createSession(roomId);
	return await createToken(sessionId);
}

const createSession = async (roomId: string) => {
	const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: roomId }, {
		headers: { 'Content-Type': 'application/json', },
	});
	return response.data; // The sessionId
}

const createToken = async (sessionId: string) => {
	const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
		headers: { 'Content-Type': 'application/json', },
	});
	return response.data; // The token
}
