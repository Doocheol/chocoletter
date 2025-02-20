## 백엔드 배포 메뉴얼

1. 본 프로젝트 클론 이후 백엔드 디렉토리인 chocoletter-server 폴더로 이동
2. 다음 쉘 스크립트 입력

```bash
docker build \
  -t chocoletter-server:latest -f Dockerfile .

# 실행 시점에 필요한 DB 설정 등은 -e로 전달
docker run -d --name chocoletter-server-container \
  -e DB_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver \
  -e DB_URL=배포한 mysql url \
  -e DB_USERNAME=설정한 mysql id \
  -e DB_PASSWORD=설정한 mysql pw \
  -e DB_TYPE=mysql \
  -e DB_PORT=설정한 mysql 포트 \
  -e DB_SCHEMA=choco_letter_dev \
  -e ENCRYPT_SECRET_KEY=SsafyChocokey603 \
  -e OPEN_VIDU_URL=배포한 오픈비두의 url \
  -e OPEN_VIDU_SECRET=오픈비두를 배포할 때 설정한 오픈비두 secret \
  -e SPECIAL_GIFT_OPEN_DAY=2025.02.14 \ # 이 시점을 기준으로 막히는 api가 있으니 조절해서 사용
  -e KAKAO_CLIEND_ID=카카오 디벨로퍼스의 자신의 애플리케이션의 클라이언트 ID \
  -e KAKAO_REDIRECT_URI=카카오 디벨로퍼스에 설정한 리다이렉트 URI \
  -e JWT_SECRET= 4twHVaNwpeqqpIklwcjBRUA4dxw1REyT4twHVaNwpeqqpIklwcjBRUA4dxw1REyT4twHVaNwpeqqpIklwcjBRUA4dxw1REyT \
  -e FRONTEND_URL=배포한 프론트엔드 url \
  -p 8080:8080 \
  chocoletter-server-container:latest
EOF
```