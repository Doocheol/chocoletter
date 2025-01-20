package chocolate.chocoletter.api.giftbox.domain;

import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
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

	@OneToOne
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;

	@Column(nullable = false)
	private Integer giftCount;

	@Column(nullable = false, length = 25, unique = true)
	private String shareCode;

	@Builder
	public GiftBox(Member member, String shareCode) {
		this.member = member;
		this.giftCount = 0;
		this.shareCode = shareCode;
	}
}
