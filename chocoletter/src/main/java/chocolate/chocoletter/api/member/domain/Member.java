package chocolate.chocoletter.api.member.domain;

import chocolate.chocoletter.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
public class Member extends BaseTimeEntity {

	@Id
	@Column(unique = true, nullable = false)
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String socialId;

	@Column(nullable = false, unique = true)
	private String alarmAddress;

	@Column(nullable = false)
	private Integer sendGiftCount;

	@Builder
	public Member(String name, String socialId, String alarmAddress) {
		this.name = name;
		this.socialId = socialId;
		this.alarmAddress = alarmAddress;
		this.sendGiftCount = 0;
	}
}
