package chocolate.chocoletter.api.alarm.domain;

import chocolate.chocoletter.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
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
    private String partnerName;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private Boolean isRead;

    @Builder
    public Alarm(AlarmType type, Long giftId, Long memberId, String partnerName) {
        this.type = type;
        this.giftId = giftId;
        this.memberId = memberId;
        this.isRead = false;
        this.partnerName = partnerName;
    }

    public void readAlarm() {
        this.isRead = true;
    }
}
