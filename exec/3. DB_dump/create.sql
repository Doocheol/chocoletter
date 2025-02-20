create table chat_room
(
    created_at    datetime(6) null,
    guest_gift_id bigint      not null,
    guest_id      bigint      not null,
    host_gift_id  bigint      not null,
    host_id       bigint      not null,
    id            bigint auto_increment
        primary key,
    updated_at    datetime(6) null
);

create table member
(
    send_gift_count int          null,
    created_at      datetime(6)  null,
    id              bigint auto_increment
        primary key,
    updated_at      datetime(6)  null,
    name            varchar(255) not null,
    profile_img_url varchar(255) null,
    public_key      text         null,
    social_id       varchar(255) not null
);

create table alarm
(
    is_read      bit                                                                             not null,
    created_at   datetime(6)                                                                     null,
    gift_id      bigint                                                                          not null,
    id           bigint auto_increment
        primary key,
    member_id    bigint                                                                          null,
    updated_at   datetime(6)                                                                     null,
    partner_name varchar(255)                                                                    not null,
    type         enum ('ACCEPT_SPECIAL', 'RECEIVE_SPECIAL', 'REJECT_SPECIAL', 'UNBOXING_NOTICE') null,
    constraint FK53dra8a3h29id86y823i3blxk
        foreign key (member_id) references member (id)
);

create table gift_box
(
    general_gift_count int         not null,
    gift_count         int         not null,
    type               int         not null,
    created_at         datetime(6) null,
    id                 bigint auto_increment
        primary key,
    member_id          bigint      not null,
    updated_at         datetime(6) null,
    constraint UK2pj39f2chga8yjru4ploklymp
        unique (member_id),
    constraint FKkv37ikd8e7kksx379nv7lu7q9
        foreign key (member_id) references member (id)
);

create table gift
(
    is_accept      bit                         null,
    is_opened      bit                         null,
    created_at     datetime(6)                 null,
    gift_box_id    bigint                      not null,
    id             bigint auto_increment
        primary key,
    receiver_id    bigint                      not null,
    sender_id      bigint                      not null,
    un_boxing_time datetime(6)                 null,
    updated_at     datetime(6)                 null,
    type           enum ('GENERAL', 'SPECIAL') not null,
    constraint FKbjlcvuvmavo2roowg9ikji569
        foreign key (gift_box_id) references gift_box (id)
);

create table letter
(
    created_at datetime(6)               null,
    gift_id    bigint                    not null,
    id         bigint auto_increment
        primary key,
    updated_at datetime(6)               null,
    nickname   varchar(25)               not null,
    answer     text                      null,
    content    text                      null,
    question   varchar(255)              null,
    type       enum ('FREE', 'QUESTION') not null,
    constraint UKc2kg4ewmqmowep0lcy5i8c1mg
        unique (gift_id),
    constraint FK6g5sna5uh6qadbyetm93wu4ff
        foreign key (gift_id) references gift (id)
);

create table question
(
    id      bigint auto_increment
        primary key,
    content varchar(255) not null,
    constraint UK5n6gyhgd1hsemw006xrpd8pkw
        unique (content)
);

create table unboxing_room
(
    is_end      bit         not null,
    created_at  datetime(6) null,
    gift_id     bigint      null,
    id          bigint auto_increment
        primary key,
    receiver_id bigint      not null,
    sender_id   bigint      not null,
    start_time  datetime(6) not null,
    updated_at  datetime(6) null,
    constraint UKl2jflrjw9to9i3w8ix5wm9unf
        unique (gift_id),
    constraint FK9pu4r89q4hc0fx0pgtekcl747
        foreign key (gift_id) references gift (id)
);

create
    definer = chocolate_admin@`%` procedure InsertDummyGiftData(IN total_count int)
BEGIN
    DECLARE i INT DEFAULT 0;

    WHILE i < total_count DO
        INSERT INTO gift (gift_box_id, sender_id, receiver_id, type, un_boxing_time, reject_count, is_accept, created_at, updated_at, is_opened)
        VALUES (
            CASE MOD(i, 4)
                WHEN 0 THEN 66
                WHEN 1 THEN 67
                WHEN 2 THEN 68
                ELSE 69
            END, -- gift_box_id를 66~69 순환 배정
            FLOOR(1 + RAND() * 5000), -- sender_id (1~5000 사이 랜덤)
            CASE MOD(i, 4)
                WHEN 0 THEN 81
                WHEN 1 THEN 82
                WHEN 2 THEN 83
                ELSE 84
            END, -- receiver_id를 81~84 순환 배정
            IF(RAND() > 0.5, 'GENERAL', 'SPECIAL'), -- type (랜덤)
            NOW() + INTERVAL FLOOR(RAND() * 365) DAY, -- unboxing_time (랜덤 날짜)
            FLOOR(RAND() * 5), -- reject_count (0~4 랜덤)
            IF(RAND() > 0.5, TRUE, FALSE), -- is_accept (랜덤)
            NOW(), -- created_at (현재 시간)
            NOW(), -- updated_at (현재 시간)
            IF(RAND() > 0.5, TRUE, FALSE) -- is_opened (랜덤)
        );

        SET i = i + 1;
    END WHILE;
END;

create
    definer = chocolate_admin@`%` procedure insert_massive_data(IN total_letters_per_user int, IN special_gift_count_per_user int)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE user_id INT;
    DECLARE sender_id INT;
    DECLARE gift_id BIGINT;
    DECLARE gift_type ENUM('GENERAL', 'SPECIAL');
    DECLARE letter_type ENUM('FREE_QUESTION', 'SPECIAL');

    -- 81번 ~ 84번 유저에 대해 실행
    WHILE i < 4 DO
        SET user_id = 81 + i;  -- 81, 82, 83, 84 순차적 할당
        SET i = i + 1;

        -- 개별 유저의 데이터 삽입
        BEGIN
            DECLARE j INT DEFAULT 0;

            WHILE j < total_letters_per_user DO
                -- 랜덤 발신자 설정 (1~100)
                SET sender_id = FLOOR(RAND() * 100 + 1);

                -- 랜덤 선물 타입 설정
                SET gift_type = IF(j < special_gift_count_per_user, 'SPECIAL', 'GENERAL');

                -- 1️⃣ 선물 삽입
                INSERT INTO gift (gift_box_id, sender_id, receiver_id, type, unboxing_time, reject_count, is_accept, created_at, updated_at, is_opened)
                VALUES (
                    CASE user_id
                        WHEN 81 THEN 66
                        WHEN 82 THEN 67
                        WHEN 83 THEN 68
                        WHEN 84 THEN 69
                    END,
                    sender_id,
                    user_id,
                    gift_type,
                    NOW(),
                    0,
                    TRUE,
                    NOW(),
                    NOW(),
                    FALSE
                );

                -- 생성된 gift_id 가져오기
                SET gift_id = LAST_INSERT_ID();

                -- 랜덤 편지 타입 설정
                SET letter_type = IF(RAND() < 0.5, 'FREE_QUESTION', 'SPECIAL');

                -- 2️⃣ 편지 삽입
                INSERT INTO letter (gift_id, type, nickname, content, question, answer, created_at, updated_at)
                VALUES (
                    gift_id,
                    letter_type,
                    CONCAT('User_', sender_id),
                    CONCAT('편지 내용 ', sender_id, '-', gift_id),
                    '랜덤 질문',
                    '답변 내용',
                    NOW(),
                    NOW()
                );

                -- 3️⃣ SPECIAL 선물이면 unboxing_room에 삽입
                IF gift_type = 'SPECIAL' THEN
                    INSERT INTO unboxing_room (gift_id, sender_id, receiver_id, created_at, start_time, is_end)
                    VALUES (
                        gift_id,
                        sender_id,
                        user_id,
                        NOW(),
                        NOW(),
                        FALSE
                    );
                END IF;

                SET j = j + 1;
            END WHILE;
        END;
    END WHILE;
END;

create
    definer = chocolate_admin@`%` procedure insert_massive_data2(IN total_letters_per_user int, IN special_gift_count_per_user int)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE user_id INT;
    DECLARE sender_id INT;
    DECLARE gift_id BIGINT;
    DECLARE gift_type ENUM('GENERAL', 'SPECIAL');
    DECLARE letter_type ENUM('FREE_QUESTION', 'SPECIAL');

    -- 81번 ~ 84번 유저에 대해 실행
    WHILE i < 4 DO
        SET user_id = 81 + i;  -- 81, 82, 83, 84 순차적 할당
        SET i = i + 1;

        -- 개별 유저의 데이터 삽입
        BEGIN
            DECLARE j INT DEFAULT 0;

            WHILE j < total_letters_per_user DO
                -- 랜덤 발신자 설정 (1~100)
                SET sender_id = FLOOR(RAND() * 100 + 1);

                -- 랜덤 선물 타입 설정
                SET gift_type = IF(j < special_gift_count_per_user, 'SPECIAL', 'GENERAL');

                -- 1️⃣ 선물 삽입
                INSERT INTO gift (gift_box_id, sender_id, receiver_id, type, un_boxing_time, reject_count, is_accept, created_at, updated_at, is_opened)
                VALUES (
                    CASE user_id
                        WHEN 81 THEN 66
                        WHEN 82 THEN 67
                        WHEN 83 THEN 68
                        WHEN 84 THEN 69
                    END,
                    sender_id,
                    user_id,
                    gift_type,
                    NOW(),
                    0,
                    TRUE,
                    NOW(),
                    NOW(),
                    FALSE
                );

                -- 생성된 gift_id 가져오기
                SET gift_id = LAST_INSERT_ID();

                -- 랜덤 편지 타입 설정
                SET letter_type = IF(RAND() < 0.5, 'FREE_QUESTION', 'SPECIAL');

                -- 2️⃣ 편지 삽입
                INSERT INTO letter (gift_id, type, nickname, content, question, answer, created_at, updated_at)
                VALUES (
                    gift_id,
                    letter_type,
                    CONCAT('User_', sender_id),
                    CONCAT('편지 내용 ', sender_id, '-', gift_id),
                    '랜덤 질문',
                    '답변 내용',
                    NOW(),
                    NOW()
                );

                -- 3️⃣ SPECIAL 선물이면 unboxing_room에 삽입
                IF gift_type = 'SPECIAL' THEN
                    INSERT INTO unboxing_room (gift_id, sender_id, receiver_id, created_at, start_time, is_end)
                    VALUES (
                        gift_id,
                        sender_id,
                        user_id,
                        NOW(),
                        NOW(),
                        FALSE
                    );
                END IF;

                SET j = j + 1;
            END WHILE;
        END;
    END WHILE;
END;

create
    definer = chocolate_admin@`%` procedure insert_massive_data3(IN total_letters_per_user int, IN special_gift_count_per_user int)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE user_id INT;
    DECLARE sender_id INT;
    DECLARE gift_id BIGINT;
    DECLARE gift_type ENUM('GENERAL', 'SPECIAL');
    DECLARE letter_type ENUM('FREE_QUESTION', 'SPECIAL');

    -- 81번 ~ 84번 유저에 대해 실행
    WHILE i < 4 DO
        SET user_id = 81 + i;  -- 81, 82, 83, 84 순차적 할당
        SET i = i + 1;

        -- 개별 유저의 데이터 삽입
        BEGIN
            DECLARE j INT DEFAULT 0;

            WHILE j < total_letters_per_user DO
                -- 랜덤 발신자 설정 (1~100)
                SET sender_id = FLOOR(RAND() * 100 + 1);

                -- 랜덤 선물 타입 설정
                SET gift_type = IF(j < special_gift_count_per_user, 'SPECIAL', 'GENERAL');

                -- 1️⃣ 선물 삽입
                INSERT INTO gift (gift_box_id, sender_id, receiver_id, type, un_boxing_time, reject_count, is_accept, created_at, updated_at, is_opened)
                VALUES (
                    CASE user_id
                        WHEN 81 THEN 66
                        WHEN 82 THEN 67
                        WHEN 83 THEN 68
                        WHEN 84 THEN 69
                    END,
                    sender_id,
                    user_id,
                    gift_type,
                    NOW(),
                    0,
                    TRUE,
                    NOW(),
                    NOW(),
                    FALSE
                );

                -- 생성된 gift_id 가져오기
                SET gift_id = LAST_INSERT_ID();

                -- 랜덤 편지 타입 설정
                SET letter_type = IF(RAND() < 0.5, 'QUESTION', 'FREE');

                -- 2️⃣ 편지 삽입
                INSERT INTO letter (gift_id, type, nickname, content, question, answer, created_at, updated_at)
                VALUES (
                    gift_id,
                    letter_type,
                    CONCAT('User_', sender_id),
                    CONCAT('편지 내용 ', sender_id, '-', gift_id),
                    '랜덤 질문',
                    '답변 내용',
                    NOW(),
                    NOW()
                );

                -- 3️⃣ SPECIAL 선물이면 unboxing_room에 삽입
                IF gift_type = 'SPECIAL' THEN
                    INSERT INTO unboxing_room (gift_id, sender_id, receiver_id, created_at, start_time, is_end)
                    VALUES (
                        gift_id,
                        sender_id,
                        user_id,
                        NOW(),
                        NOW(),
                        FALSE
                    );
                END IF;

                SET j = j + 1;
            END WHILE;
        END;
    END WHILE;
END;

create
    definer = chocolate_admin@`%` procedure insert_massive_data_v2()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE user_id INT;
    DECLARE sender_id INT;
    DECLARE gift_id BIGINT;
    DECLARE gift_type ENUM('GENERAL', 'SPECIAL');
    DECLARE letter_type ENUM('FREE', 'QUESTION');

    -- 1️⃣ 유저 85~90번 데이터 삽입
    WHILE i < 6 DO
        SET user_id = 85 + i;  -- 85 ~ 90 순차적 할당
        SET i = i + 1;

        BEGIN
            DECLARE j INT DEFAULT 0;

            WHILE j < 50 DO
                -- 랜덤 발신자 (85~90 제외)
                SET sender_id = FLOOR(RAND() * 1000 + 1);
                IF sender_id BETWEEN 85 AND 90 THEN
                    SET sender_id = sender_id + 6;
                END IF;

                -- SPECIAL: 80개 / GENERAL: 20개
                SET gift_type = IF(j < 80, 'SPECIAL', 'GENERAL');

                -- 1️⃣ 선물 삽입
                INSERT INTO gift (gift_box_id, sender_id, receiver_id, type, un_boxing_time, reject_count, is_accept, created_at, updated_at, is_opened)
                VALUES (
                    CASE user_id
                        WHEN 85 THEN 70
                        WHEN 86 THEN 71
                        WHEN 87 THEN 72
                        WHEN 88 THEN 73
                        WHEN 89 THEN 74
                        WHEN 90 THEN 75
                    END,
                    sender_id,
                    user_id,
                    gift_type,
                    NOW(),
                    0,
                    TRUE,
                    NOW(),
                    NOW(),
                    FALSE
                );

                -- 생성된 gift_id 가져오기
                SET gift_id = LAST_INSERT_ID();

                -- 랜덤 편지 타입 설정
                SET letter_type = IF(RAND() < 0.5, 'FREE', 'QUESTION');

                -- 2️⃣ 편지 삽입
                INSERT INTO letter (gift_id, type, nickname, content, question, answer, created_at, updated_at)
                VALUES (
                    gift_id,
                    letter_type,
                    CONCAT('User_', sender_id),
                    CONCAT('편지 내용 ', sender_id, '-', gift_id),
                    '랜덤 질문',
                    '답변 내용',
                    NOW(),
                    NOW()
                );

                -- 3️⃣ SPECIAL 선물이면 unboxing_room에 삽입
                IF gift_type = 'SPECIAL' THEN
                    INSERT INTO unboxing_room (gift_id, sender_id, receiver_id, created_at, start_time, is_end)
                    VALUES (
                        gift_id,
                        sender_id,
                        user_id,
                        NOW(),
                        NOW(),
                        FALSE
                    );
                END IF;

                SET j = j + 1;
            END WHILE;
        END;
    END WHILE;

    -- 2️⃣ 가짜 유저 1000명 (85~90 제외) 데이터 삽입
    SET i = 1;
    WHILE i <= 1000 DO
        -- 가짜 유저 ID (85~90 제외)
        IF i BETWEEN 85 AND 90 THEN
            SET user_id = i + 6;
        ELSE
            SET user_id = i;
        END IF;

        SET i = i + 1;

        BEGIN
            DECLARE k INT DEFAULT 0;
            WHILE k < 50 DO
                -- 랜덤 발신자 (85~90 제외)
                SET sender_id = FLOOR(RAND() * 1000 + 1);
                IF sender_id BETWEEN 85 AND 90 THEN
                    SET sender_id = sender_id + 6;
                END IF;

                -- 랜덤 선물 타입 설정 (SPECIAL, GENERAL 랜덤)
                SET gift_type = IF(RAND() < 0.5, 'SPECIAL', 'GENERAL');

                -- 1️⃣ 선물 삽입
                INSERT INTO gift (gift_box_id, sender_id, receiver_id, type, un_boxing_time, reject_count, is_accept, created_at, updated_at, is_opened)
                VALUES (
                    NULL,  -- 가짜 유저는 gift_box_id 없음
                    sender_id,
                    user_id,
                    gift_type,
                    NOW(),
                    0,
                    TRUE,
                    NOW(),
                    NOW(),
                    FALSE
                );

                -- 생성된 gift_id 가져오기
                SET gift_id = LAST_INSERT_ID();

                -- 랜덤 편지 타입 설정
                SET letter_type = IF(RAND() < 0.5, 'FREE', 'QUESTION');

                -- 2️⃣ 편지 삽입
                INSERT INTO letter (gift_id, type, nickname, content, question, answer, created_at, updated_at)
                VALUES (
                    gift_id,
                    letter_type,
                    CONCAT('User_', sender_id),
                    CONCAT('편지 내용 ', sender_id, '-', gift_id),
                    '랜덤 질문',
                    '답변 내용',
                    NOW(),
                    NOW()
                );

                SET k = k + 1;
            END WHILE;
        END;
    END WHILE;

END;

create
    definer = chocolate_admin@`%` procedure insert_test_data(IN total_letters int, IN special_gift_count int)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE rand_sender INT;
    DECLARE rand_receiver INT;
    DECLARE rand_type ENUM('GENERAL', 'SPECIAL');
    DECLARE rand_letter_type ENUM('FREE_QUESTION', 'SPECIAL');
    DECLARE gift_id BIGINT;

    -- 반복문을 사용하여 데이터를 삽입
    WHILE i < total_letters DO
        -- 랜덤 발신자와 수신자 설정 (81~84는 수신자)
        SET rand_sender = FLOOR(RAND() * 100 + 1);
        SET rand_receiver = 81 + FLOOR(RAND() * 4);

        -- 랜덤 gift 타입 (50% 확률로 SPECIAL, GENERAL)
        SET rand_type = IF(RAND() < 0.5, 'GENERAL', 'SPECIAL');

        -- 1️⃣ 선물 삽입
        INSERT INTO gift (gift_box_id, sender_id, receiver_id, type, unboxing_time, reject_count, is_accept, created_at, updated_at, is_opened)
        VALUES (
            CASE rand_receiver
                WHEN 81 THEN 66
                WHEN 82 THEN 67
                WHEN 83 THEN 68
                WHEN 84 THEN 69
            END,
            rand_sender,
            rand_receiver,
            rand_type,
            NOW(),
            0,
            TRUE,
            NOW(),
            NOW(),
            FALSE
        );

        -- 방금 삽입한 선물의 ID 가져오기
        SET gift_id = LAST_INSERT_ID();

        -- 랜덤 편지 타입 설정
        SET rand_letter_type = IF(RAND() < 0.5, 'FREE_QUESTION', 'SPECIAL');

        -- 2️⃣ 편지 삽입
        INSERT INTO letter (gift_id, type, nickname, content, question, answer, created_at, updated_at)
        VALUES (
            gift_id,
            rand_letter_type,
            CONCAT('User_', rand_sender),
            CONCAT('편지 내용 ', rand_sender, '-', gift_id),
            '랜덤 질문',
            '답변 내용',
            NOW(),
            NOW()
        );

        -- SPECIAL 선물일 경우 언박싱룸 생성 (10000개까지만)
        IF rand_type = 'SPECIAL' AND i < special_gift_count THEN
            INSERT INTO unboxing_room (gift_id, sender_id, receiver_id, created_at, start_time, is_end)
            VALUES (
                gift_id,
                rand_sender,
                rand_receiver,
                NOW(),
                NOW(),
                FALSE
            );
        END IF;

        SET i = i + 1;
    END WHILE;
END;

create
    definer = chocolate_admin@`%` procedure insert_test_data50(IN total_letters int, IN special_gift_count int)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE rand_sender INT;
    DECLARE rand_receiver INT;
    DECLARE rand_type ENUM('GENERAL', 'SPECIAL');
    DECLARE rand_letter_type ENUM('FREE', 'QUESTION');
    DECLARE gift_id BIGINT;

    -- 반복문을 사용하여 데이터를 삽입
    WHILE i < total_letters DO
        -- 랜덤 발신자와 수신자 설정 (81~84는 수신자)
        SET rand_sender = FLOOR(RAND() * 100 + 1);
        SET rand_receiver = 81 + FLOOR(RAND() * 4);

        -- 랜덤 gift 타입 (50% 확률로 SPECIAL, GENERAL)
        SET rand_type = IF(RAND() < 0.5, 'GENERAL', 'SPECIAL');

        -- 1️⃣ 선물 삽입
        INSERT INTO gift (gift_box_id, sender_id, receiver_id, type, un_boxing_time, reject_count, is_accept, created_at, updated_at, is_opened)
        VALUES (
            CASE rand_receiver
                WHEN 81 THEN 66
                WHEN 82 THEN 67
                WHEN 83 THEN 68
                WHEN 84 THEN 69
            END,
            rand_sender,
            rand_receiver,
            rand_type,
            NOW(),
            0,
            TRUE,
            NOW(),
            NOW(),
            FALSE
        );

        -- 방금 삽입한 선물의 ID 가져오기
        SET gift_id = LAST_INSERT_ID();

        -- 랜덤 편지 타입 설정
        SET rand_letter_type = IF(RAND() < 0.5, 'FREE', 'QUESTION');

        -- 2️⃣ 편지 삽입
        INSERT INTO letter (gift_id, type, nickname, content, question, answer, created_at, updated_at)
        VALUES (
            gift_id,
            rand_letter_type,
            CONCAT('User_', rand_sender),
            CONCAT('편지 내용 ', rand_sender, '-', gift_id),
            '랜덤 질문',
            '답변 내용',
            NOW(),
            NOW()
        );

        -- SPECIAL 선물일 경우 언박싱룸 생성 (10000개까지만)
        IF rand_type = 'SPECIAL' AND i < special_gift_count THEN
            INSERT INTO unboxing_room (gift_id, sender_id, receiver_id, created_at, start_time, is_end)
            VALUES (
                gift_id,
                rand_sender,
                rand_receiver,
                NOW(),
                NOW(),
                FALSE
            );
        END IF;

        SET i = i + 1;
    END WHILE;
END;

