package chocolate.chocoletter.api.giftbox.domain;

import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GiftBox extends BaseTimeEntity {

    @Id
    @Column(unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false, unique = true)
    private Member member;

    @Column(nullable = false)
    private Integer giftCount;

    @Column(nullable = false)
    private Integer generalGiftCount;

    @Column(length = 25, unique = true)
    private String shareCode;

    @Builder
    public GiftBox(Member member) {
        this.member = member;
        this.giftCount = 0;
        this.generalGiftCount = 0;
    }

    public void addGiftCount() {
        this.giftCount++;
    }

    public void addGeneralGiftCount() {
        this.generalGiftCount++;
    }

    public void usePreviewCount() {
        this.generalGiftCount -= 2;
    }

    public void updateShareCode(String shareCode) {
        this.shareCode = shareCode;
    }
}
