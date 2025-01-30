package chocolate.chocoletter.api.alarm.domain;

import chocolate.chocoletter.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Alarm extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private AlarmType type;

    @Column(nullable = false)
    private Long giftId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private Boolean read;

    @Builder
    public Alarm(AlarmType type, Long giftId, Long memberId) {
        this.type = type;
        this.giftId = giftId;
        this.memberId = memberId;
        this.read = false;
    }

    public void readAlarm() {
        this.read = true;
    }
}
