## 챗 서버 배포 메뉴얼

#### 1. 프로젝트 세팅

1. 클론 후, 챗 서버 디렉토리 이동 `cd chocoletter-chat/chat`
2. 새로운 properties 만들기 
2-1. `cd src/main/resources`
2-2. `touch ./application-secret.properties`
2-3. 아래 쉘 명령어 입력

```bash
echo "SPRING_DATA_MONGODB_URI=몽고 디비 URI" >> ./application-secret.properties \
echo "SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092" >> ./application-secret.properties \
echo "SPRING_KAFKA_TOPIC_NAME=chat" >> ./application-secret.properties \
echo "SPRING_KAFKA_CONSUMER_GROUP_ID=chat-group" >> ./application-secret.properties \
echo "SPRING_ENCRYPT_SECRET_KEY=SsafyChocokey603" >> ./application-secret.properties \
echo "SPRING_JWT_SECRET=4twHVaNwpeqqpIklwcjBRUA4dxw1REyT4twHVaNwpeqqpIklwcjBRUA4dxw1REyT4twHVaNwpeqqpIklwcjBRUA4dxw" >> ./application-secret.properties
```

#### 2. 카프카 먼저 실행

0. 챗 서버 디렉토리 이동 `chocoletter-chat/chat`
1. `docker-compose up -d kafka` 명령어로 카프카 컨테이너만 먼저 띄우기
2. `docker exec -it kafka kafka-topics.sh --list --bootstrap-server kafka:9092` 명령어로 토픽 리스트 확인
	- chat 이라는 토픽이 없으면
	- `docker exec -it kafka kafka-topics.sh --create --topic chat --bootstrap-server kafka:9092 --partitions 10 --replication-factor 1` 명령어로 토픽 생성

#### 3. 몽고디비 실행하기

1. `docker-compose up -d mongodb` 명령어로 몽고디비 컨테이너 띄우기


#### 4. 스프링 컨테이너 띄우기

1. `docker-compose up -d spring-boot-app` 명령어로 스프링 컨테이너 띄우기


