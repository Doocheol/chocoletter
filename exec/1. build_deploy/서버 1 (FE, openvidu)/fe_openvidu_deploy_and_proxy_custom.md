## Openvidu, 프론트엔드 배포 메뉴얼

#### 1. Openvidu 배포
- https://docs.openvidu.io/en/stable/deployment/ce/on-premises/#2-deployment
- https://docs.openvidu.io/en/stable/deployment/ce/on-premises/#3-configuration
- Configuration에서 `DOMAIN_OR_PUBLIC_IP`(오픈비두 url), `OPENVIDU_SECRET`(프론트 엔드 빌드시 넣는 OPENVIDU_SECRET과 통일) 을 입력한다.
- `CERTIFICATE_TYPE` 를 selfsigned로 입력한다.
- `./openvidu restart`

#### 2. 프론트엔드 배포

1. 본 프로젝트 클론 이후 프론트엔드 디렉토리인 chocoletter-client 폴더로 이동
2. 아래 쉘 스크립트 입력

```bash
docker build \
  --build-arg VITE_API_SERVER_URL=백엔드 서버 url \
  --build-arg VITE_KAKAOTALK_JAVASCRIPT_KEY=카카오 디벨로퍼스 자바스크립트 키 \
  --build-arg VITE_OPENVIDU_SERVER_URL=오픈비두 서버 url \
  --build-arg VITE_OPENVIDU_SECRET_BASE=오픈비두 시크릿 \
  --build-arg VITE_EVENT_DAY=0214 \ # 이 시점을 기준으로 프론트엔드 분기가 바뀜 (이벤트 날짜 전, 이벤트 날짜)
  --build-arg VITE_CHAT_WEBSOCKET_ENDPOINT=wss://채팅서버 url \ # 예: wss://chat.chocolate-letter.com
  --build-arg VITE_CHAT_API_URL=https://채팅서버 url \ # 예: https://chat.chocolate-letter.com
  --build-arg VITE_GOOGLE_ANALYTICS_ID=구글 애널리틱스 키 \
  -t chocoletter-fe-container:latest -f Dockerfile .

docker run -d --name chocoletter-fe-container \
  -p 5173:5173 \
  chocoletter-fe-container:latest
EOF
```

#### 3. openvidu proxy 커스텀

- openvidu를 설치하면 openvidu-proxy 컨테이너가 자동으로 실행된다.
- openvidu proxy 컨테이너(nginx)가 네트워크를 호스트로 잡고있어서 호스트서버에 nginx를 실행할 수 없다.
- 이에 대한 가이드 - https://docs.openvidu.io/en/2.18.0/troubleshooting/#161-create-your-own-virtual-hosts-server-blocks
- 나의 프론트엔드 리버스 프록시 설정(프론트엔드 url -> 5173 포트)을 `/opt/openvidu/custom-nginx-vhosts/` 에 확장자가 `.conf`로 되게끔 설정을 입력한다.
- 위 설정파일에서의 인증서 경로는 openvidu-proxy 컨테이너의 내부 위치이다.

- openvidu url, frontend url에 대한 인증서를 openvidu-proxy 컨테이너 내부에 넣고 conf파일에 각 경로를 적어준다.
- 이렇게하면, openvidu와 프론트엔드 모두 nginx를 역방향 프록시 서버로 사용하며 잘 작동한다.